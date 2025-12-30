import { useState, useEffect, useRef } from "react";
import { Camera, ScanLine, X, Check, Plus, Image as ImageIcon, Utensils, Flame, Target, TrendingDown, Edit2, Trash2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CockpitCard, InstrumentDisplay, Annunciator } from "@/components/ui/CockpitCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { calculateCalorieTargets, calculateDailyProgress, getCalorieStatus } from "@/lib/calories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nutritionApi } from "@/lib/api";
import { usePremium } from "@/lib/premium";
import { useLocation } from "wouter";
import { calculateNutritionFromText, FOOD_DATABASE } from "@/lib/foodDatabase";
import type { NutritionLog } from "@shared/schema";

type ViewMode = "dashboard" | "camera" | "manual" | "result";

interface FoodEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function FuelScan() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [mealType, setMealType] = useState("lunch");
  const [scannedFood, setScannedFood] = useState<FoodEntry | null>(null);
  const [manualEntry, setManualEntry] = useState<FoodEntry>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { isPremium } = usePremium();
  const [, setLocation] = useLocation();
  
  const today = new Date().toISOString().split("T")[0];
  
  const targets = calculateCalorieTargets(profile || {});

  const { data: todayLogs = [] } = useQuery<NutritionLog[]>({
    queryKey: ["/api/nutrition", today],
    queryFn: () => nutritionApi.getByDate(today),
  });

  const { data: summary = { calories: 0, protein: 0, carbs: 0, fat: 0 } } = useQuery({
    queryKey: ["/api/nutrition/summary", today],
    queryFn: async () => {
      const res = await fetch(`/api/nutrition/summary/${today}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch summary");
      return res.json();
    },
  });

  const progress = calculateDailyProgress(targets, summary);
  const calorieStatus = getCalorieStatus(progress.percentComplete);

  const addNutritionMutation = useMutation({
    mutationFn: (data: any) => nutritionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition"] });
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition/summary"] });
      setViewMode("dashboard");
      setScannedFood(null);
      setManualEntry({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
      setCapturedImage(null);
    },
    onError: (error: any) => {
      console.error("Error adding nutrition:", error);
    },
  });

  const deleteNutritionMutation = useMutation({
    mutationFn: (id: string) => nutritionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition"] });
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition/summary"] });
    },
  });

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (viewMode === "camera" && !capturedImage) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Error accessing camera:", err);
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [viewMode, capturedImage]);

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        return canvas.toDataURL("image/png");
      }
    }
    return null;
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const img = captureFrame();
      setCapturedImage(img);
      setScanning(false);
      
      // Try to calculate nutrition for scanned meal
      const detectedName = "Mixed Meal";
      const nutrition = calculateNutritionFromText(detectedName);
      const defaultNutrition = { calories: 450, protein: 28, carbs: 45, fat: 18 };
      
      setScannedFood({
        name: detectedName,
        calories: nutrition.calories || defaultNutrition.calories,
        protein: nutrition.protein || defaultNutrition.protein,
        carbs: nutrition.carbs || defaultNutrition.carbs,
        fat: nutrition.fat || defaultNutrition.fat,
      });
      setViewMode("result");
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setScanning(true);
        setTimeout(() => {
          setScanning(false);
          // Try to extract food name from filename or use default
          const fileName = file.name.toLowerCase();
          let detectedName = "Uploaded Meal";
          
          // Try to detect common food names from filename
          for (const [foodName] of Object.entries(FOOD_DATABASE)) {
            if (fileName.includes(foodName.toLowerCase())) {
              detectedName = foodName;
              break;
            }
          }
          
          // Calculate nutrition for detected or default meal
          const nutrition = calculateNutritionFromText(detectedName);
          const defaultNutrition = { calories: 520, protein: 32, carbs: 52, fat: 20 };
          
          setScannedFood({
            name: detectedName,
            calories: nutrition.calories || defaultNutrition.calories,
            protein: nutrition.protein || defaultNutrition.protein,
            carbs: nutrition.carbs || defaultNutrition.carbs,
            fat: nutrition.fat || defaultNutrition.fat,
          });
          setViewMode("result");
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFood = () => {
    const food = viewMode === "result" ? scannedFood : manualEntry;
    if (!food || !food.name) return;

    const mealPhaseMap: Record<string, string> = {
      breakfast: "Pre-Duty",
      lunch: "Cruise/Duty",
      dinner: "Post-Duty",
      snack: "Cruise/Duty",
    };

    addNutritionMutation.mutate({
      date: today,
      mealTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      mealPhase: mealPhaseMap[mealType] || "Cruise/Duty",
      mealName: food.name,
      imageUrl: capturedImage || null,
      protein: Math.round(food.protein) || 0,
      carbs: Math.round(food.carbs) || 0,
      fat: Math.round(food.fat) || 0,
      calories: Math.round(food.calories) || 0,
    });
  };

  const CalorieRing = () => {
    const size = 200;
    const strokeWidth = 16;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percent = Math.min(progress.percentComplete / 100, 1);
    const strokeDashoffset = circumference - (percent * circumference);

    const strokeColor = 
      calorieStatus === "warning" ? "hsl(0 80% 55%)" :
      calorieStatus === "amber" ? "hsl(38 100% 50%)" :
      "hsl(142 76% 48%)";

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(222 18% 20%)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700"
            style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold lcd-text">
            {progress.caloriesRemaining}
          </span>
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-1">
            REMAINING
          </span>
          <div className="h-px w-16 bg-border my-2" />
          <span className="text-sm text-muted-foreground font-mono">
            {summary.calories} / {targets.targetCalories}
          </span>
        </div>
      </div>
    );
  };

  const MacroBar = ({ label, current, target, color }: { label: string; current: number; target: number; color: string }) => {
    const percent = Math.min((current / target) * 100, 100);
    return (
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
          <span className="text-xs font-mono" style={{ color }}>{current}g</span>
        </div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
          />
        </div>
        <div className="text-[9px] text-muted-foreground font-mono text-right mt-0.5">
          / {target}g
        </div>
      </div>
    );
  };

  if (viewMode === "camera") {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        {!capturedImage && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}
        
        {capturedImage && (
          <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="Captured" />
        )}

        <div className="absolute inset-0 z-0 bg-black/10">
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/60 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/60 rounded-tr-lg" />
          <div className="absolute bottom-32 left-8 w-12 h-12 border-b-2 border-l-2 border-primary/60 rounded-bl-lg" />
          <div className="absolute bottom-32 right-8 w-12 h-12 border-b-2 border-r-2 border-primary/60 rounded-br-lg" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-96 border border-primary/30 rounded-lg relative overflow-hidden backdrop-blur-[2px]">
              <div className="absolute top-1/2 left-0 w-full h-px bg-primary/40" />
              <div className="absolute left-1/2 top-0 h-full w-px bg-primary/40" />
              {scanning && (
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              )}
            </div>
          </div>
          
          {scanning && (
            <div className="absolute left-0 top-0 h-full w-1 bg-primary/60 shadow-[0_0_20px_#2ecc71] animate-[scan-vertical_1.5s_ease-in-out_infinite] z-20" />
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-6 right-6 z-20 text-white hover:bg-black/20"
          onClick={() => { setViewMode("dashboard"); setCapturedImage(null); }}
          data-testid="button-close-camera"
        >
          <X className="w-8 h-8" />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/90 to-transparent z-10 flex flex-col items-center gap-6">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span className="text-xs font-mono text-primary animate-pulse tracking-widest">
              {scanning ? "ANALYZING FUEL..." : "TARGET ACQUIRED"}
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full border-white/20 bg-black/40 text-white hover:bg-white/10"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
              data-testid="button-upload-image"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>

            <Button 
              size="lg" 
              className="h-20 w-20 rounded-full border-4 border-white/80 bg-transparent hover:bg-white/10 hover:scale-105 transition-all p-0 flex items-center justify-center relative group"
              onClick={handleScan}
              disabled={scanning}
              data-testid="button-capture"
            >
              <div className="w-16 h-16 rounded-full bg-white group-hover:scale-90 transition-transform" />
            </Button>

            <div className="w-12 h-12" />
          </div>
          
          <p className="text-[10px] text-white/60 font-mono uppercase tracking-[0.2em]">
            Tap to Analyze
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "result" && scannedFood) {
    return (
      <div className="h-full flex flex-col pb-24 animate-in zoom-in-95 duration-300">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-lg font-bold tracking-[0.15em] text-foreground uppercase font-mono">Analysis Complete</h1>
          <Button variant="ghost" size="icon" onClick={() => { setViewMode("dashboard"); setScannedFood(null); setCapturedImage(null); }}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 space-y-4">
          <div className="instrument-bezel h-48 relative overflow-hidden flex items-center justify-center">
            {capturedImage ? (
              <img src={capturedImage} alt="Scanned Food" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            <ScanLine className="text-primary w-12 h-12 opacity-80 relative z-10 drop-shadow-[0_0_10px_rgba(46,204,113,0.8)]" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              <span className="cockpit-label">Log As</span>
            </div>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="font-mono uppercase tracking-wider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CockpitCard title="Detected Fuel" variant="instrument" status="cyan">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-medium">{scannedFood.name}</div>
                  <Annunciator status="green">AI DETECTED</Annunciator>
                </div>
                <div className="text-right">
                  <div className="font-mono text-3xl lcd-text">{scannedFood.calories}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">KCAL</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="pfd-display p-3 text-center">
                  <div className="text-[10px] text-muted-foreground mb-1 font-mono">PROTEIN</div>
                  <div className="font-mono text-lg lcd-text-cyan">{scannedFood.protein}g</div>
                </div>
                <div className="pfd-display p-3 text-center">
                  <div className="text-[10px] text-muted-foreground mb-1 font-mono">CARBS</div>
                  <div className="font-mono text-lg lcd-text-amber">{scannedFood.carbs}g</div>
                </div>
                <div className="pfd-display p-3 text-center">
                  <div className="text-[10px] text-muted-foreground mb-1 font-mono">FAT</div>
                  <div className="font-mono text-lg" style={{ color: "hsl(280 65% 60%)" }}>{scannedFood.fat}g</div>
                </div>
              </div>
            </div>
          </CockpitCard>

          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 flex gap-3 items-start">
            <Annunciator status="amber">NOTE</Annunciator>
            <p className="text-xs text-muted-foreground">
              This is a simulation. AI food analysis requires backend integration.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wide" 
            size="lg"
            onClick={handleAddFood}
            disabled={addNutritionMutation.isPending}
            data-testid="button-add-food"
          >
            <Plus className="mr-2 h-4 w-4" /> ADD TO {mealType.toUpperCase()} LOG
          </Button>
        </div>
      </div>
    );
  }

  if (viewMode === "manual") {
    return (
      <div className="h-full flex flex-col pb-24 animate-in slide-in-from-right duration-300">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-lg font-bold tracking-[0.15em] text-foreground uppercase font-mono">Manual Entry</h1>
          <Button variant="ghost" size="icon" onClick={() => setViewMode("dashboard")}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-primary" />
              <span className="cockpit-label">Meal Type</span>
            </div>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="font-mono uppercase tracking-wider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CockpitCard title="Food Details" variant="instrument">
            <div className="space-y-4">
              <div>
                <label className="cockpit-label block mb-2">Food Name</label>
                <Input
                  value={manualEntry.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setManualEntry(prev => ({ ...prev, name }));
                    
                    // Auto-calculate nutrition for any food name input
                    if (name.length > 2) {
                      const nutrition = calculateNutritionFromText(name);
                      // Only update if we found valid nutrition values
                      if (nutrition.calories > 0 || nutrition.protein > 0 || nutrition.carbs > 0 || nutrition.fat > 0) {
                        setManualEntry(prev => ({
                          ...prev,
                          name,
                          calories: nutrition.calories,
                          protein: nutrition.protein,
                          carbs: nutrition.carbs,
                          fat: nutrition.fat,
                        }));
                      }
                    } else if (name.length === 0) {
                      // Reset values when clearing
                      setManualEntry(prev => ({
                        ...prev,
                        name: "",
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    // Recalculate on blur to catch any missed calculations
                    const name = e.target.value;
                    if (name.length > 2) {
                      const nutrition = calculateNutritionFromText(name);
                      if (nutrition.calories > 0 || nutrition.protein > 0 || nutrition.carbs > 0 || nutrition.fat > 0) {
                        setManualEntry(prev => ({
                          ...prev,
                          calories: nutrition.calories,
                          protein: nutrition.protein,
                          carbs: nutrition.carbs,
                          fat: nutrition.fat,
                        }));
                      }
                    }
                  }}
                  placeholder="e.g., 130g cous cous and 200g chicken"
                  className="font-mono"
                  data-testid="input-food-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="cockpit-label block mb-2">Calories</label>
                  <Input
                    type="number"
                    value={manualEntry.calories || ""}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="font-mono"
                    data-testid="input-calories"
                  />
                </div>
                <div>
                  <label className="cockpit-label block mb-2">Protein (g)</label>
                  <Input
                    type="number"
                    value={manualEntry.protein || ""}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="font-mono"
                    data-testid="input-protein"
                  />
                </div>
                <div>
                  <label className="cockpit-label block mb-2">Carbs (g)</label>
                  <Input
                    type="number"
                    value={manualEntry.carbs || ""}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="font-mono"
                    data-testid="input-carbs"
                  />
                </div>
                <div>
                  <label className="cockpit-label block mb-2">Fat (g)</label>
                  <Input
                    type="number"
                    value={manualEntry.fat || ""}
                    onChange={(e) => setManualEntry(prev => ({ ...prev, fat: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    className="font-mono"
                    data-testid="input-fat"
                  />
                </div>
              </div>
            </div>
          </CockpitCard>
        </div>

        <div className="mt-4">
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wide" 
            size="lg"
            onClick={handleAddFood}
            disabled={!manualEntry.name || addNutritionMutation.isPending}
            data-testid="button-add-manual"
          >
            <Plus className="mr-2 h-4 w-4" /> ADD TO LOG
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold tracking-[0.15em] text-foreground uppercase font-mono">FUEL STATUS</h1>
          <p className="text-[10px] text-muted-foreground font-mono tracking-wider">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
          </p>
        </div>
        <Annunciator status={calorieStatus === "warning" ? "red" : calorieStatus === "amber" ? "amber" : "green"}>
          {calorieStatus === "warning" ? "OVER LIMIT" : calorieStatus === "amber" ? "NEARING TARGET" : "ON TRACK"}
        </Annunciator>
      </header>

      <CockpitCard variant="instrument" className="py-6">
        <div className="flex flex-col items-center">
          <CalorieRing />
          
          <div className="w-full mt-6 pt-4 border-t border-border/30">
            <div className="flex gap-4">
              <MacroBar 
                label="Protein" 
                current={summary.protein} 
                target={targets.protein} 
                color="hsl(195 100% 50%)" 
              />
              <MacroBar 
                label="Carbs" 
                current={summary.carbs} 
                target={targets.carbs} 
                color="hsl(38 100% 50%)" 
              />
              <MacroBar 
                label="Fat" 
                current={summary.fat} 
                target={targets.fat} 
                color="hsl(280 65% 60%)" 
              />
            </div>
          </div>
        </div>
      </CockpitCard>

      <div className="grid grid-cols-2 gap-3">
        {isPremium ? (
          <Button 
            className="h-16 mfd-button flex-col gap-1"
            variant="outline"
            onClick={() => setViewMode("camera")}
            data-testid="button-scan-food"
          >
            <Camera className="w-5 h-5" />
            <span>SCAN FOOD</span>
          </Button>
        ) : (
          <Button 
            className="h-16 mfd-button flex-col gap-1 relative overflow-hidden"
            variant="outline"
            onClick={() => setLocation("/upgrade")}
            data-testid="button-scan-food-locked"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10" />
            <Lock className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400">SCAN FOOD</span>
            <span className="absolute top-1 right-1 flex items-center gap-0.5 text-[8px] text-amber-400 bg-amber-500/20 px-1 rounded">
              <Sparkles className="w-2 h-2" /> PRO
            </span>
          </Button>
        )}
        <Button 
          className="h-16 mfd-button flex-col gap-1"
          variant="outline"
          onClick={() => setViewMode("manual")}
          data-testid="button-manual-entry"
        >
          <Edit2 className="w-5 h-5" />
          <span>MANUAL</span>
        </Button>
      </div>

      <CockpitCard title="Today's Fuel Log">
        {todayLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-mono">No meals logged today</p>
            <p className="text-xs mt-1">Scan or add your first meal</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayLogs.map((log) => (
              <div 
                key={log.id} 
                className="flex items-center justify-between p-3 pfd-display rounded-lg"
                data-testid={`food-log-${log.id}`}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{log.mealName}</div>
                  <div className="flex gap-3 text-[10px] text-muted-foreground font-mono mt-1">
                    <span>{log.mealTime}</span>
                    <span className="text-[hsl(195,100%,50%)]">P:{log.protein}g</span>
                    <span className="text-[hsl(38,100%,50%)]">C:{log.carbs}g</span>
                    <span className="text-[hsl(280,65%,60%)]">F:{log.fat}g</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono text-lg lcd-text">{log.calories}</div>
                    <div className="text-[9px] text-muted-foreground">KCAL</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteNutritionMutation.mutate(log.id)}
                    data-testid={`delete-log-${log.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CockpitCard>

      <CockpitCard title="Daily Targets" variant="default">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg pfd-display flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-mono">TDEE</div>
              <div className="font-mono lcd-text">{targets.tdee}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg pfd-display flex items-center justify-center">
              <Target className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground font-mono">TARGET</div>
              <div className="font-mono lcd-text-amber">{targets.targetCalories}</div>
            </div>
          </div>
        </div>
      </CockpitCard>
    </div>
  );
}
