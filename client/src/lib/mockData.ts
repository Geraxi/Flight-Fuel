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
  { id: "3", label: "Supplements", status: "pending", value: "Caffeine 100mg" },
];

export const ADVISORIES: Advisory[] = [
  { id: "1", level: "amber", message: "Circadian Low: 1400-1600 LT" },
  { id: "2", level: "info", message: "Hydration Status: Optimal" },
];

export const PLAN_PHASES = [
  {
    time: "04:30 - 05:30",
    phase: "Pre-Duty",
    guidance: "Examples: Eggs with oats and fruit, or Greek yogurt with honey and nuts. 500ml Water.",
    icon: "Coffee",
  },
  {
    time: "05:30 - 11:00",
    phase: "Cruise / Duty",
    guidance: "Examples: Wraps, salads with lean protein, fruit, nuts, or protein bars. Light snacks every 2h. Avoid heavy fats.",
    icon: "Plane",
  },
  {
    time: "11:00 - 12:00",
    phase: "Post-Duty",
    guidance: "Examples: Grilled chicken or fish with rice and vegetables, or turkey sandwich with vegetables. Recovery meal within 60min.",
    icon: "Utensils",
  },
  {
    time: "20:00",
    phase: "Recovery",
    guidance: "Examples: Chamomile tea, Magnesium support. No blue light.",
    icon: "Moon",
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
