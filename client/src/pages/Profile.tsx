import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { DEFAULT_PROFILE, PilotProfile } from "@/lib/mockData";
import { Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Profile() {
  const [profile, setProfile] = useState<PilotProfile>(DEFAULT_PROFILE);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSave = () => {
    // In a real app, this would save to backend/storage
    toast({
      title: "Profile Updated",
      description: "Flight plan targets recalibrated based on new biometrics.",
    });
    setLocation("/");
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

      <CockpitCard title="Biometrics">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height" className="text-xs font-mono uppercase text-muted-foreground">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={profile.height} 
                onChange={(e) => setProfile({...profile, height: Number(e.target.value)})}
                className="font-mono bg-background/50 border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-xs font-mono uppercase text-muted-foreground">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={profile.weight} 
                onChange={(e) => setProfile({...profile, weight: Number(e.target.value)})}
                className="font-mono bg-background/50 border-input"
              />
            </div>
          </div>
          
          <div className="space-y-2">
             <Label htmlFor="age" className="text-xs font-mono uppercase text-muted-foreground">Age</Label>
              <Input 
                id="age" 
                type="number" 
                value={profile.age} 
                onChange={(e) => setProfile({...profile, age: Number(e.target.value)})}
                className="font-mono bg-background/50 border-input"
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
              <SelectTrigger className="font-mono bg-background/50">
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
                value={profile.trainingFreq} 
                onChange={(e) => setProfile({...profile, trainingFreq: Number(e.target.value)})}
                className="font-mono bg-background/50 border-input"
              />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase text-muted-foreground">Primary Goal</Label>
            <Select 
              value={profile.goal} 
              onValueChange={(val: any) => setProfile({...profile, goal: val})}
            >
              <SelectTrigger className="font-mono bg-background/50">
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
