import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plane, User, Activity, Target, Dumbbell, Heart, ChevronRight, ChevronLeft, Check, Utensils, AlertTriangle, Moon } from "lucide-react";
import { profileApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface OnboardingProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 6;

const ALLERGY_OPTIONS = [
  { id: "gluten", label: "Gluten" },
  { id: "dairy", label: "Dairy" },
  { id: "nuts", label: "Tree Nuts" },
  { id: "peanuts", label: "Peanuts" },
  { id: "shellfish", label: "Shellfish" },
  { id: "eggs", label: "Eggs" },
  { id: "soy", label: "Soy" },
  { id: "fish", label: "Fish" },
];

const EQUIPMENT_OPTIONS = [
  { id: "dumbbells", label: "Dumbbells" },
  { id: "barbell", label: "Barbell & Rack" },
  { id: "kettlebell", label: "Kettlebells" },
  { id: "bands", label: "Resistance Bands" },
  { id: "pullup", label: "Pull-up Bar" },
  { id: "cardio", label: "Cardio Machines" },
  { id: "bodyweight", label: "Bodyweight Only" },
];

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
    dietType: "Omnivore",
    allergies: [] as string[],
    foodRestrictions: "",
    trainingLocation: "Gym",
    trainingStyle: "Mixed",
    equipmentAccess: [] as string[],
    healthConditions: "",
    injuries: "",
    sleepQuality: "Good",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "allergies" | "equipmentAccess", item: string) => {
    setProfile(prev => {
      const current = prev[field];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...current, item] };
    });
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
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
        dietType: profile.dietType,
        allergies: profile.allergies.length > 0 ? profile.allergies : null,
        foodRestrictions: profile.foodRestrictions || null,
        trainingLocation: profile.trainingLocation,
        trainingStyle: profile.trainingStyle,
        equipmentAccess: profile.equipmentAccess.length > 0 ? profile.equipmentAccess : null,
        healthConditions: profile.healthConditions || null,
        injuries: profile.injuries || null,
        sleepQuality: profile.sleepQuality,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f35] to-[#0f1419] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-[#1a1f35]/90 border-cyan-500/20 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
            <Plane className="w-12 h-12 text-cyan-400 relative" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Flight Profile Setup</h1>
          <p className="text-cyan-400/80 text-sm text-center">Let's calibrate your performance targets</p>
        </div>

        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i + 1 === step
                  ? "bg-cyan-400 scale-125"
                  : i + 1 < step
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

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                <Label className="text-sm text-cyan-400/80 mb-1 block">Resting HR (opt)</Label>
                <Input
                  data-testid="input-rhr"
                  type="number"
                  placeholder="65"
                  value={profile.restingHeartRate}
                  onChange={(e) => handleInputChange("restingHeartRate", e.target.value)}
                  className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Dietary Preferences</h2>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Diet Type</Label>
              <Select value={profile.dietType} onValueChange={(v) => handleInputChange("dietType", v)}>
                <SelectTrigger data-testid="select-diet" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Omnivore">Omnivore (No restrictions)</SelectItem>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Vegan">Vegan</SelectItem>
                  <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="Keto">Keto / Low Carb</SelectItem>
                  <SelectItem value="Paleo">Paleo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-2 block">Allergies & Intolerances</Label>
              <div className="grid grid-cols-2 gap-2">
                {ALLERGY_OPTIONS.map((allergy) => (
                  <label
                    key={allergy.id}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                      profile.allergies.includes(allergy.id)
                        ? "bg-red-500/20 border-red-500/50 text-red-300"
                        : "bg-[#0a0e1a] border-cyan-500/30 text-gray-300"
                    }`}
                  >
                    <Checkbox
                      checked={profile.allergies.includes(allergy.id)}
                      onCheckedChange={() => toggleArrayItem("allergies", allergy.id)}
                      className="border-cyan-500/30"
                    />
                    <span className="text-sm">{allergy.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Other Restrictions (optional)</Label>
              <Input
                data-testid="input-restrictions"
                placeholder="e.g., low sodium, no spicy food"
                value={profile.foodRestrictions}
                onChange={(e) => handleInputChange("foodRestrictions", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Training Setup</h2>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Where do you train?</Label>
              <Select value={profile.trainingLocation} onValueChange={(v) => handleInputChange("trainingLocation", v)}>
                <SelectTrigger data-testid="select-location" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gym">Commercial Gym</SelectItem>
                  <SelectItem value="Home">Home Gym</SelectItem>
                  <SelectItem value="Hotel">Hotel / Travel</SelectItem>
                  <SelectItem value="Outdoors">Outdoors / Park</SelectItem>
                  <SelectItem value="Mixed">Mix of Locations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Training Style</Label>
              <Select value={profile.trainingStyle} onValueChange={(v) => handleInputChange("trainingStyle", v)}>
                <SelectTrigger data-testid="select-style" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weights">Weight Training / Bodybuilding</SelectItem>
                  <SelectItem value="Calisthenics">Calisthenics / Bodyweight</SelectItem>
                  <SelectItem value="Cardio">Cardio Focus (Running, Cycling)</SelectItem>
                  <SelectItem value="CrossFit">CrossFit / Functional</SelectItem>
                  <SelectItem value="Mixed">Mixed / Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-2 block">Equipment Access</Label>
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <label
                    key={eq.id}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${
                      profile.equipmentAccess.includes(eq.id)
                        ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                        : "bg-[#0a0e1a] border-cyan-500/30 text-gray-300"
                    }`}
                  >
                    <Checkbox
                      checked={profile.equipmentAccess.includes(eq.id)}
                      onCheckedChange={() => toggleArrayItem("equipmentAccess", eq.id)}
                      className="border-cyan-500/30"
                    />
                    <span className="text-sm">{eq.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Activity & Recovery</h2>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Daily Activity Level</Label>
              <Select value={profile.activityLevel} onValueChange={(v) => handleInputChange("activityLevel", v)}>
                <SelectTrigger data-testid="select-activity" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedentary">Sedentary (Desk job)</SelectItem>
                  <SelectItem value="Light">Light (1-2 workouts/week)</SelectItem>
                  <SelectItem value="Moderate">Moderate (3-4 workouts/week)</SelectItem>
                  <SelectItem value="Active">Active (5-6 workouts/week)</SelectItem>
                  <SelectItem value="Very Active">Very Active (Daily training)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Training Sessions per Week</Label>
              <Select value={profile.trainingFreq} onValueChange={(v) => handleInputChange("trainingFreq", v)}>
                <SelectTrigger data-testid="select-freq" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - Recovery Phase</SelectItem>
                  <SelectItem value="2">1-2 sessions</SelectItem>
                  <SelectItem value="3">3-4 sessions</SelectItem>
                  <SelectItem value="5">5-6 sessions</SelectItem>
                  <SelectItem value="7">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Sleep Quality</Label>
              <Select value={profile.sleepQuality} onValueChange={(v) => handleInputChange("sleepQuality", v)}>
                <SelectTrigger data-testid="select-sleep" className="bg-[#0a0e1a] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Poor">Poor (Less than 5 hours)</SelectItem>
                  <SelectItem value="Fair">Fair (5-6 hours, disrupted)</SelectItem>
                  <SelectItem value="Good">Good (6-7 hours)</SelectItem>
                  <SelectItem value="Excellent">Excellent (7+ hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Health Information</h2>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-200/80">
                  This helps us customize recommendations. Always consult your AME for medical concerns.
                </p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Health Conditions (optional)</Label>
              <Textarea
                data-testid="input-conditions"
                placeholder="e.g., high blood pressure, diabetes, asthma..."
                value={profile.healthConditions}
                onChange={(e) => handleInputChange("healthConditions", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400 min-h-[80px]"
              />
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Injuries or Limitations (optional)</Label>
              <Textarea
                data-testid="input-injuries"
                placeholder="e.g., lower back issues, shoulder injury, knee problems..."
                value={profile.injuries}
                onChange={(e) => handleInputChange("injuries", e.target.value)}
                className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400 min-h-[80px]"
              />
            </div>

            <div>
              <Label className="text-sm text-cyan-400/80 mb-1 block">Next Medical Exam (optional)</Label>
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

        {step === 6 && (
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

          {step < TOTAL_STEPS ? (
            <Button
              data-testid="button-next"
              onClick={handleNext}
              disabled={step === 1 && !isStep1Valid}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              data-testid="button-complete"
              onClick={handleComplete}
              disabled={loading}
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
