// Referenced from blueprint:javascript_database
import { 
  users, 
  userProfiles,
  flights,
  nutritionLogs,
  trainingSessions,
  dailyChecklists,
  type User, 
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Flight,
  type InsertFlight,
  type NutritionLog,
  type InsertNutritionLog,
  type TrainingSession,
  type InsertTrainingSession,
  type DailyChecklist,
  type InsertDailyChecklist,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  ensureUserExists(clerkUserId: string): Promise<User>;

  // Profile methods
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;

  // Flight methods
  getFlights(userId: string): Promise<Flight[]>;
  getFlightsByDateRange(userId: string, startDate: string, endDate: string): Promise<Flight[]>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  updateFlight(id: string, flight: Partial<InsertFlight>): Promise<Flight | undefined>;
  deleteFlight(id: string): Promise<void>;
  deleteFlightsByDate(userId: string, date: string): Promise<void>;

  // Nutrition methods
  getNutritionLogs(userId: string): Promise<NutritionLog[]>;
  getNutritionLogsByDate(userId: string, date: string): Promise<NutritionLog[]>;
  createNutritionLog(log: InsertNutritionLog): Promise<NutritionLog>;
  deleteNutritionLog(id: string): Promise<void>;

  // Training methods
  getTrainingSessions(userId: string): Promise<TrainingSession[]>;
  getTrainingSessionsByDate(userId: string, date: string): Promise<TrainingSession[]>;
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;
  updateTrainingSession(id: string, session: Partial<InsertTrainingSession>): Promise<TrainingSession | undefined>;
  deleteTrainingSession(id: string): Promise<void>;

  // Checklist methods
  getDailyChecklists(userId: string, date: string): Promise<DailyChecklist[]>;
  createDailyChecklist(checklist: InsertDailyChecklist): Promise<DailyChecklist>;
  updateDailyChecklist(id: string, status: string, value?: string): Promise<DailyChecklist | undefined>;
  deleteDailyChecklists(userId: string, date: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async ensureUserExists(clerkUserId: string): Promise<User> {
    const existingUser = await this.getUser(clerkUserId);
    if (existingUser) {
      return existingUser;
    }
    const [user] = await db
      .insert(users)
      .values({ id: clerkUserId, username: clerkUserId, password: "clerk-managed" })
      .returning();
    return user;
  }

  // Profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [updated] = await db
      .update(userProfiles)
      .set(profile)
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated || undefined;
  }

  // Flight methods
  async getFlights(userId: string): Promise<Flight[]> {
    return await db.select().from(flights).where(eq(flights.userId, userId)).orderBy(desc(flights.date));
  }

  async getFlightsByDateRange(userId: string, startDate: string, endDate: string): Promise<Flight[]> {
    return await db.select().from(flights).where(
      and(
        eq(flights.userId, userId),
        // Note: We'll need to add range filtering in the route layer or use sql`` for date comparisons
      )
    ).orderBy(flights.date);
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    const [newFlight] = await db
      .insert(flights)
      .values(flight)
      .returning();
    return newFlight;
  }

  async updateFlight(id: string, flight: Partial<InsertFlight>): Promise<Flight | undefined> {
    const [updated] = await db
      .update(flights)
      .set(flight)
      .where(eq(flights.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteFlight(id: string): Promise<void> {
    await db.delete(flights).where(eq(flights.id, id));
  }

  async deleteFlightsByDate(userId: string, date: string): Promise<void> {
    await db.delete(flights).where(and(eq(flights.userId, userId), eq(flights.date, date)));
  }

  // Nutrition methods
  async getNutritionLogs(userId: string): Promise<NutritionLog[]> {
    return await db.select().from(nutritionLogs).where(eq(nutritionLogs.userId, userId)).orderBy(desc(nutritionLogs.date));
  }

  async getNutritionLogsByDate(userId: string, date: string): Promise<NutritionLog[]> {
    return await db.select().from(nutritionLogs).where(
      and(eq(nutritionLogs.userId, userId), eq(nutritionLogs.date, date))
    );
  }

  async createNutritionLog(log: InsertNutritionLog): Promise<NutritionLog> {
    const [newLog] = await db
      .insert(nutritionLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async deleteNutritionLog(id: string): Promise<void> {
    await db.delete(nutritionLogs).where(eq(nutritionLogs.id, id));
  }

  // Training methods
  async getTrainingSessions(userId: string): Promise<TrainingSession[]> {
    return await db.select().from(trainingSessions).where(eq(trainingSessions.userId, userId)).orderBy(desc(trainingSessions.date));
  }

  async getTrainingSessionsByDate(userId: string, date: string): Promise<TrainingSession[]> {
    return await db.select().from(trainingSessions).where(
      and(eq(trainingSessions.userId, userId), eq(trainingSessions.date, date))
    );
  }

  async createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession> {
    const [newSession] = await db
      .insert(trainingSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateTrainingSession(id: string, session: Partial<InsertTrainingSession>): Promise<TrainingSession | undefined> {
    const [updated] = await db
      .update(trainingSessions)
      .set(session)
      .where(eq(trainingSessions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTrainingSession(id: string): Promise<void> {
    await db.delete(trainingSessions).where(eq(trainingSessions.id, id));
  }

  // Checklist methods
  async getDailyChecklists(userId: string, date: string): Promise<DailyChecklist[]> {
    return await db.select().from(dailyChecklists).where(
      and(eq(dailyChecklists.userId, userId), eq(dailyChecklists.date, date))
    );
  }

  async createDailyChecklist(checklist: InsertDailyChecklist): Promise<DailyChecklist> {
    const [newChecklist] = await db
      .insert(dailyChecklists)
      .values(checklist)
      .returning();
    return newChecklist;
  }

  async updateDailyChecklist(id: string, status: string, value?: string): Promise<DailyChecklist | undefined> {
    const [updated] = await db
      .update(dailyChecklists)
      .set({ status, value })
      .where(eq(dailyChecklists.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteDailyChecklists(userId: string, date: string): Promise<void> {
    await db.delete(dailyChecklists).where(
      and(eq(dailyChecklists.userId, userId), eq(dailyChecklists.date, date))
    );
  }
}

export const storage = new DatabaseStorage();
