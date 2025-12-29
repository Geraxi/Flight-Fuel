import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { clerkMiddleware, getAuth, requireAuth } from "@clerk/express";
import { 
  insertFlightSchema,
  insertNutritionLogSchema,
  insertTrainingSessionSchema,
  insertUserProfileSchema,
  insertDailyChecklistSchema,
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Apply Clerk middleware globally
  app.use(clerkMiddleware());

  // Helper to get user ID from Clerk auth
  const getUserId = (req: any): string | null => {
    const auth = getAuth(req);
    return auth?.userId || null;
  };

  // Profile routes
  app.get("/api/profile", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/profile", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Ensure user exists in our database before creating profile
      await storage.ensureUserExists(userId);

      const result = insertUserProfileSchema.safeParse({ ...req.body, userId });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const existingProfile = await storage.getUserProfile(userId);
      if (existingProfile) {
        const updated = await storage.updateUserProfile(userId, result.data);
        return res.json(updated);
      }

      const profile = await storage.createUserProfile(result.data);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/profile", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const profile = await storage.updateUserProfile(userId, req.body);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  // Flight routes
  app.get("/api/flights", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const flights = await storage.getFlights(userId);
      res.json(flights);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/flights", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = insertFlightSchema.safeParse({ ...req.body, userId });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const flight = await storage.createFlight(result.data);
      res.json(flight);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/flights/:id", requireAuth(), async (req, res, next) => {
    try {
      const flight = await storage.updateFlight(req.params.id, req.body);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      res.json(flight);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/flights/:id", requireAuth(), async (req, res, next) => {
    try {
      await storage.deleteFlight(req.params.id);
      res.json({ message: "Flight deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/flights/date/:date", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await storage.deleteFlightsByDate(userId, req.params.date);
      res.json({ message: "Flights deleted for date" });
    } catch (error) {
      next(error);
    }
  });

  // Nutrition routes
  app.get("/api/nutrition", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { date } = req.query;
      if (date && typeof date === "string") {
        const logs = await storage.getNutritionLogsByDate(userId, date);
        return res.json(logs);
      }
      const logs = await storage.getNutritionLogs(userId);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/nutrition", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = insertNutritionLogSchema.safeParse({ ...req.body, userId });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const log = await storage.createNutritionLog(result.data);
      res.json(log);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/nutrition/:id", requireAuth(), async (req, res, next) => {
    try {
      await storage.deleteNutritionLog(req.params.id);
      res.json({ message: "Nutrition log deleted" });
    } catch (error) {
      next(error);
    }
  });

  // Training routes
  app.get("/api/training", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { date } = req.query;
      if (date && typeof date === "string") {
        const sessions = await storage.getTrainingSessionsByDate(userId, date);
        return res.json(sessions);
      }
      const sessions = await storage.getTrainingSessions(userId);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/training", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = insertTrainingSessionSchema.safeParse({ ...req.body, userId });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const session = await storage.createTrainingSession(result.data);
      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/training/:id", requireAuth(), async (req, res, next) => {
    try {
      const session = await storage.updateTrainingSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ message: "Training session not found" });
      }
      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/training/:id", requireAuth(), async (req, res, next) => {
    try {
      await storage.deleteTrainingSession(req.params.id);
      res.json({ message: "Training session deleted" });
    } catch (error) {
      next(error);
    }
  });

  // Checklist routes
  app.get("/api/checklists/:date", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const checklists = await storage.getDailyChecklists(userId, req.params.date);
      res.json(checklists);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checklists", requireAuth(), async (req, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = insertDailyChecklistSchema.safeParse({ ...req.body, userId });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const checklist = await storage.createDailyChecklist(result.data);
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/checklists/:id", requireAuth(), async (req, res, next) => {
    try {
      const { status, value } = req.body;
      const checklist = await storage.updateDailyChecklist(req.params.id, status, value);
      if (!checklist) {
        return res.status(404).json({ message: "Checklist item not found" });
      }
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
