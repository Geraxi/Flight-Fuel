import { LucideIcon } from "lucide-react";

export interface FlightSegment {
  id: string;
  dep: string;
  arr: string;
  etd: string;
  eta: string;
}

export interface DutyStatus {
  dutyStart: string;
  dutyType: "Flight" | "Reserve" | "Training";
  conditions: "ISA" | "High Alt" | "Night" | "Fatigue Risk";
  mode: "Performance" | "Maintain" | "Cut";
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: "pending" | "complete" | "alert";
  value?: string;
}

export interface Advisory {
  id: string;
  level: "info" | "amber" | "warning";
  message: string;
  icon?: string;
}

export interface PilotProfile {
  height: number;
  weight: number;
  age: number;
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Active" | "Very Active";
  trainingFreq: number;
  goal: "Cut" | "Maintain" | "Performance";
}

export const CURRENT_DUTY: DutyStatus = {
  dutyStart: "05:30 LT",
  dutyType: "Flight",
  conditions: "High Alt",
  mode: "Performance",
};

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "1", label: "Fuel Strategy", status: "complete", value: "Carb Load" },
  { id: "2", label: "Fluid Load", status: "pending", value: "1.5L Rqd" },
  { id: "3", label: "Supplement Protocol", status: "pending", value: "Active" },
];

export const SUPPLEMENT_STACK = [
  { id: "s1", name: "Caffeine", dose: "100mg", timing: "Pre-Duty (Top of Descent)", type: "Performance" },
  { id: "s2", name: "Omega-3 (EPA/DHA)", dose: "2g", timing: "AM Meal", type: "Health" },
  { id: "s3", name: "Vitamin D3", dose: "5000 IU", timing: "AM Meal", type: "Immunity" },
  { id: "s4", name: "Creatine Monohydrate", dose: "5g", timing: "Post-Duty/Recovery", type: "Cognitive/Power" },
  { id: "s5", name: "Whey Protein Isolate", dose: "25g", timing: "Post-Workout/Snack", type: "Recovery" },
  { id: "s6", name: "Magnesium Bisglycinate", dose: "400mg", timing: "Pre-Sleep", type: "Sleep Support" },
];

export const ADVISORIES: Advisory[] = [
  { id: "1", level: "amber", message: "Circadian Low: 1400-1600 LT", icon: "Clock" },
  { id: "2", level: "info", message: "Hydration Status: Optimal", icon: "Droplets" },
];

export const PLAN_PHASES = [
  {
    time: "04:30 - 05:30",
    phase: "Pre-Duty",
    guidance: "Examples: Eggs with oats and fruit, or Greek yogurt with honey and nuts. 500ml Water.",
    icon: "Coffee",
    macros: { protein: 30, carbs: 40, fat: 15 },
    foodEquivalents: [
      "Eggs (3 whole) + Oats (50g dry) + Berries (1 cup)",
      "Greek Yogurt (200g) + Honey (1 tbsp) + Walnuts (30g)",
      "Protein Shake (1 scoop) + Banana + Peanut Butter (1 tbsp)"
    ]
  },
  {
    time: "05:30 - 11:00",
    phase: "Cruise / Duty",
    guidance: "Examples: Wraps, salads with lean protein, fruit, nuts, or protein bars. Light snacks every 2h. Avoid heavy fats.",
    icon: "Plane",
    macros: { protein: 20, carbs: 30, fat: 10 },
    foodEquivalents: [
        "Turkey Wrap (1 whole wheat wrap + 100g turkey) + Apple (1 medium)",
        "Protein Bar (low sugar, ~20g pro) + Almonds (15 nuts)",
        "Hard Boiled Eggs (2 large) + Rice Cakes (2) + Hummus (2 tbsp)"
    ]
  },
  {
    time: "11:00 - 12:00",
    phase: "Post-Duty",
    guidance: "Examples: Grilled chicken or fish with rice and vegetables, or turkey sandwich with vegetables. Recovery meal within 60min.",
    icon: "Utensils",
    macros: { protein: 40, carbs: 60, fat: 10 },
    foodEquivalents: [
        "Chicken Breast (150g) + Rice (1 cup cooked) + Broccoli",
        "White Fish (200g) + Quinoa (1 cup cooked) + Asparagus",
        "Chickpea Pasta (100g dry) + Tomato Sauce + Lean Beef Mince (100g)"
    ]
  },
  {
    time: "20:00",
    phase: "Recovery",
    guidance: "Examples: Chamomile tea, Magnesium support. No blue light.",
    icon: "Moon",
    macros: { protein: 20, carbs: 10, fat: 5 },
    foodEquivalents: [
        "Casein Protein Shake (30g powder)",
        "Cottage Cheese (150g) + 10 Almonds",
        "Greek Yogurt (150g) + Chamomile Tea (0 cal)"
    ]
  },
];

export const LOG_DATA = [
  { day: "M", weight: 75.2, energy: 4 },
  { day: "T", weight: 75.0, energy: 3 },
  { day: "W", weight: 74.8, energy: 5 },
  { day: "T", weight: 74.9, energy: 4 },
  { day: "F", weight: 74.5, energy: 4 },
  { day: "S", weight: 74.4, energy: 5 },
  { day: "S", weight: 74.6, energy: 4 },
];

export const DEFAULT_PROFILE: PilotProfile = {
    height: 180,
    weight: 75,
    age: 30,
    activityLevel: "Moderate",
    trainingFreq: 3,
    goal: "Maintain"
}
