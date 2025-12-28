import { PLAN_PHASES } from "@/lib/mockData";
import { Coffee, Plane, Utensils, Moon, RefreshCw, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Activity, MapPin, Clock, ArrowRight, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addHours, addMinutes } from "date-fns";
import { AirportSelect } from "@/components/ui/airport-select";
import airportsData from "@/lib/airports.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const iconMap = {
  Coffee,
  Plane,
  Utensils,
  Moon
};

// Type definition for airport data
interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

interface FlightSegment {
    origin: string;
    destination: string;
    flightNumber: string;
    departureTime: string; // HH:mm
    duration: string; // HH:mm
}

interface DaySchedule {
    status: "duty" | "rest";
    segments: FlightSegment[];
}

const AIRPORTS_MAP = (airportsData as Airport[]).reduce((acc, airport) => {
  acc[airport.code] = airport;
  return acc;
}, {} as Record<string, Airport>);

// Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

// Mock data generation
const generateMockData = () => {
  const today = new Date();
  const schedule: Record<string, DaySchedule> = {};
  const stats: Record<string, { score: number, energy: number, mood: number }> = {};
  
  // Generate data for 2 months back and forward
  for (let i = -60; i < 60; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Pattern: 3 days on, 2 days off
    const isDuty = (Math.abs(i) % 5 < 3);
    
    schedule[dateStr] = {
        status: isDuty ? "duty" : "rest",
        segments: isDuty ? [
            {
                origin: "LHR",
                destination: "JFK",
                flightNumber: "BA112",
                departureTime: "08:30",
                duration: "07:45"
            }
        ] : []
    };
    
    // Random stats
    // Skew towards better scores generally, but some bad days
    const baseScore = 70 + Math.random() * 30; // 70-100 base
    const fatiguePenalty = (i % 5 === 2) ? Math.random() * 20 : 0; // Last day of block is tiring
    const score = Math.max(0, Math.min(100, Math.round(baseScore - fatiguePenalty)));
    
    stats[dateStr] = {
      score,
      energy: Math.round(score * 0.9), // Correlated
      mood: Math.round(score / 20) // 1-5
    };
  }
  return { schedule, stats };
};

const getPerformanceColor = (score: number) => {
  if (score >= 80) return "bg-emerald-500/20 text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/30";
  if (score >= 50) return "bg-amber-500/20 text-amber-500 border-amber-500/50 hover:bg-amber-500/30";
  return "bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30";
};

export default function Plan() {
  const initialData = useMemo(() => generateMockData(), []);
  const [mealVariations, setMealVariations] = useState<Record<number, number>>({});
  const [schedule, setSchedule] = useState(initialData.schedule);
  const [stats] = useState(initialData.stats);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<DaySchedule>({ status: "rest", segments: [] });

  // Flight Calculator State
  const [origin, setOrigin] = useState<string>("LHR");
  const [destination, setDestination] = useState<string>("JFK");
  const [activePlan, setActivePlan] = useState<any[]>(PLAN_PHASES);
  const [flightTime, setFlightTime] = useState<string>("07:30");
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateFlight = () => {
    if (!AIRPORTS_MAP[origin] || !AIRPORTS_MAP[destination]) return;

    const start = AIRPORTS_MAP[origin];
    const end = AIRPORTS_MAP[destination];
    
    const distance = calculateDistance(start.lat, start.lon, end.lat, end.lon);
    const speed = 850; // km/h avg cruise speed
    const durationHours = distance / speed;
    
    const hours = Math.floor(durationHours);
    const minutes = Math.round((durationHours - hours) * 60);
    
    const durationStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setFlightTime(durationStr);
    
    // Generate new schedule based on duration
    // Start time assumed 08:00 for simplicity in this prototype, or current time
    // For demo purposes, we will just shift the static phases to match duration more realistically
    
    const newPhases = [
        {
            time: "PRE-FLIGHT (-02:00)",
            phase: "Pre-Duty Fueling",
            guidance: "Complex carbs + moderate protein. Hydrate with electrolytes.",
            icon: "Coffee",
            macros: { protein: 30, carbs: 50, fat: 15 },
            foodEquivalents: PLAN_PHASES[0].foodEquivalents
        },
        {
            time: `FLIGHT (00:00 - ${durationStr})`,
            phase: "Cruise Operations",
            guidance: `Duration: ${hours}h ${minutes}m. Eat light every 2-3 hours. Avoid heavy fats.`,
            icon: "Plane",
            macros: { protein: 25, carbs: 35, fat: 10 },
            foodEquivalents: PLAN_PHASES[1].foodEquivalents
        },
        {
            time: "POST-LANDING (+01:00)",
            phase: "Recovery Meal",
            guidance: "High protein + carbs to replenish glycogen. Adaptation strategy.",
            icon: "Utensils",
            macros: { protein: 40, carbs: 60, fat: 10 },
            foodEquivalents: PLAN_PHASES[2].foodEquivalents
        },
        {
            time: "REST PERIOD",
            phase: "Sleep Protocol",
            guidance: "Magnesium + Sleep hygiene. Dark room. No screens 1h before bed.",
            icon: "Moon",
            macros: { protein: 25, carbs: 10, fat: 5 },
            foodEquivalents: PLAN_PHASES[3].foodEquivalents
        }
    ];

    if (hours > 8) {
        // Add a second meal for long haul
        newPhases.splice(2, 0, {
            time: "CRUISE MEAL 2",
            phase: "Mid-Flight Fuel",
            guidance: "Protein rich snack/meal to maintain alertness.",
            icon: "Utensils",
            macros: { protein: 25, carbs: 20, fat: 10 },
            foodEquivalents: PLAN_PHASES[1].foodEquivalents
        });
    }

    setActivePlan(newPhases);
    setIsCalculated(true);
  };

  const toggleVariation = (index: number, max: number) => {
    setMealVariations(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) + 1) % max
    }));
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingSchedule = schedule[dateStr] || { status: "rest", segments: [] };
    setEditingSchedule(JSON.parse(JSON.stringify(existingSchedule))); // Deep copy
    setIsDialogOpen(true);
  };

  const saveSchedule = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setSchedule(prev => ({
        ...prev,
        [dateStr]: editingSchedule
    }));
    setIsDialogOpen(false);
  };
  
  const addSegment = () => {
      setEditingSchedule(prev => ({
          ...prev,
          segments: [...prev.segments, {
              origin: "LHR",
              destination: "JFK",
              flightNumber: "",
              departureTime: "08:00",
              duration: "07:00"
          }]
      }));
  };

  const updateSegment = (index: number, field: keyof FlightSegment, value: string) => {
      const newSegments = [...editingSchedule.segments];
      newSegments[index] = { ...newSegments[index], [field]: value };
      setEditingSchedule(prev => ({
          ...prev,
          segments: newSegments
      }));
  };

  const removeSegment = (index: number) => {
      const newSegments = [...editingSchedule.segments];
      newSegments.splice(index, 1);
      setEditingSchedule(prev => ({
          ...prev,
          segments: newSegments
      }));
  };

  const getStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule[dateStr]?.status || "rest";
  };
  
  const getSegments = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule[dateStr]?.segments || [];
  };

  const getDayStats = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return stats[dateStr];
  };

  // View Components
  const DailyView = () => (
    <div className="space-y-6">
       {/* Flight Calculator Section */}
       <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-primary/10 p-2 rounded-full">
                <Plane className="w-4 h-4 text-primary" />
             </div>
             <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Active Sector</h3>
                <p className="text-[10px] text-muted-foreground font-mono">CALCULATE FLIGHT & NUTRITION</p>
             </div>
          </div>
          
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end mb-4">
             <div className="space-y-1.5 w-full">
                <AirportSelect 
                  label="Origin" 
                  value={origin} 
                  onValueChange={setOrigin} 
                />
             </div>
             
             <div className="pb-2 text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
             </div>
             
             <div className="space-y-1.5 w-full">
                <AirportSelect 
                  label="Dest" 
                  value={destination} 
                  onValueChange={setDestination} 
                />
             </div>
          </div>
          
          <Button onClick={calculateFlight} className="w-full font-mono text-xs tracking-wider mb-2" size="sm">
             <Activity className="w-3 h-3 mr-2" /> CALCULATE PROFILE
          </Button>

          {isCalculated && (
             <div className="mt-3 pt-3 border-t border-border flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                <div className="text-xs text-muted-foreground font-mono">EST. FLIGHT TIME</div>
                <div className="text-lg font-bold font-mono text-primary flex items-center gap-2">
                   <Clock className="w-4 h-4" />
                   {flightTime}
                </div>
             </div>
          )}
       </div>

    <div className="relative border-l border-border ml-3 space-y-8 pl-8 py-2 animate-in fade-in slide-in-from-bottom-2">
      {activePlan.map((phase, index) => {
        const Icon = iconMap[phase.icon as keyof typeof iconMap] || Plane;
        const currentVariation = mealVariations[index] || 0;
        const variationCount = phase.foodEquivalents?.length || 1;
        
        return (
          <div key={index} className="relative">
            {/* Timeline Dot */}
            <div className={cn(
              "absolute -left-[41px] top-0 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center z-10",
              index === 1 ? "border-primary text-primary shadow-[0_0_10px_rgba(46,204,113,0.3)]" : "text-muted-foreground"
            )}>
              <Icon size={14} />
            </div>

            {/* Content Card */}
            <div className={cn(
              "cockpit-panel p-4 transition-all duration-300 group",
              index === 1 ? "border-primary/40 ring-1 ring-primary/20" : "opacity-80 hover:opacity-100"
            )}>
              <div className="flex justify-between items-start mb-2">
                <h3 className={cn(
                  "text-sm font-bold uppercase tracking-wider",
                  index === 1 ? "text-primary" : "text-foreground"
                )}>
                  {phase.phase}
                </h3>
                <span className="font-mono text-xs text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded">
                  {phase.time}
                </span>
              </div>
              
              {/* Targets */}
              {phase.macros && (
                 <div className="flex gap-2 mb-3">
                    <div className="bg-muted/30 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground">
                      PRO: <span className="text-foreground">{phase.macros.protein}g</span>
                    </div>
                    <div className="bg-muted/30 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground">
                      CARB: <span className="text-foreground">{phase.macros.carbs}g</span>
                    </div>
                    <div className="bg-muted/30 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground">
                      FAT: <span className="text-foreground">{phase.macros.fat}g</span>
                    </div>
                 </div>
              )}

              <div className="relative">
                {/* Food Image */}
                {phase.foodEquivalents && (
                  <div className="mb-3 rounded-lg overflow-hidden h-32 w-full relative group/img">
                    <img 
                      src={phase.foodEquivalents[currentVariation].image} 
                      alt="Meal example"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <p className="text-sm text-foreground leading-relaxed font-medium mb-1">
                  {phase.foodEquivalents ? phase.foodEquivalents[currentVariation].name : phase.guidance}
                </p>
                
                 {/* Swap Control */}
                 {variationCount > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleVariation(index, variationCount)}
                    className="h-6 px-2 text-[10px] font-mono text-primary hover:text-primary hover:bg-primary/10 mt-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    SWAP OPTION ({currentVariation + 1}/{variationCount})
                  </Button>
                 )}
                 
                 <p className="text-xs text-muted-foreground mt-2 italic border-t border-border/50 pt-2">
                   *Swap based on preference/tolerance. All amounts are estimates.
                 </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );

  const CalendarGrid = ({ days }: { days: Date[] }) => (
    <div className="grid grid-cols-7 gap-2 animate-in fade-in zoom-in-95">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
        <div key={day} className="text-center text-[10px] font-mono text-muted-foreground uppercase py-2">
          {day}
        </div>
      ))}
      {days.map((day, i) => {
        const status = getStatus(day);
        const segments = getSegments(day);
        const dayStats = getDayStats(day);
        const isActive = isSameDay(day, currentDate);
        const isTodayDate = isToday(day);
        
        // Color logic:
        // Base color depends on performance score (Green/Amber/Red)
        // If Duty: Solid fill of that color
        // If Rest: Outline or minimal fill of that color
        
        let colorClass = "bg-card border-border hover:bg-muted/10"; // Default
        
        if (dayStats) {
             colorClass = getPerformanceColor(dayStats.score);
             // Adjust opacity/style for Rest vs Duty
             if (status === "rest") {
                 // De-emphasize rest days slightly but keep color coding
                 colorClass = colorClass.replace('bg-', 'bg-opacity-10 bg-'); 
             }
        } else {
            // Fallback for days without stats (future far out)
            if (status === "duty") {
                colorClass = "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20";
            }
        }

        return (
          <button
            key={i}
            onClick={() => handleDateClick(day)}
            className={cn(
              "aspect-square rounded-sm border p-1 flex flex-col justify-between transition-all hover:scale-105 relative overflow-hidden group",
              colorClass,
              isActive && "ring-1 ring-primary shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            )}
          >
            {/* Tiny progress bar for energy/score */}
            {dayStats && (
               <div 
                 className="absolute bottom-0 left-0 h-1 bg-current opacity-30 transition-all" 
                 style={{ width: `${dayStats.score}%` }} 
               />
            )}
            
            <div className="flex justify-between items-start w-full z-10">
              <span className={cn(
                "text-xs font-mono",
                isTodayDate ? "font-bold underline decoration-2 underline-offset-2" : "opacity-80"
              )}>
                {format(day, 'd')}
              </span>
              {status === "duty" && <Plane className="w-3 h-3 opacity-70" />}
              {status === "rest" && <Coffee className="w-3 h-3 opacity-70" />}
            </div>
            
            <div className="flex items-end justify-between w-full z-10">
               <div className="flex flex-col items-start w-full">
                   <div className="text-[9px] font-mono uppercase tracking-tighter opacity-80">
                      {status === "duty" ? "FLY" : "OFF"}
                   </div>
                   {/* Show tiny destination code if flight */}
                   {segments.length > 0 && (
                       <div className="text-[8px] font-mono font-bold truncate w-full text-left mt-0.5 opacity-60">
                         {segments[0].destination}
                       </div>
                   )}
               </div>
               
               {dayStats && (
                 <div className="text-[8px] font-mono opacity-60 absolute bottom-1 right-1">
                    {dayStats.score}%
                 </div>
               )}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-2">
        <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Flight Planning</h1>
        <p className="text-xs text-muted-foreground font-mono">ROSTER MANAGEMENT & NUTRITION</p>
      </header>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20 border border-border mb-6">
          <TabsTrigger value="daily" className="font-mono text-xs">DAILY</TabsTrigger>
          <TabsTrigger value="weekly" className="font-mono text-xs">WEEKLY</TabsTrigger>
          <TabsTrigger value="monthly" className="font-mono text-xs">MONTHLY</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="flex justify-between items-center mb-4 bg-card border border-border p-3 rounded-md">
             <div className="flex items-center gap-2">
               <CalendarIcon className="w-4 h-4 text-primary" />
               <span className="font-mono text-sm">{format(currentDate, "EEEE, d MMM yyyy").toUpperCase()}</span>
             </div>
             <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs font-mono px-2 py-1 rounded border uppercase",
                  getStatus(currentDate) === "duty" 
                    ? "bg-primary/10 border-primary/30 text-primary" 
                    : "bg-secondary/10 border-secondary/30 text-secondary"
                )}>
                  {getStatus(currentDate).toUpperCase()}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px]"
                  onClick={() => handleDateClick(currentDate)}
                >
                  EDIT SCHEDULE
                </Button>
             </div>
          </div>
          <DailyView />
        </TabsContent>

        <TabsContent value="weekly">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-mono text-sm text-primary uppercase">Week of {format(startOfWeek(currentDate), "d MMM")}</h3>
            </div>
            <CalendarGrid days={eachDayOfInterval({
              start: startOfWeek(currentDate),
              end: addDays(startOfWeek(currentDate), 6)
            })} />
            <div className="grid grid-cols-3 gap-2 mt-4">
               <div className="bg-emerald-500/10 border border-emerald-500/30 p-2 rounded text-[10px] text-emerald-500 text-center font-mono">OPTIMAL &gt;80%</div>
               <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded text-[10px] text-amber-500 text-center font-mono">AVG 50-79%</div>
               <div className="bg-destructive/10 border border-destructive/30 p-2 rounded text-[10px] text-destructive text-center font-mono">LOW &lt;50%</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
               <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCurrentDate(addDays(currentDate, -30))}>
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-mono text-sm text-primary uppercase w-32 text-center">{format(currentDate, "MMMM yyyy")}</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCurrentDate(addDays(currentDate, 30))}>
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
            <CalendarGrid days={eachDayOfInterval({
              start: startOfMonth(currentDate),
              end: endOfMonth(currentDate)
            })} />
             <div className="bg-muted/10 p-3 rounded border border-border text-xs text-muted-foreground font-mono flex gap-2 items-center">
              <Activity className="w-4 h-4" />
              <p>Colors indicate performance score (Energy/Sleep/Mood).</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Schedule Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
             <DialogHeader>
                 <DialogTitle>Edit Schedule</DialogTitle>
                 <DialogDescription>
                     {selectedDate && format(selectedDate, 'EEEE, MMMM do, yyyy')}
                 </DialogDescription>
             </DialogHeader>
             
             <div className="space-y-6 py-4">
                 {/* Duty Status Toggle */}
                 <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="space-y-0.5">
                        <Label className="text-base">Flight Duty</Label>
                        <p className="text-xs text-muted-foreground">Is this a flying day?</p>
                    </div>
                    <Switch 
                        checked={editingSchedule.status === "duty"}
                        onCheckedChange={(checked) => {
                            setEditingSchedule(prev => ({
                                ...prev,
                                status: checked ? "duty" : "rest"
                            }));
                        }}
                    />
                 </div>
                 
                 {/* Flight Segments */}
                 {editingSchedule.status === "duty" && (
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Scheduled Sectors</Label>
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={addSegment}>
                                <Plus className="w-3 h-3 mr-1" /> Add Sector
                            </Button>
                        </div>
                        
                        {editingSchedule.segments.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                No flights scheduled yet.
                            </div>
                        )}
                        
                        {editingSchedule.segments.map((segment, index) => (
                            <div key={index} className="border rounded-lg p-4 relative bg-muted/10 space-y-3">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute top-2 right-2 h-6 w-6 opacity-50 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => removeSegment(index)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Flight No.</Label>
                                        <Input 
                                            className="h-8 text-xs font-mono" 
                                            placeholder="BA123"
                                            value={segment.flightNumber}
                                            onChange={(e) => updateSegment(index, 'flightNumber', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Dep Time</Label>
                                        <Input 
                                            type="time" 
                                            className="h-8 text-xs font-mono"
                                            value={segment.departureTime}
                                            onChange={(e) => updateSegment(index, 'departureTime', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase text-muted-foreground">Duration</Label>
                                        <Input 
                                            type="time" 
                                            className="h-8 text-xs font-mono"
                                            value={segment.duration}
                                            onChange={(e) => updateSegment(index, 'duration', e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                                     <div className="space-y-1 w-full">
                                        <AirportSelect 
                                            label="Origin"
                                            value={segment.origin}
                                            onValueChange={(val) => updateSegment(index, 'origin', val)}
                                        />
                                     </div>
                                     <div className="pb-2 text-muted-foreground">
                                        <ArrowRight className="w-3 h-3" />
                                     </div>
                                     <div className="space-y-1 w-full">
                                        <AirportSelect 
                                            label="Dest"
                                            value={segment.destination}
                                            onValueChange={(val) => updateSegment(index, 'destination', val)}
                                        />
                                     </div>
                                </div>
                            </div>
                        ))}
                     </div>
                 )}
                 
                 {editingSchedule.status === "rest" && (
                     <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 text-center">
                         <Coffee className="w-8 h-8 text-secondary mx-auto mb-2 opacity-50" />
                         <h4 className="text-sm font-bold text-secondary">Rest Period</h4>
                         <p className="text-xs text-muted-foreground mt-1">
                             Focus on recovery, sleep hygiene, and nutrition.
                         </p>
                     </div>
                 )}
             </div>
             
             <DialogFooter>
                 <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                 <Button onClick={saveSchedule}>Save Changes</Button>
             </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
