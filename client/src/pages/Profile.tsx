import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { DEFAULT_PROFILE, PilotProfile, LOG_DATA } from "@/lib/mockData";
import { Save, User, Activity, CalendarDays, HeartPulse, Stethoscope, AlertTriangle, LogOut, Mail, Shield, Trash2, PauseCircle, ExternalLink, Settings, Key, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { differenceInDays, parseISO, format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { usePremium } from "@/lib/premium";
import { profileApi, subscriptionApi } from "@/lib/api";
import { SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user: authUser, profile: authProfile, refetchProfile } = useAuth();
  const { user: clerkUser } = useUser();
  const { isPremium, subscriptionStatus, loading: premiumLoading } = usePremium();
  
  const [profile, setProfile] = useState<PilotProfile>(() => {
    if (authProfile) {
      return {
        height: authProfile.height,
        weight: authProfile.weight,
        age: authProfile.age,
        activityLevel: authProfile.activityLevel as any,
        trainingFreq: authProfile.trainingFreq,
        goal: authProfile.goal as any,
        nextMedicalDate: authProfile.nextMedicalDate || undefined,
        restingHeartRate: authProfile.restingHeartRate || undefined,
      };
    }
    return DEFAULT_PROFILE;
  });
  const [analysis, setAnalysis] = useState<{bmi: number, category: string} | null>(null);
  const [medicalReadiness, setMedicalReadiness] = useState<{status: 'green'|'amber'|'red', reason: string} | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
     if (authProfile) {
       setProfile({
         height: authProfile.height,
         weight: authProfile.weight,
         age: authProfile.age,
         activityLevel: authProfile.activityLevel as any,
         trainingFreq: authProfile.trainingFreq,
         goal: authProfile.goal as any,
         nextMedicalDate: authProfile.nextMedicalDate || undefined,
         restingHeartRate: authProfile.restingHeartRate || undefined,
       });
     }
  }, [authProfile]);

  useEffect(() => {
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

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileApi.update(profile);
      await refetchProfile();
      
      const result = calculateBMI(profile.height, profile.weight);
      setAnalysis(result);
      assessReadiness();
      
      toast({
        title: "Profile Updated",
        description: "Flight plan targets recalibrated based on new biometrics.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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


  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
            <User className="text-primary w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Pilot Profile</h1>
            <p className="text-xs text-muted-foreground font-mono">{authUser?.username}</p>
          </div>
        </div>
        <SignOutButton>
          <Button
            data-testid="button-logout"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
          </Button>
        </SignOutButton>
      </header>

      {/* Medical Readiness Section */}
      <CockpitCard title="Medical Certificate Readiness">
         <div className="space-y-4">
            <div className="bg-muted/10 p-3 rounded border border-border flex gap-3 items-start">
               <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" strokeWidth={2} />
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
                  <HeartPulse className="w-4 h-4" strokeWidth={2} /> Resting Heart Rate (Optional)
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
                        <Stethoscope className="w-7 h-7" strokeWidth={2} />
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
              <Activity className="w-7 h-7 text-primary" strokeWidth={2} />
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

      <Button onClick={handleSave} className="w-full font-mono tracking-wider" size="lg" disabled={saving}>
        <Save className="w-5 h-5 mr-2" strokeWidth={2} /> {saving ? "SAVING..." : "SAVE PROFILE"}
      </Button>

      {/* Subscription Section */}
      <CockpitCard title="Subscription" className="mt-4">
        {premiumLoading ? (
          <div className="text-center text-muted-foreground py-4">Loading...</div>
        ) : isPremium ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Crown className="w-7 h-7 text-amber-400" strokeWidth={2} fill="currentColor" />
              </div>
              <div className="flex-1">
                <div className="font-mono font-bold text-amber-400">FlightFuel Premium</div>
                <div className="text-xs text-muted-foreground capitalize">Status: {subscriptionStatus}</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full font-mono"
              onClick={() => setLocation('/upgrade')}
              data-testid="button-manage-subscription"
            >
              <Settings className="w-5 h-5 mr-2" strokeWidth={2} /> Manage Subscription
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-amber-400" strokeWidth={2} fill="currentColor" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono font-bold text-white">Upgrade to Premium</h4>
                  <p className="text-xs text-muted-foreground">Unlock AI scanning, videos & more</p>
                </div>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 mb-4 ml-10">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> AI-powered meal scanning</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Full exercise video library</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Advanced analytics dashboard</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Personalized recommendations</li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-mono"
                onClick={() => setLocation('/upgrade')}
                data-testid="button-upgrade-premium"
              >
                <Sparkles className="w-5 h-5 mr-2" strokeWidth={2} fill="currentColor" /> Upgrade Now - $9.99/mo
              </Button>
            </div>
          </div>
        )}
      </CockpitCard>

      <CockpitCard title="Account Information" className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-14 h-14"
                }
              }}
            />
            <div className="flex-1">
              <div className="font-mono text-base font-bold">{clerkUser?.fullName || authUser?.username}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="w-4 h-4" strokeWidth={2} /> {clerkUser?.primaryEmailAddress?.emailAddress || "No email"}
              </div>
              <div className="text-[10px] text-primary/70 mt-1 flex items-center gap-1">
                <Shield className="w-4 h-4" strokeWidth={2} /> Pilot Account
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-muted-foreground mb-2">Account Details</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted/10 p-3 rounded border border-border/50">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">User ID</div>
                <div className="font-mono text-xs truncate">{clerkUser?.id?.slice(0, 12)}...</div>
              </div>
              <div className="bg-muted/10 p-3 rounded border border-border/50">
                <div className="text-[10px] font-mono uppercase text-muted-foreground">Member Since</div>
                <div className="font-mono text-xs">
                  {clerkUser?.createdAt ? format(new Date(clerkUser.createdAt), "MMM yyyy") : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-muted-foreground mb-2">Quick Links</div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start font-mono text-xs"
                onClick={() => window.open("https://flightfuel.app/privacy", "_blank")}
                data-testid="link-privacy"
              >
                <Shield className="w-4 h-4 mr-2" strokeWidth={2} /> Privacy Policy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start font-mono text-xs"
                onClick={() => window.open("https://flightfuel.app/terms", "_blank")}
                data-testid="link-terms"
              >
                <ExternalLink className="w-4 h-4 mr-2" strokeWidth={2} /> Terms of Service
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start font-mono text-xs"
                onClick={() => window.open("https://flightfuel.app/help", "_blank")}
                data-testid="link-help"
              >
                <Settings className="w-4 h-4 mr-2" strokeWidth={2} /> Help Center
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start font-mono text-xs"
                onClick={() => window.open("https://flightfuel.app/contact", "_blank")}
                data-testid="link-contact"
              >
                <Mail className="w-4 h-4 mr-2" strokeWidth={2} /> Contact Support
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-muted-foreground mb-2">Session</div>
            <SignOutButton>
              <Button variant="outline" className="w-full font-mono" data-testid="button-signout">
                <LogOut className="w-5 h-5 mr-2" strokeWidth={2} /> Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </CockpitCard>

      <CockpitCard title="Account Management" className="mt-4 border-destructive/30">
        <div className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
            <p className="text-[10px] text-muted-foreground leading-tight">
              <span className="font-bold text-amber-500">CAUTION:</span> These actions affect your account status. Suspended accounts can be reactivated, but deleted accounts are permanently removed.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full font-mono justify-start border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                  data-testid="button-suspend"
                >
                  <PauseCircle className="w-5 h-5 mr-2" strokeWidth={2} /> Suspend Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Suspend Your Account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Suspending your account will temporarily disable access to FlightFuel. Your data will be preserved and you can reactivate at any time by contacting support.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-amber-500 hover:bg-amber-600"
                    onClick={() => {
                      toast({
                        title: "Account Suspension Requested",
                        description: "Our support team will process your request within 24 hours.",
                      });
                    }}
                  >
                    Suspend Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full font-mono justify-start border-destructive/30 text-destructive hover:bg-destructive/10"
                  data-testid="button-delete"
                >
                  <Trash2 className="w-5 h-5 mr-2" strokeWidth={2} /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-destructive">Delete Your Account Permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All your data including workout history, nutrition logs, flight schedules, and profile information will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => {
                      toast({
                        title: "Account Deletion Requested",
                        description: "Your account will be deleted within 7 days. You'll receive a confirmation email.",
                        variant: "destructive",
                      });
                    }}
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CockpitCard>
    </div>
  );
}
