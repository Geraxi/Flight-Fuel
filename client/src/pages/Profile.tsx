import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { DEFAULT_PROFILE, PilotProfile } from "@/lib/mockData";
import { Save, User, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Profile() {
  const [profile, setProfile] = useState<PilotProfile>(() => {
    const saved = localStorage.getItem("flightfuel_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [analysis, setAnalysis] = useState<{bmi: number, category: string} | null>(null);
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const calculateBMI = (heightCm: number, weightKg: number) => {
    if (!heightCm || !weightKg) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi >= 25 && bmi < 30) category = "Overweight";
    else if (bmi >= 30) category = "Obese";
    
    return { bmi: parseFloat(bmi.toFixed(1)), category };
  };

  const handleSave = () => {
    localStorage.setItem("flightfuel_profile", JSON.stringify(profile));
    
    const result = calculateBMI(profile.height, profile.weight);
    setAnalysis(result);
    
    toast({
      title: "Profile Updated",
      description: "Flight plan targets recalibrated based on new biometrics.",
    });
  };

  const handleInputChange = (field: keyof PilotProfile, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    setProfile(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6 flex items-center gap-3">
         <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
          <User className="text-primary w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Pilot Profile</h1>
          <p className="text-xs text-muted-foreground font-mono">CALIBRATE TARGETS</p>
        </div>
      </header>

      {analysis && (
        <CockpitCard title="Biometric Analysis" className="border-primary/50 bg-primary/5 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-mono uppercase mb-1">BMI Calculation</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-primary">{analysis.bmi}</span>
                <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                  analysis.category === "Normal" 
                    ? "bg-primary/20 text-primary" 
                    : analysis.category === "Underweight" 
                      ? "bg-secondary/20 text-secondary" 
                      : "bg-destructive/20 text-destructive"
                }`}>
                  {analysis.category.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </CockpitCard>
      )}

      <CockpitCard title="Biometrics">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-xs font-mono uppercase text-muted-foreground">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={profile.height || ""} 
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="font-mono bg-background/50 border-input focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-xs font-mono uppercase text-muted-foreground">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={profile.weight || ""} 
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="font-mono bg-background/50 border-input focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-2">
             <Label htmlFor="age" className="text-xs font-mono uppercase text-muted-foreground">Age</Label>
              <Input 
                id="age" 
                type="number" 
                value={profile.age || ""} 
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="font-mono bg-background/50 border-input focus:border-primary/50 transition-colors"
              />
          </div>
        </div>
      </CockpitCard>

      <CockpitCard title="Operational Parameters">
        <div className="space-y-4">
           <div className="space-y-2">
            <Label className="text-xs font-mono uppercase text-muted-foreground">Activity Level</Label>
            <Select 
              value={profile.activityLevel} 
              onValueChange={(val: any) => setProfile({...profile, activityLevel: val})}
            >
              <SelectTrigger className="font-mono bg-background/50 focus:ring-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedentary">Sedentary (Office/Cockpit)</SelectItem>
                <SelectItem value="Light">Light (1-2 days/week)</SelectItem>
                <SelectItem value="Moderate">Moderate (3-5 days/week)</SelectItem>
                <SelectItem value="Active">Active (6-7 days/week)</SelectItem>
                <SelectItem value="Very Active">Very Active (2x day)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase text-muted-foreground">Training Frequency (Sessions/Wk)</Label>
             <Input 
                type="number" 
                value={profile.trainingFreq || ""} 
                onChange={(e) => handleInputChange("trainingFreq", e.target.value)}
                className="font-mono bg-background/50 border-input focus:border-primary/50 transition-colors"
              />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase text-muted-foreground">Primary Goal</Label>
            <Select 
              value={profile.goal} 
              onValueChange={(val: any) => setProfile({...profile, goal: val})}
            >
              <SelectTrigger className="font-mono bg-background/50 focus:ring-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cut">Cut (Fat Loss)</SelectItem>
                <SelectItem value="Maintain">Maintain Performance</SelectItem>
                <SelectItem value="Performance">Max Performance (Surplus)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CockpitCard>

      <Button onClick={handleSave} className="w-full font-mono tracking-wider" size="lg">
        <Save className="w-4 h-4 mr-2" /> SAVE PROFILE
      </Button>
    </div>
  );
}
