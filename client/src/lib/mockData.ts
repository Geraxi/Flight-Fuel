import { LucideIcon } from "lucide-react";

import oatmealImg from "@assets/stock_images/oatmeal_with_berries_7826eb07.jpg";
import yogurtImg from "@assets/stock_images/greek_yogurt_bowl_wi_cf0a36ea.jpg";
import shakeImg from "@assets/stock_images/protein_shake_with_b_433a5a18.jpg";
import wrapImg from "@assets/stock_images/healthy_turkey_wrap__9f571f63.jpg";
import barImg from "@assets/stock_images/protein_bar_and_almo_5da18025.jpg";
import hardBoiledImg from "@assets/stock_images/hard_boiled_eggs_ric_cea3b8d6.jpg";
import chickenImg from "@assets/stock_images/grilled_chicken_brea_2e1b9e35.jpg";
import fishImg from "@assets/stock_images/white_fish_quinoa_as_116aa808.jpg";
import pastaImg from "@assets/stock_images/chickpea_pasta_tomat_a3a4fccc.jpg";
import caseinImg from "@assets/stock_images/casein_protein_shake_b37068ad.jpg";
import cottageImg from "@assets/stock_images/cottage_cheese_almon_8569c9c4.jpg";
import teaImg from "@assets/stock_images/greek_yogurt_chamomi_2b4e6c38.jpg";

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
  value?: number;
  maxValue?: number;
}

export interface PilotProfile {
  height: number;
  weight: number;
  age: number;
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Active" | "Very Active";
  trainingFreq: number;
  goal: "Cut" | "Maintain" | "Performance";
  nextMedicalDate?: string; // YYYY-MM-DD
  restingHeartRate?: number;
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
  { id: "2", level: "info", message: "Hydration Status: Optimal", icon: "Droplets", value: 85, maxValue: 100 },
];

export const PLAN_PHASES = [
  {
    time: "04:30 - 05:30",
    phase: "Pre-Duty",
    guidance: "Examples: Eggs with oats and fruit, or Greek yogurt with honey and nuts. 500ml Water.",
    icon: "Coffee",
    macros: { protein: 30, carbs: 40, fat: 15 },
    foodEquivalents: [
      { name: "Eggs (3 whole) + Oats (50g dry) + Berries (1 cup)", image: oatmealImg },
      { name: "Greek Yogurt (200g) + Honey (1 tbsp) + Walnuts (30g)", image: yogurtImg },
      { name: "Protein Shake (1 scoop) + Banana + Peanut Butter (1 tbsp)", image: shakeImg }
    ]
  },
  {
    time: "05:30 - 11:00",
    phase: "Cruise / Duty",
    guidance: "Examples: Wraps, salads with lean protein, fruit, nuts, or protein bars. Light snacks every 2h. Avoid heavy fats.",
    icon: "Plane",
    macros: { protein: 20, carbs: 30, fat: 10 },
    foodEquivalents: [
        { name: "Turkey Wrap (1 whole wheat wrap + 100g turkey) + Apple (1 medium)", image: wrapImg },
        { name: "Protein Bar (low sugar, ~20g pro) + Almonds (15 nuts)", image: barImg },
        { name: "Hard Boiled Eggs (2 large) + Rice Cakes (2) + Hummus (2 tbsp)", image: hardBoiledImg }
    ]
  },
  {
    time: "11:00 - 12:00",
    phase: "Post-Duty",
    guidance: "Examples: Grilled chicken or fish with rice and vegetables, or turkey sandwich with vegetables. Recovery meal within 60min.",
    icon: "Utensils",
    macros: { protein: 40, carbs: 60, fat: 10 },
    foodEquivalents: [
        { name: "Chicken Breast (150g) + Rice (1 cup cooked) + Broccoli", image: chickenImg },
        { name: "White Fish (200g) + Quinoa (1 cup cooked) + Asparagus", image: fishImg },
        { name: "Chickpea Pasta (100g dry) + Tomato Sauce + Lean Beef Mince (100g)", image: pastaImg }
    ]
  },
  {
    time: "20:00",
    phase: "Recovery",
    guidance: "Examples: Chamomile tea, Magnesium support. No blue light.",
    icon: "Moon",
    macros: { protein: 20, carbs: 10, fat: 5 },
    foodEquivalents: [
        { name: "Casein Protein Shake (30g powder)", image: caseinImg },
        { name: "Cottage Cheese (150g) + 10 Almonds", image: cottageImg },
        { name: "Greek Yogurt (150g) + Chamomile Tea (0 cal)", image: teaImg }
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
