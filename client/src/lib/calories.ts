import type { UserProfile } from "@shared/schema";

export interface CalorieTargets {
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailyProgress {
  caloriesConsumed: number;
  caloriesRemaining: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  percentComplete: number;
}

export function calculateTDEE(profile: Partial<UserProfile>): number {
  const { height, weight, age, activityLevel } = profile;
  
  if (!height || !weight || !age) {
    return 2000;
  }

  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

  const activityMultipliers: Record<string, number> = {
    "Sedentary": 1.2,
    "Light": 1.375,
    "Moderate": 1.55,
    "Active": 1.725,
    "Very Active": 1.9,
  };

  const multiplier = activityMultipliers[activityLevel || "Moderate"] || 1.55;
  
  return Math.round(bmr * multiplier);
}

export function calculateCalorieTargets(profile: Partial<UserProfile>): CalorieTargets {
  const tdee = calculateTDEE(profile);
  const goal = profile.goal || "Maintain";

  let targetCalories: number;
  switch (goal) {
    case "Lose Fat":
    case "Cut":
      targetCalories = Math.round(tdee * 0.8);
      break;
    case "Build Muscle":
    case "Bulk":
    case "Performance":
      targetCalories = Math.round(tdee * 1.15);
      break;
    case "Maintain":
    default:
      targetCalories = tdee;
      break;
  }

  const proteinPerKg = goal === "Build Muscle" || goal === "Performance" ? 2.2 : 1.8;
  const protein = Math.round((profile.weight || 70) * proteinPerKg);
  const proteinCalories = protein * 4;

  const fatCalories = Math.round(targetCalories * 0.25);
  const fat = Math.round(fatCalories / 9);

  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

  return {
    tdee,
    targetCalories,
    protein,
    carbs,
    fat,
  };
}

export function calculateDailyProgress(
  targets: CalorieTargets,
  consumed: { calories: number; protein: number; carbs: number; fat: number }
): DailyProgress {
  const caloriesRemaining = Math.max(0, targets.targetCalories - consumed.calories);
  const percentComplete = Math.min(100, Math.round((consumed.calories / targets.targetCalories) * 100));

  return {
    caloriesConsumed: consumed.calories,
    caloriesRemaining,
    proteinConsumed: consumed.protein,
    carbsConsumed: consumed.carbs,
    fatConsumed: consumed.fat,
    percentComplete,
  };
}

export function formatCalories(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
}

export function getMacroColor(macro: "protein" | "carbs" | "fat"): string {
  switch (macro) {
    case "protein":
      return "hsl(195 100% 50%)";
    case "carbs":
      return "hsl(38 100% 50%)";
    case "fat":
      return "hsl(280 65% 60%)";
  }
}

export function getCalorieStatus(percentComplete: number): "normal" | "amber" | "warning" {
  if (percentComplete >= 100) return "warning";
  if (percentComplete >= 80) return "amber";
  return "normal";
}
