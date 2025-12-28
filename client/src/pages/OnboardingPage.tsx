import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plane, User, Activity, Target, Dumbbell, Heart, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { profileApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface OnboardingProps {
  onComplete: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    height: "",
    weight: "",
    age: "",
    activityLevel: "Moderate",
    trainingFreq: "3",
    goal: "Maintain",
    restingHeartRate: "",
    nextMedicalDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await profileApi.create({
        height: parseInt(profile.height) || 170,
        weight: parseInt(profile.weight) || 70,
        age: parseInt(profile.age) || 30,
        activityLevel: profile.activityLevel,
        trainingFreq: parseInt(profile.trainingFreq) || 3,
        goal: profile.goal,
        restingHeartRate: profile.restingHeartRate ? parseInt(profile.restingHeartRate) : null,
        nextMedicalDate: profile.nextMedicalDate || null,
      });
      
      toast({
        title: "Profile Created",
        description: "Your personalized flight plan is ready!",
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = profile.height && profile.weight && profile.age;
  const isStep2Valid = profile.activityLevel && profile.trainingFreq;
  const isStep3Valid = profile.goal;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f35] to-[#0f1419] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-[#1a1f35]/90 border-cyan-500/20 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
            <Plane className="w-12 h-12 text-cyan-400 relative" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Flight Profile Setup</h1>
          <p className="text-cyan-400/80 text-sm text-center">Let's calibrate your performance targets</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                s === step
                  ? "bg-cyan-400 scale-125"
                  : s < step
                  ? "bg-cyan-400/50"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Biometrics</h2>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Height (cm)</Label>
              <Input
                data-testid="input-height"
                type="number"
                placeholder="175"
                value={profile.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              />
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Weight (kg)</Label>
              <Input
                data-testid="input-weight"
                type="number"
                placeholder="75"
                value={profile.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              />
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Age</Label>
              <Input
                data-testid="input-age"
                type="number"
                placeholder="30"
                value={profile.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              />
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Resting Heart Rate (optional)</Label>
              <Input
                data-testid="input-rhr"
                type="number"
                placeholder="65 BPM"
                value={profile.restingHeartRate}
                onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Activity Level</h2>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Daily Activity Level</Label>
              <Select value={profile.activityLevel} onValueChange={(v) => handleInputChange("activityLevel", v)}>
                <SelectTrigger data-testid="select-activity" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedentary">Sedentary (Desk job, little exercise)</SelectItem>
                  <SelectItem value="Light">Light (1-2 days/week)</SelectItem>
                  <SelectItem value="Moderate">Moderate (3-4 days/week)</SelectItem>
                  <SelectItem value="Active">Active (5-6 days/week)</SelectItem>
                  <SelectItem value="Very Active">Very Active (Daily intense training)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Training Sessions per Week</Label>
              <Select value={profile.trainingFreq} onValueChange={(v) => handleInputChange("trainingFreq", v)}>
                <SelectTrigger data-testid="select-training-freq" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Rest & Recovery Focus</SelectItem>
                  <SelectItem value="1">1-2 sessions</SelectItem>
                  <SelectItem value="3">3-4 sessions</SelectItem>
                  <SelectItem value="5">5-6 sessions</SelectItem>
                  <SelectItem value="7">Daily training</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Next Medical Exam Date (optional)</Label>
              <Input
                data-testid="input-medical"
                type="date"
                value={profile.nextMedicalDate}
                onChange={(e) => handleInputChange("nextMedicalDate", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Your Goal</h2>
            </div>

            <p className="text-sm text-gray-400 mb-4">Select your primary nutrition and performance goal:</p>

            <div className="space-y-3">
              {[
                { value: "Cut", label: "Cut Weight", desc: "Reduce body fat while maintaining muscle", icon: "📉" },
                { value: "Maintain", label: "Maintain", desc: "Keep current weight and optimize energy", icon: "⚖️" },
                { value: "Performance", label: "Performance", desc: "Build strength and maximize recovery", icon: "🚀" },
              ].map((g) => (
                <button
                  key={g.value}
                  data-testid={`button-goal-${g.value.toLowerCase()}`}
                  onClick={() => handleInputChange("goal", g.value)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    profile.goal === g.value
                      ? "bg-cyan-500/20 border-cyan-500 text-white"
                      : "bg-[#0a0e1a] border-cyan-500/30 text-gray-300 hover:border-cyan-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <div className="font-semibold">{g.label}</div>
                      <div className="text-xs text-gray-400">{g.desc}</div>
                    </div>
                    {profile.goal === g.value && (
                      <Check className="w-5 h-5 text-cyan-400 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button
              data-testid="button-back"
              variant="ghost"
              onClick={handleBack}
              className="text-cyan-400"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              data-testid="button-next"
              onClick={handleNext}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              data-testid="button-complete"
              onClick={handleComplete}
              disabled={!isStep3Valid || loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {loading ? "Setting up..." : "Complete Setup"}
              <Check className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
