import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { DEFAULT_PROFILE, PilotProfile, LOG_DATA } from "@/lib/mockData";
import { Save, User, Activity, CalendarDays, HeartPulse, Stethoscope, AlertTriangle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { differenceInDays, parseISO, format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { profileApi } from "@/lib/api";

export default function Profile() {
  const [profile, setProfile] = useState<PilotProfile>(() => {
    const saved = localStorage.getItem("flightfuel_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [analysis, setAnalysis] = useState<{bmi: number, category: string} | null>(null);
  const [medicalReadiness, setMedicalReadiness] = useState<{status: 'green'|'amber'|'red', reason: string} | null>(null);
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { logout, user } = useAuth();

  useEffect(() => {
     // Initial calculation on load if data exists
     if (profile.height && profile.weight) {
        setAnalysis(calculateBMI(profile.height, profile.weight));
     }
     assessReadiness();
  }, [profile]);

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

  const assessReadiness = () => {
     // Mock logic for demonstration based on trends
     // In a real app, this would analyze the LOG_DATA array for trends
     
     let status: 'green'|'amber'|'red' = 'green';
     let reasons: string[] = [];

     // BMI Check
     const bmiRes = calculateBMI(profile.height, profile.weight);
     if (bmiRes) {
        if (bmiRes.bmi > 29 || bmiRes.bmi < 18.5) {
             status = 'amber';
             reasons.push("BMI outside standard range");
        }
        if (bmiRes.bmi > 35) {
             status = 'red';
             reasons.push("BMI indicates high risk category");
        }
     }

     // Sleep Trend (Mock from LOG_DATA logic)
     // Assuming simplistic check for demo
     const avgEnergy = LOG_DATA.reduce((acc, curr) => acc + curr.energy, 0) / LOG_DATA.length;
     if (avgEnergy < 3) {
         status = status === 'red' ? 'red' : 'amber';
         reasons.push("Recent energy levels indicate fatigue trend");
     }

     if (profile.restingHeartRate && profile.restingHeartRate > 90) {
         status = 'amber';
         reasons.push("Elevated Resting Heart Rate");
     }

     if (reasons.length === 0) {
         reasons.push("All monitored trends within nominal limits.");
     }

     setMedicalReadiness({
         status,
         reason: reasons.join(". ")
     });
  };

  const handleSave = () => {
    localStorage.setItem("flightfuel_profile", JSON.stringify(profile));
    
    const result = calculateBMI(profile.height, profile.weight);
    setAnalysis(result);
    assessReadiness();
    
    toast({
      title: "Profile Updated",
      description: "Flight plan targets recalibrated based on new biometrics.",
    });
  };

  const handleInputChange = (field: keyof PilotProfile, value: string) => {
    const numValue = value === "" ? 0 : Number(value);
    setProfile(prev => ({ ...prev, [field]: numValue }));
  };

  const handleDateChange = (value: string) => {
      setProfile(prev => ({ ...prev, nextMedicalDate: value }));
  };

  const getDaysUntilMedical = () => {
      if (!profile.nextMedicalDate) return null;
      const today = new Date();
      const medDate = parseISO(profile.nextMedicalDate);
      const days = differenceInDays(medDate, today);
      return days;
  };

  const daysUntilMedical = getDaysUntilMedical();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "Session terminated successfully.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
            <User className="text-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Pilot Profile</h1>
            <p className="text-xs text-muted-foreground font-mono">{user?.username}</p>
          </div>
        </div>
        <Button
          data-testid="button-logout"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </header>

      {/* Medical Readiness Section */}
      <CockpitCard title="Medical Certificate Readiness">
         <div className="space-y-4">
            <div className="bg-muted/10 p-3 rounded border border-border flex gap-3 items-start">
               <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
               <p className="text-[10px] text-muted-foreground leading-tight">
                  <span className="font-bold">DISCLAIMER:</span> This tool monitors personal biometric trends only. It DOES NOT provide medical advice or determine fitness for duty. Always consult an AME/DAME for official certification.
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="medDate" className="text-xs font-mono uppercase text-muted-foreground">Next Medical Date</Label>
                  <Input 
                    id="medDate" 
                    type="date" 
                    value={profile.nextMedicalDate || ""} 
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="font-mono bg-background/50 border-input focus:border-primary/50 transition-colors text-xs"
                  />
               </div>
               <div className="flex flex-col justify-end pb-2">
                  {daysUntilMedical !== null && (
                      <div className={`text-right font-mono ${daysUntilMedical < 30 ? 'text-destructive' : 'text-primary'}`}>
                          <div className="text-2xl font-bold leading-none">{daysUntilMedical}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Days Remaining</div>
                      </div>
                  )}
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="rhr" className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-2">
                  <HeartPulse className="w-3 h-3" /> Resting Heart Rate (Optional)
               </Label>
               <Input 
                  id="rhr" 
                  type="number" 
                  placeholder="BPM"
                  value={profile.restingHeartRate || ""} 
                  onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
                  className="font-mono bg-background/50 border-input focus:border-primary/50 transition-colors"
               />
            </div>

            {medicalReadiness && (
                <div className={`mt-4 border rounded-sm p-4 flex items-center gap-4 ${
                    medicalReadiness.status === 'green' ? 'bg-emerald-500/10 border-emerald-500/30' :
                    medicalReadiness.status === 'amber' ? 'bg-amber-500/10 border-amber-500/30' :
                    'bg-destructive/10 border-destructive/30'
                }`}>
                    <div className={`p-2 rounded-full ${
                        medicalReadiness.status === 'green' ? 'bg-emerald-500/20 text-emerald-500' :
                        medicalReadiness.status === 'amber' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-destructive/20 text-destructive'
                    }`}>
                        <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                        <div className={`font-bold font-mono uppercase text-sm mb-1 ${
                            medicalReadiness.status === 'green' ? 'text-emerald-500' :
                            medicalReadiness.status === 'amber' ? 'text-amber-500' :
                            'text-destructive'
                        }`}>
                            Readiness: {medicalReadiness.status.toUpperCase()}
                        </div>
                        <div className="text-xs text-foreground/80 leading-snug">
                            {medicalReadiness.reason}
                        </div>
                    </div>
                </div>
            )}
         </div>
      </CockpitCard>

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
