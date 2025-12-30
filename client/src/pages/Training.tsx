import { useState, useEffect } from "react";
import { CockpitCard, Annunciator } from "@/components/ui/CockpitCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dumbbell, RefreshCw, Timer, Calendar, Activity, CheckCircle2, Save, FileText, Edit2, Play, Info, Lock, Sparkles, Camera, Upload, ScanLine, Scale, Zap, User, ArrowRight, Brain } from "lucide-react";
import { usePremium } from "@/lib/premium";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { EXERCISE_DATABASE, ALTERNATIVES, getExercisesByCategory, getExercisesByMuscleGroup, getWarmupExercises, getCoreExercises, getCardioFinishers, filterByEquipment, shuffleArray, type ExerciseDef, type EquipmentFilter } from "@/lib/exercises";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TrainingPreferences = {
  experience: "Beginner" | "Intermediate" | "Advanced";
  goal: "Build Strength" | "Build Muscle" | "Lose Fat" | "Maintenance";
  daysPerWeek: number;
  sessionLength: number;
  equipment: "Full Gym" | "Dumbbells Only" | "Bodyweight";
};

type SetLog = {
  reps: string;
  weight: string;
  completed: boolean;
};

type ExerciseLog = {
  name: string;
  targetSets: string;
  targetReps: string;
  sets: SetLog[];
  rest: string;
  completed: boolean;
  isCardio?: boolean;
  cardioLog?: { totalDistance: string; totalTime: string; avgPace: string };
  originalDef?: ExerciseDef;
};

type WorkoutSession = {
  day: number;
  type: string;
  exercises: ExerciseLog[];
  completed: boolean;
};

type BodyScanViewMode = "scan" | "results";

export default function Training() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { isPremium } = usePremium();
  const [, setLocation] = useLocation();

  // Body Scan State
  const [bodyScanViewMode, setBodyScanViewMode] = useState<BodyScanViewMode | null>(null);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const [prefs, setPrefs] = useState<TrainingPreferences>({
    experience: "Intermediate",
    goal: "Maintenance",
    daysPerWeek: 3,
    sessionLength: 45,
    equipment: "Full Gym"
  });

  useEffect(() => {
    if (profile) {
      const goalMap: Record<string, TrainingPreferences["goal"]> = {
        "Cut": "Lose Fat",
        "Maintain": "Maintenance",
        "Performance": "Build Strength",
        "Bulk": "Build Muscle",
      };
      const equipmentMap: Record<string, TrainingPreferences["equipment"]> = {
        "Gym": "Full Gym",
        "Home": "Dumbbells Only",
        "Outdoors": "Bodyweight",
        "Hotel": "Bodyweight",
      };
      setPrefs(prev => ({
        ...prev,
        goal: goalMap[profile.goal] || "Maintenance",
        daysPerWeek: profile.trainingFreq || 3,
        equipment: equipmentMap[profile.trainingLocation || "Gym"] || "Full Gym",
      }));
    }
  }, [profile]);

  const [generatedPlan, setGeneratedPlan] = useState<WorkoutSession[] | null>(null);
  const [swappedExercises, setSwappedExercises] = useState<Record<string, string>>({});
  const [activeSessionIndex, setActiveSessionIndex] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [pendingSessionIndex, setPendingSessionIndex] = useState<number | null>(null);

  const createExerciseLog = (ex: ExerciseDef): ExerciseLog => {
    const isCardio = ex.isCardio || false;
    const numSets = isCardio ? 1 : (parseInt(ex.sets.split('-')[0]) || 3);
    const sets: SetLog[] = Array(numSets).fill(null).map(() => ({
      reps: "",
      weight: "",
      completed: false
    }));
    return {
      name: ex.name,
      targetSets: ex.sets,
      targetReps: ex.reps,
      sets,
      rest: ex.rest,
      completed: false,
      isCardio,
      cardioLog: isCardio ? { totalDistance: "", totalTime: "", avgPace: "" } : undefined,
      originalDef: ex
    };
  };

  const generatePlan = () => {
    const plan: WorkoutSession[] = [];
    const days = prefs.daysPerWeek;
    const seed = Date.now();
    
    const workoutSplits = {
      3: [
        { name: "Push Day", type: "push" },
        { name: "Pull Day", type: "pull" },
        { name: "Leg Day", type: "legs" },
      ],
      4: [
        { name: "Upper A", type: "upper" },
        { name: "Lower A", type: "legs" },
        { name: "Upper B", type: "upper" },
        { name: "Lower B", type: "legs" },
      ],
      5: [
        { name: "Push Day", type: "push" },
        { name: "Pull Day", type: "pull" },
        { name: "Leg Day", type: "legs" },
        { name: "Upper Body", type: "upper" },
        { name: "Cardio + Core", type: "conditioning" },
      ],
      6: [
        { name: "Push A", type: "push" },
        { name: "Pull A", type: "pull" },
        { name: "Legs A", type: "legs" },
        { name: "Push B", type: "push" },
        { name: "Pull B", type: "pull" },
        { name: "Legs B", type: "legs" },
      ],
    };
    
    const templates = workoutSplits[days as keyof typeof workoutSplits] || workoutSplits[3];
    
    for (let i = 0; i < days; i++) {
      const template = templates[i % templates.length];
      let sessionType = template.name;
      let workoutType = template.type;
      
      if (prefs.goal === "Lose Fat" && i % 2 !== 0) {
        sessionType = "Cardio + Conditioning";
        workoutType = "conditioning";
      }
      if (prefs.goal === "Maintenance" && i === days - 1) {
        sessionType = "Recovery + Mobility";
        workoutType = "recovery";
      }
      
      const exercises: ExerciseLog[] = [];
      const equipment = prefs.equipment as EquipmentFilter;
      const usedNames = new Set<string>();
      
      const addExercises = (pool: ExerciseDef[], count: number) => {
        const filtered = filterByEquipment(pool, equipment).filter(ex => !usedNames.has(ex.name));
        const shuffled = shuffleArray(filtered, seed + i + usedNames.size);
        shuffled.slice(0, count).forEach(ex => {
          usedNames.add(ex.name);
          exercises.push(createExerciseLog(ex));
        });
      };
      
      // Add warmup exercises first (2-3 exercises, fewer for conditioning)
      if (workoutType !== "recovery") {
        const warmupCount = workoutType === "conditioning" ? 1 : (prefs.sessionLength < 45 ? 2 : 3);
        addExercises(getWarmupExercises(), warmupCount);
      }
      
      // Add main workout exercises based on workout type
      if (workoutType === "push") {
        // Push Day: 2-3 chest exercises + 2 triceps exercises
        const chestCount = prefs.sessionLength >= 60 ? 3 : 2;
        const tricepsCount = 2;
        const shoulderCount = prefs.sessionLength >= 60 ? 1 : 0;
        
        addExercises(getExercisesByMuscleGroup("chest"), chestCount);
        addExercises(getExercisesByMuscleGroup("triceps"), tricepsCount);
        if (shoulderCount > 0) {
          addExercises(getExercisesByMuscleGroup("shoulders"), shoulderCount);
        }
      } else if (workoutType === "pull") {
        // Pull Day: 2-3 back exercises + 2 biceps exercises
        const backCount = prefs.sessionLength >= 60 ? 3 : 2;
        const bicepsCount = 2;
        
        addExercises(getExercisesByMuscleGroup("back"), backCount);
        addExercises(getExercisesByMuscleGroup("biceps"), bicepsCount);
      } else if (workoutType === "legs") {
        // Leg Day: 2-3 quad exercises + 2 hamstring exercises
        const quadCount = prefs.sessionLength >= 60 ? 3 : 2;
        const hamCount = 2;
        const gluteCount = prefs.sessionLength >= 60 ? 1 : 0;
        
        addExercises(getExercisesByMuscleGroup("quads"), quadCount);
        addExercises(getExercisesByMuscleGroup("hamstrings"), hamCount);
        if (gluteCount > 0) {
          addExercises(getExercisesByMuscleGroup("glutes"), gluteCount);
        }
      } else if (workoutType === "upper") {
        // Upper Body Day: 2 chest + 2 back + 1 shoulder
        addExercises(getExercisesByMuscleGroup("chest"), 2);
        addExercises(getExercisesByMuscleGroup("back"), 2);
        addExercises(getExercisesByMuscleGroup("shoulders"), 1);
      } else if (workoutType === "conditioning") {
        // Cardio day - main cardio work
        addExercises(getCardioFinishers(), 3);
        // Add core for conditioning day
        addExercises(getCoreExercises(), 2);
      } else if (workoutType === "recovery") {
        // Mobility day
        addExercises(getExercisesByCategory("mobility"), 4);
      }
      
      // Add ab exercises at the end (1-2 exercises for strength days)
      if (workoutType !== "recovery" && workoutType !== "conditioning") {
        const coreCount = prefs.sessionLength >= 60 ? 2 : 1;
        addExercises(getCoreExercises(), coreCount);
      }
      
      // Add cardio finisher when appropriate (for longer sessions or fat loss goal)
      if (workoutType !== "conditioning" && workoutType !== "recovery") {
        if (prefs.goal === "Lose Fat" || prefs.sessionLength >= 60) {
          addExercises(getCardioFinishers(), 1);
        }
      }
      
      plan.push({
        day: i + 1,
        type: sessionType,
        exercises,
        completed: false
      });
    }
    setGeneratedPlan(plan);
    setSwappedExercises({});
  };

  const handleSwap = (sessionIndex: number, exerciseIndex: number, originalName: string, currentName: string) => {
    const alts = ALTERNATIVES[originalName] || [];
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

    // Update in plan
    if (generatedPlan) {
        const newPlan = [...generatedPlan];
        newPlan[sessionIndex].exercises[exerciseIndex].name = nextName;
        setGeneratedPlan(newPlan);
    }
  };

  const updateSet = (sessionIndex: number, exerciseIndex: number, setIndex: number, field: keyof SetLog, value: string) => {
      if (!generatedPlan) return;
      const newPlan = [...generatedPlan];
      // @ts-ignore
      newPlan[sessionIndex].exercises[exerciseIndex].sets[setIndex][field] = value;
      setGeneratedPlan(newPlan);
  };

  const updateCardioLog = (sessionIndex: number, exerciseIndex: number, field: 'totalDistance' | 'totalTime' | 'avgPace', value: string) => {
      if (!generatedPlan) return;
      const newPlan = [...generatedPlan];
      const exercise = newPlan[sessionIndex].exercises[exerciseIndex];
      if (exercise.cardioLog) {
          exercise.cardioLog[field] = value;
      }
      setGeneratedPlan(newPlan);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (sessionStartTime !== null) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionStartTime]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const confirmStartSession = (sessionIndex: number) => {
    setPendingSessionIndex(sessionIndex);
  };

  const startSession = (sessionIndex: number) => {
    setActiveSessionIndex(sessionIndex);
    setSessionStartTime(Date.now());
    setElapsedTime(0);
    setPendingSessionIndex(null);
  };

  const endSession = (sessionIndex: number) => {
    if (!generatedPlan) return;
    const newPlan = [...generatedPlan];
    newPlan[sessionIndex].completed = true;
    setGeneratedPlan(newPlan);
    setActiveSessionIndex(null);
    setSessionStartTime(null);
    setElapsedTime(0);

    toast({
      title: "Session Completed",
      description: `Workout for Day ${newPlan[sessionIndex].day} saved successfully.`
    });
  };

  const saveSession = (sessionIndex: number) => {
      if (!generatedPlan) return;
      const newPlan = [...generatedPlan];
      newPlan[sessionIndex].completed = true;
      setGeneratedPlan(newPlan);

      toast({
          title: "Session Logged",
          description: `Workout for Day ${newPlan[sessionIndex].day} saved successfully.`
      });
  };

  // Body Scan Functions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') setBeforeImage(reader.result as string);
        else setAfterImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    if (!beforeImage || !afterImage) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setBodyScanViewMode('results');
    }, 3000);
  };

  const resetBodyScan = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setAnalysisComplete(false);
    setBodyScanViewMode(null);
  };

  const AnalysisOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-xl">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/80 shadow-[0_0_15px_#2ecc71] animate-scan-down opacity-80" />
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 animate-pulse-slow" />
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-primary/30 text-[10px] font-mono text-primary flex items-center gap-2">
         <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
         ANALYZING
      </div>
      <div className="absolute top-1/4 left-1/4 w-8 h-8 border-t border-l border-primary/50" />
      <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-b border-r border-primary/50" />
    </div>
  );

  if (!isPremium) {
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

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e1a]/80 to-[#0a0e1a] z-10 flex flex-col items-center justify-center p-6 rounded-lg">
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 p-4 rounded-full mb-4 border border-amber-500/30">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
            <p className="text-cyan-400/70 text-sm text-center mb-4">
              Custom Training Programs are available with FlightFuel Premium
            </p>
            <button
              onClick={() => setLocation('/upgrade')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
              data-testid="button-upgrade-training"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade to Premium
            </button>
          </div>
          <div className="blur-sm opacity-50 pointer-events-none">
            <CockpitCard title="Mission Parameters">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-muted/20 rounded animate-pulse" />
                  <div className="h-10 bg-muted/20 rounded animate-pulse" />
                </div>
                <div className="h-8 bg-muted/20 rounded animate-pulse" />
                <div className="h-8 bg-muted/20 rounded animate-pulse" />
                <div className="h-10 bg-primary/20 rounded animate-pulse" />
              </div>
            </CockpitCard>
          </div>
        </div>
      </div>
    );
  }

  // Body Scan Views
  if (bodyScanViewMode === "scan") {
    return (
      <div className="space-y-5 pb-24">
        <header className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-foreground">Body Scan</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" strokeWidth={2} />
              Compare before & after photos
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm"
            onClick={resetBodyScan}
          >
            Cancel
          </Button>
        </header>

        <CockpitCard title="Upload Photos">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                BEFORE
              </Label>
              <div 
                className="aspect-[3/4] bg-muted/10 border-2 border-dashed border-amber-500/50 hover:border-amber-500 rounded-xl relative overflow-hidden transition-all group cursor-pointer"
                onClick={() => document.getElementById('before-upload')?.click()}
              >
                {beforeImage ? (
                  <>
                    <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-amber-500/90 text-amber-50 text-xs px-2 py-1 rounded font-medium">Loaded</div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500/70 group-hover:text-amber-500 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium">Tap to Upload</span>
                  </div>
                )}
                {isAnalyzing && beforeImage && <AnalysisOverlay />}
                <input 
                  id="before-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, 'before')}
                  disabled={isAnalyzing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                AFTER
              </Label>
              <div 
                className="aspect-[3/4] bg-muted/10 border-2 border-dashed border-primary/50 hover:border-primary rounded-xl relative overflow-hidden transition-all group cursor-pointer"
                onClick={() => document.getElementById('after-upload')?.click()}
              >
                {afterImage ? (
                  <>
                    <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded font-medium">Loaded</div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/70 group-hover:text-primary transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium">Tap to Upload</span>
                  </div>
                )}
                {isAnalyzing && afterImage && <AnalysisOverlay />}
                <input 
                  id="after-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, 'after')}
                  disabled={isAnalyzing}
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-6" 
            disabled={!beforeImage || !afterImage || isAnalyzing}
            onClick={startAnalysis}
          >
            {isAnalyzing ? (
              <>
                <ScanLine className="w-5 h-5 mr-2 animate-pulse" strokeWidth={2} />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" strokeWidth={2} />
                Analyze Transformation
              </>
            )}
          </Button>
        </CockpitCard>
      </div>
    );
  }

  if (bodyScanViewMode === "results" && analysisComplete) {
    return (
      <div className="space-y-5 pb-24">
        <header className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-foreground">Analysis Complete</h1>
            <p className="text-sm text-muted-foreground">Transformation detected</p>
          </div>
          <div className="bg-primary/20 text-primary text-xs px-3 py-1.5 rounded-full font-medium">Success</div>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <CockpitCard title="Body Fat">
            <div className="text-2xl font-bold text-primary">-1.4%</div>
            <div className="text-xs text-muted-foreground mt-1">Estimated change</div>
          </CockpitCard>
          
          <CockpitCard title="Muscle Definition">
            <div className="text-2xl font-bold text-secondary">+8.2%</div>
            <div className="text-xs text-muted-foreground mt-1">Improvement</div>
          </CockpitCard>
        </div>

        <CockpitCard title="Analysis Report">
          <div className="space-y-4">
            <div className="pb-3 border-b border-border/50">
              <h4 className="text-sm font-semibold text-foreground mb-1">Shoulder Definition</h4>
              <p className="text-xs text-muted-foreground">
                Significant increase in lateral deltoid separation detected. Structural density improved by approximately 12%.
              </p>
            </div>
            
            <div className="pb-3 border-b border-border/50">
              <h4 className="text-sm font-semibold text-foreground mb-1">Abdominal Visibility</h4>
              <p className="text-xs text-muted-foreground">
                Mid-section vascularity markers detected. Lower abdominal definition has increased visibility.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Posture Alignment</h4>
              <p className="text-xs text-muted-foreground">
                Thoracic extension improved. Shoulder internal rotation reduced compared to baseline image.
              </p>
            </div>
          </div>
        </CockpitCard>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={resetBodyScan}
          >
            New Scan
          </Button>
          <Button 
            className="flex-1"
          >
            Save to Log
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <header className="mb-6 flex items-center gap-3">
         <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
          <Dumbbell className="text-primary w-5 h-5" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Training Brief</h1>
          <p className="text-xs text-muted-foreground font-mono">PHYSICAL READINESS</p>
        </div>
      </header>

      {/* Body Scan Section */}
      {isPremium ? (
        <CockpitCard title="Body Scan">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Compare before & after photos to track your physical transformation
            </p>
            <Button 
              className="w-full"
              onClick={() => setBodyScanViewMode("scan")}
            >
              <Camera className="w-5 h-5 mr-2" strokeWidth={2} />
              Start Body Scan
              <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
            </Button>
          </div>
        </CockpitCard>
      ) : (
        <CockpitCard title="Body Scan">
          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
              <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" strokeWidth={2} />
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered body composition tracking is available with FlightFuel Premium
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                onClick={() => setLocation('/upgrade')}
              >
                <Sparkles className="w-5 h-5 mr-2" strokeWidth={2} fill="currentColor" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </CockpitCard>
      )}

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
      {generatedPlan && activeSessionIndex === null && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="flex items-center justify-between border-b border-primary/30 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-primary">Active Protocol</h2>
              <span className="text-[10px] font-mono text-muted-foreground">WK-{Math.floor(Math.random() * 52) + 1}</span>
           </div>

           <div className="grid grid-cols-1 gap-3">
             {generatedPlan.map((session, i) => (
               <CockpitCard 
                 key={i} 
                 className={cn(
                   "cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5",
                   session.completed && "opacity-60"
                 )}
                 onClick={() => !session.completed && confirmStartSession(i)}
               >
                 <div className="flex items-center justify-between">
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                       <h3 className="text-sm font-bold text-foreground">Session {session.day}</h3>
                       {session.completed && (
                         <CheckCircle2 className="w-4 h-4 text-primary" strokeWidth={2} />
                       )}
                     </div>
                     <p className="text-xs text-muted-foreground font-mono uppercase">{session.type}</p>
                     <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                       <span className="flex items-center gap-1">
                         <Activity className="w-3 h-3" />
                         {session.exercises.length} exercises
                       </span>
                       <span className="flex items-center gap-1">
                         <Timer className="w-3 h-3" />
                         {prefs.sessionLength} min
                       </span>
                     </div>
                   </div>
                   {!session.completed && (
                     <Button 
                       variant="ghost" 
                       size="sm"
                       className="ml-2"
                       onClick={(e) => {
                         e.stopPropagation();
                         confirmStartSession(i);
                       }}
                     >
                       <Play className="w-4 h-4 mr-1" strokeWidth={2} />
                       Start
                     </Button>
                   )}
                 </div>
               </CockpitCard>
             ))}
           </div>
        </div>
      )}

      {/* Start Session Confirmation Dialog */}
      {generatedPlan && pendingSessionIndex !== null && (
        <AlertDialog open={pendingSessionIndex !== null} onOpenChange={(open) => !open && setPendingSessionIndex(null)}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" strokeWidth={2} />
                Start Training Session?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 pt-2">
                {generatedPlan[pendingSessionIndex] && (
                  <>
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        Session {generatedPlan[pendingSessionIndex].day} - {generatedPlan[pendingSessionIndex].type}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Activity className="w-4 h-4" />
                          {generatedPlan[pendingSessionIndex].exercises.length} exercises
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          {prefs.sessionLength} min
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">
                      The session timer will start immediately when you confirm. You can end the session at any time.
                    </p>
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => pendingSessionIndex !== null && startSession(pendingSessionIndex)}>
                <Play className="w-4 h-4 mr-2" strokeWidth={2} />
                Start Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Active Session View */}
      {generatedPlan && activeSessionIndex !== null && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {(() => {
            const session = generatedPlan[activeSessionIndex];
            return (
              <>
                {/* Session Header with Timer */}
                <CockpitCard>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Session {session.day}</h2>
                      <p className="text-sm text-muted-foreground font-mono uppercase">{session.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-primary mb-1">
                        <Timer className="w-5 h-5" strokeWidth={2} />
                        <span className="text-2xl font-bold font-mono">{formatTime(elapsedTime)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">Session Duration</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => endSession(activeSessionIndex)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" strokeWidth={2} />
                    End Session
                  </Button>
                </CockpitCard>

                {/* Exercises */}
                <div className="space-y-3">
                  {session.exercises.map((ex, j) => {
                    const currentName = ex.name;
                    const originalName = Object.keys(ALTERNATIVES).find(key => ALTERNATIVES[key as keyof typeof ALTERNATIVES].includes(currentName) || key === currentName) || currentName;
                    const isSwapped = currentName !== originalName && ALTERNATIVES[originalName as keyof typeof ALTERNATIVES]?.includes(currentName);
                    
                    return (
                      <CockpitCard key={j}>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                             <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={cn("font-bold text-sm", isSwapped && "text-primary")}>
                                     {currentName}
                                  </span>
                                  {ex.originalDef && !isSwapped && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary relative">
                                          <Info className="w-4 h-4" strokeWidth={2} />
                                          {ex.originalDef.youtubeId && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                                          )}
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                          <DialogTitle className="flex items-center gap-2">
                                            {currentName}
                                            {ex.originalDef.youtubeId && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Video</span>}
                                          </DialogTitle>
                                          <DialogDescription>
                                            {ex.originalDef.description}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="rounded-lg overflow-hidden mt-2 bg-black">
                                          {ex.originalDef.youtubeId ? (
                                            <iframe
                                              src={`https://www.youtube.com/embed/${ex.originalDef.youtubeId}?rel=0&enablejsapi=1`}
                                              title={currentName}
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                              allowFullScreen
                                              className="w-full aspect-video"
                                              frameBorder="0"
                                            />
                                          ) : (
                                            <img 
                                              src={ex.originalDef.image} 
                                              alt={currentName}
                                              className="w-full h-48 object-cover"
                                            />
                                          )}
                                        </div>
                                        <div className="flex gap-4 text-xs font-mono text-muted-foreground border-t pt-4 mt-2">
                                            <div className="flex flex-col">
                                                <span className="uppercase text-[10px] opacity-70">Target Sets</span>
                                                <span className="font-bold text-foreground">{ex.targetSets}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="uppercase text-[10px] opacity-70">Target Reps</span>
                                                <span className="font-bold text-foreground">{ex.targetReps}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="uppercase text-[10px] opacity-70">Rest Interval</span>
                                                <span className="font-bold text-foreground">{ex.rest}</span>
                                            </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                                <div className="flex gap-2 text-[10px] font-mono text-muted-foreground mt-0.5">
                                    <span>{ex.targetSets} SETS</span>
                                    <span>•</span>
                                    <span>REST: {ex.rest}</span>
                                    {isSwapped && <span>• ALT FOR: {originalName.toUpperCase()}</span>}
                                </div>
                             </div>
                             <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-50 hover:opacity-100"
                                onClick={() => handleSwap(activeSessionIndex, j, originalName, currentName)}
                             >
                                <RefreshCw className="w-3 h-3" />
                             </Button>
                          </div>
                          
                          <div className="space-y-1">
                             {ex.isCardio ? (
                               <>
                                 <div className="grid grid-cols-3 gap-2 text-[9px] font-mono uppercase text-muted-foreground text-center px-1 mb-1">
                                    <div>Total Distance</div>
                                    <div>Total Time</div>
                                    <div>Avg Pace</div>
                                 </div>
                                 <div className="grid grid-cols-3 gap-2 items-center">
                                    <Input 
                                        className="h-7 text-xs p-1 text-center font-mono placeholder:text-muted-foreground/20 bg-background/50" 
                                        value={ex.cardioLog?.totalDistance || ""}
                                        placeholder="5000m"
                                        onChange={(e) => updateCardioLog(activeSessionIndex, j, 'totalDistance', e.target.value)}
                                    />
                                    <Input 
                                        className="h-7 text-xs p-1 text-center font-mono placeholder:text-muted-foreground/20 bg-background/50" 
                                        value={ex.cardioLog?.totalTime || ""}
                                        placeholder="20:00"
                                        onChange={(e) => updateCardioLog(activeSessionIndex, j, 'totalTime', e.target.value)}
                                    />
                                    <Input 
                                        className="h-7 text-xs p-1 text-center font-mono placeholder:text-muted-foreground/20 bg-background/50" 
                                        value={ex.cardioLog?.avgPace || ""}
                                        placeholder="2:00/500m"
                                        onChange={(e) => updateCardioLog(activeSessionIndex, j, 'avgPace', e.target.value)}
                                    />
                                 </div>
                                 <div className="text-[10px] font-mono text-muted-foreground/50 text-center mt-2">
                                    Target: {ex.targetSets} x {ex.targetReps} with {ex.rest} work:rest
                                 </div>
                               </>
                             ) : (
                               <>
                                 <div className="grid grid-cols-[30px_1fr_1fr_1fr] gap-2 text-[9px] font-mono uppercase text-muted-foreground text-center px-1 mb-1">
                                    <div>#</div>
                                    <div>Target</div>
                                    <div>Reps</div>
                                    <div>Kg</div>
                                 </div>
                                 {ex.sets.map((set, k) => (
                                     <div key={k} className="grid grid-cols-[30px_1fr_1fr_1fr] gap-2 items-center">
                                        <div className="text-center text-xs font-mono text-muted-foreground/70">{k + 1}</div>
                                        <div className="text-center text-xs font-mono text-muted-foreground/50">{ex.targetReps}</div>
                                        <Input 
                                            className="h-7 text-xs p-1 text-center font-mono placeholder:text-muted-foreground/20 bg-background/50" 
                                            value={set.reps}
                                            placeholder={ex.targetReps.split('-')[0]}
                                            onChange={(e) => updateSet(activeSessionIndex, j, k, 'reps', e.target.value)}
                                        />
                                        <Input 
                                            className="h-7 text-xs p-1 text-center font-mono placeholder:text-muted-foreground/20 bg-background/50" 
                                            value={set.weight}
                                            placeholder="0"
                                            onChange={(e) => updateSet(activeSessionIndex, j, k, 'weight', e.target.value)}
                                        />
                                     </div>
                                 ))}
                               </>
                             )}
                          </div>
                        </div>
                      </CockpitCard>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
