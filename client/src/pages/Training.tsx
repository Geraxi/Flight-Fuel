import { useState } from "react";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dumbbell, RefreshCw, Timer, Calendar, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const MOCK_EXERCISES = {
  strength: [
    { name: "Barbell Squat", sets: "3-4", reps: "6-8", rest: "3m" },
    { name: "Romanian Deadlift", sets: "3", reps: "8-10", rest: "2m" },
    { name: "Overhead Press", sets: "3", reps: "8-10", rest: "2m" },
    { name: "Pull-ups (Weighted)", sets: "3", reps: "AMRAP", rest: "2m" },
  ],
  conditioning: [
    { name: "Row Erg Intervals", sets: "10", reps: "500m", rest: "1:1" },
    { name: "Kettlebell Swings", sets: "5", reps: "20", rest: "1m" },
    { name: "Box Jumps", sets: "4", reps: "12", rest: "90s" },
    { name: "Burpees", sets: "3", reps: "15", rest: "60s" },
  ],
  mobility: [
    { name: "Thoracic Rotation", sets: "2", reps: "10/side", rest: "-" },
    { name: "Hip 90/90", sets: "2", reps: "60s/side", rest: "-" },
    { name: "Ankle Dorsiflexion", sets: "2", reps: "15/side", rest: "-" },
  ]
};

const ALTERNATIVES = {
  "Barbell Squat": ["Goblet Squat", "Leg Press", "Bulgarian Split Squat"],
  "Romanian Deadlift": ["Hamstring Curl", "Kettlebell Swing", "Good Morning"],
  "Overhead Press": ["Dumbbell Press", "Landmine Press", "Push-ups"],
  "Pull-ups (Weighted)": ["Lat Pulldown", "Inverted Row", "Dumbbell Row"],
  "Row Erg Intervals": ["Air Bike", "Treadmill Sprints", "Jump Rope"],
  "Kettlebell Swings": ["Broad Jumps", "Clean & Press", "Medicine Ball Slams"],
  "Box Jumps": ["Step-ups", "Jump Squats", "Tuck Jumps"],
  "Burpees": ["Mountain Climbers", "Thrusters", "Bear Crawls"],
  "Thoracic Rotation": ["Cat-Cow", "Open Book", "Thread the Needle"],
  "Hip 90/90": ["Pigeon Pose", "Frog Stretch", "Couch Stretch"],
  "Ankle Dorsiflexion": ["Calf Stretch", "Down Dog", "Tibialis Raise"]
};

type TrainingPreferences = {
  experience: "Beginner" | "Intermediate" | "Advanced";
  goal: "Build Strength" | "Build Muscle" | "Lose Fat" | "Maintenance";
  daysPerWeek: number;
  sessionLength: number;
  equipment: "Full Gym" | "Dumbbells Only" | "Bodyweight";
};

export default function Training() {
  const [prefs, setPrefs] = useState<TrainingPreferences>({
    experience: "Intermediate",
    goal: "Maintenance",
    daysPerWeek: 3,
    sessionLength: 45,
    equipment: "Full Gym"
  });

  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [swappedExercises, setSwappedExercises] = useState<Record<string, string>>({});

  const generatePlan = () => {
    // Mock plan generation logic
    const plan = [];
    const days = prefs.daysPerWeek;
    
    for (let i = 0; i < days; i++) {
      let type: "strength" | "conditioning" | "mobility" = "strength";
      if (prefs.goal === "Lose Fat" && i % 2 !== 0) type = "conditioning";
      if (prefs.goal === "Maintenance" && i === days - 1) type = "mobility";
      
      const exercises = [...MOCK_EXERCISES[type]];
      // Trim based on session length
      if (prefs.sessionLength < 45) exercises.splice(2); // Short session
      else if (prefs.sessionLength > 60) exercises.push(...MOCK_EXERCISES.mobility.slice(0, 2)); // Add mobility to long sessions
      
      plan.push({
        day: i + 1,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        exercises
      });
    }
    setGeneratedPlan(plan);
    setSwappedExercises({}); // Reset swaps
  };

  const handleSwap = (originalName: string, currentName: string) => {
    const alts = ALTERNATIVES[originalName as keyof typeof ALTERNATIVES] || [];
    const currentIndex = alts.indexOf(currentName);
    
    let nextName;
    if (currentIndex === -1) {
        nextName = alts[0];
    } else {
        nextName = alts[(currentIndex + 1) % alts.length];
        if (currentIndex === alts.length - 1) nextName = originalName; // Cycle back to original
    }
    
    setSwappedExercises(prev => ({
        ...prev,
        [originalName]: nextName
    }));
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6 flex items-center gap-3">
         <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
          <Dumbbell className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Training Brief</h1>
          <p className="text-xs text-muted-foreground font-mono">PHYSICAL READINESS</p>
        </div>
      </header>

      {/* Configuration Panel */}
      <CockpitCard title="Mission Parameters">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label className="text-[10px] font-mono uppercase text-muted-foreground">Experience Profile</Label>
                <Select value={prefs.experience} onValueChange={(v: any) => setPrefs({...prefs, experience: v})}>
                    <SelectTrigger className="h-8 text-xs font-mono"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label className="text-[10px] font-mono uppercase text-muted-foreground">Objective</Label>
                <Select value={prefs.goal} onValueChange={(v: any) => setPrefs({...prefs, goal: v})}>
                    <SelectTrigger className="h-8 text-xs font-mono"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Build Strength">Build Strength</SelectItem>
                        <SelectItem value="Build Muscle">Build Muscle</SelectItem>
                        <SelectItem value="Lose Fat">Lose Fat</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>

          <div className="space-y-2">
             <Label className="text-[10px] font-mono uppercase text-muted-foreground flex justify-between">
                <span>Frequency</span>
                <span className="text-primary">{prefs.daysPerWeek} Days/Wk</span>
             </Label>
             <Slider 
                value={[prefs.daysPerWeek]} 
                min={1} 
                max={6} 
                step={1}
                onValueChange={([v]) => setPrefs({...prefs, daysPerWeek: v})}
                className="[&_.bg-primary]:bg-primary"
             />
          </div>

          <div className="space-y-2">
             <Label className="text-[10px] font-mono uppercase text-muted-foreground flex justify-between">
                <span>Session Duration</span>
                <span className="text-primary">{prefs.sessionLength} Min</span>
             </Label>
             <Slider 
                value={[prefs.sessionLength]} 
                min={15} 
                max={90} 
                step={15}
                onValueChange={([v]) => setPrefs({...prefs, sessionLength: v})}
                className="[&_.bg-primary]:bg-primary"
             />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-mono uppercase text-muted-foreground">Available Assets (Equipment)</Label>
            <Select value={prefs.equipment} onValueChange={(v: any) => setPrefs({...prefs, equipment: v})}>
                <SelectTrigger className="h-8 text-xs font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Full Gym">Full Gym Access</SelectItem>
                    <SelectItem value="Dumbbells Only">Limited (DBs Only)</SelectItem>
                    <SelectItem value="Bodyweight">No Equipment (Hotel)</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <Button onClick={generatePlan} className="w-full font-mono tracking-wider text-xs" size="sm">
            <Activity className="w-3 h-3 mr-2" /> GENERATE PROTOCOL
          </Button>
        </div>
      </CockpitCard>

      {/* Generated Plan */}
      {generatedPlan && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="flex items-center justify-between border-b border-primary/30 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Active Protocol</h2>
              <span className="text-[10px] font-mono text-muted-foreground">WK-{Math.floor(Math.random() * 52) + 1}</span>
           </div>

           {generatedPlan.map((session: any, i: number) => (
             <CockpitCard key={i} title={`Session ${session.day} // ${session.type}`} className="border-border/60">
                <div className="space-y-3">
                   {session.exercises.map((ex: any, j: number) => {
                     const currentName = swappedExercises[ex.name] || ex.name;
                     const isSwapped = currentName !== ex.name;
                     
                     return (
                       <div key={j} className="bg-muted/5 p-3 rounded border border-border/40 relative group">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex flex-col">
                                <span className={cn("font-bold text-sm", isSwapped && "text-primary")}>
                                   {currentName}
                                </span>
                                {isSwapped && <span className="text-[8px] font-mono text-muted-foreground">ALT FOR: {ex.name.toUpperCase()}</span>}
                             </div>
                             <Button 
                               variant="ghost" 
                               size="icon" 
                               className="h-6 w-6 opacity-50 hover:opacity-100 -mr-2 -mt-2"
                               onClick={() => handleSwap(ex.name, currentName)}
                             >
                                <RefreshCw className="w-3 h-3" />
                             </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                             <div className="bg-background/50 p-1.5 rounded text-center border border-border/30">
                                <div className="text-[8px] text-muted-foreground uppercase mb-0.5">SETS</div>
                                <div>{ex.sets}</div>
                             </div>
                             <div className="bg-background/50 p-1.5 rounded text-center border border-border/30">
                                <div className="text-[8px] text-muted-foreground uppercase mb-0.5">REPS</div>
                                <div>{ex.reps}</div>
                             </div>
                             <div className="bg-background/50 p-1.5 rounded text-center border border-border/30">
                                <div className="text-[8px] text-muted-foreground uppercase mb-0.5">REST</div>
                                <div>{ex.rest}</div>
                             </div>
                          </div>
                       </div>
                     );
                   })}
                   
                   <div className="flex justify-between items-center pt-2 text-[10px] font-mono text-muted-foreground opacity-70">
                      <div className="flex items-center gap-1">
                         <Timer className="w-3 h-3" /> Est. Time: {prefs.sessionLength}m
                      </div>
                      <div>
                         INTENSITY: RPE 7-8
                      </div>
                   </div>
                </div>
             </CockpitCard>
           ))}
        </div>
      )}
    </div>
  );
}
