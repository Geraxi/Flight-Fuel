import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User profiles table
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  height: integer("height").notNull(), // in cm
  weight: integer("weight").notNull(), // in kg
  age: integer("age").notNull(),
  activityLevel: text("activity_level").notNull(), // Sedentary, Light, Moderate, Active, Very Active
  trainingFreq: integer("training_freq").notNull(), // sessions per week
  goal: text("goal").notNull(), // Cut, Maintain, Performance
  nextMedicalDate: date("next_medical_date"),
  restingHeartRate: integer("resting_heart_rate"),
  // Dietary preferences
  dietType: text("diet_type"), // Omnivore, Vegetarian, Vegan, Pescatarian, Keto, Paleo
  allergies: text("allergies").array(), // Array of allergies: gluten, dairy, nuts, shellfish, eggs, soy
  foodRestrictions: text("food_restrictions"), // Other restrictions/notes
  // Training preferences
  trainingLocation: text("training_location"), // Gym, Home, Outdoors, Hotel
  trainingStyle: text("training_style"), // Weights, Calisthenics, Cardio, Mixed
  equipmentAccess: text("equipment_access").array(), // Array: dumbbells, barbell, bands, bodyweight
  // Health concerns
  healthConditions: text("health_conditions"), // Any medical conditions to consider
  injuries: text("injuries"), // Current/past injuries
  sleepQuality: text("sleep_quality"), // Poor, Fair, Good, Excellent
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
});

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

// Flights table
export const flights = pgTable("flights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  flightNumber: text("flight_number"),
  departureTime: text("departure_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  isDuty: boolean("is_duty").notNull().default(true),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;

// Nutrition logs table
export const nutritionLogs = pgTable("nutrition_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  mealTime: text("meal_time").notNull(), // e.g., "04:30 - 05:30"
  mealPhase: text("meal_phase").notNull(), // Pre-Duty, Cruise/Duty, Post-Duty, Recovery
  mealName: text("meal_name").notNull(),
  imageUrl: text("image_url"),
  protein: integer("protein").notNull(), // in grams
  carbs: integer("carbs").notNull(), // in grams
  fat: integer("fat").notNull(), // in grams
  calories: integer("calories").notNull(),
});

export const insertNutritionLogSchema = createInsertSchema(nutritionLogs).omit({
  id: true,
});

export type InsertNutritionLog = z.infer<typeof insertNutritionLogSchema>;
export type NutritionLog = typeof nutritionLogs.$inferSelect;

// Training sessions table
export const trainingSessions = pgTable("training_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  sessionType: text("session_type").notNull(), // Strength, Cardio, Mobility, Recovery
  exercises: jsonb("exercises").notNull(), // Array of exercise objects
  duration: integer("duration").notNull(), // in minutes
  notes: text("notes"),
});

export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true,
});

export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type TrainingSession = typeof trainingSessions.$inferSelect;

// Daily checklists table
export const dailyChecklists = pgTable("daily_checklists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  itemId: text("item_id").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull(), // pending, complete, alert
  value: text("value"),
});

export const insertDailyChecklistSchema = createInsertSchema(dailyChecklists).omit({
  id: true,
});

export type InsertDailyChecklist = z.infer<typeof insertDailyChecklistSchema>;
export type DailyChecklist = typeof dailyChecklists.$inferSelect;
