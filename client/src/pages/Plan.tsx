import { PLAN_PHASES } from "@/lib/mockData";
import { Coffee, Plane, Utensils, Moon, RefreshCw, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";

const iconMap = {
  Coffee,
  Plane,
  Utensils,
  Moon
};

// Mock schedule data generator
const generateMockSchedule = () => {
  const today = new Date();
  const schedule: Record<string, "duty" | "rest"> = {};
  // Set some random days as duty
  for (let i = -5; i < 35; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    // Random pattern: 3 days on, 2 days off
    schedule[dateStr] = (i % 5 < 3) ? "duty" : "rest";
  }
  return schedule;
};

export default function Plan() {
  const [mealVariations, setMealVariations] = useState<Record<number, number>>({});
  const [schedule, setSchedule] = useState<Record<string, "duty" | "rest">>(generateMockSchedule());
  const [currentDate, setCurrentDate] = useState(new Date());

  const toggleVariation = (index: number, max: number) => {
    setMealVariations(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) + 1) % max
    }));
  };

  const toggleDutyStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSchedule(prev => ({
      ...prev,
      [dateStr]: prev[dateStr] === "duty" ? "rest" : "duty"
    }));
  };

  const getStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedule[dateStr] || "rest";
  };

  // View Components
  const DailyView = () => (
    <div className="relative border-l border-border ml-3 space-y-8 pl-8 py-2 animate-in fade-in slide-in-from-bottom-2">
      {PLAN_PHASES.map((phase, index) => {
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
                <p className="text-sm text-foreground leading-relaxed font-medium mb-1">
                  {phase.foodEquivalents ? phase.foodEquivalents[currentVariation] : phase.guidance}
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
        const isActive = isSameDay(day, currentDate);
        const isTodayDate = isToday(day);
        
        return (
          <button
            key={i}
            onClick={() => toggleDutyStatus(day)}
            className={cn(
              "aspect-square rounded-sm border p-1 flex flex-col justify-between transition-all hover:scale-105",
              status === "duty" 
                ? "bg-primary/10 border-primary/30 hover:bg-primary/20" 
                : "bg-card border-border hover:bg-muted/10",
              isActive && "ring-1 ring-primary shadow-[0_0_10px_rgba(46,204,113,0.2)]"
            )}
          >
            <div className="flex justify-between items-start">
              <span className={cn(
                "text-xs font-mono",
                isTodayDate ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {format(day, 'd')}
              </span>
              {status === "duty" && <Plane className="w-3 h-3 text-primary/50" />}
            </div>
            <div className="text-[9px] font-mono uppercase tracking-tighter self-end text-muted-foreground">
              {status === "duty" ? "FLY" : "OFF"}
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
                  onClick={() => toggleDutyStatus(currentDate)}
                >
                  CHANGE
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
            <div className="bg-muted/10 p-3 rounded border border-border text-xs text-muted-foreground font-mono">
              <p>TIP: Tap any day to toggle between DUTY and REST status.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-mono text-sm text-primary uppercase">{format(currentDate, "MMMM yyyy")}</h3>
            </div>
            <CalendarGrid days={eachDayOfInterval({
              start: startOfMonth(currentDate),
              end: endOfMonth(currentDate)
            })} />
             <div className="bg-muted/10 p-3 rounded border border-border text-xs text-muted-foreground font-mono">
              <p>TIP: Tap any day to toggle between DUTY and REST status.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
