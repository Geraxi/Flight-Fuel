import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { 
  insertUserSchema, 
  insertFlightSchema,
  insertNutritionLogSchema,
  insertTrainingSessionSchema,
  insertUserProfileSchema,
  insertDailyChecklistSchema,
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const scryptAsync = promisify(scrypt);
const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  },
  compare: async (suppliedPassword: string, storedPassword: string) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(
      suppliedPassword,
      salt,
      64
    )) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  },
};

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup with PostgreSQL store
  const PgSession = connectPgSimple(session);
  
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "flightfuel-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport config
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const isValid = await crypto.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, { id: user.id, username: user.username });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, { id: user.id, username: user.username });
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/signup", async (req, res, next) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const { username, password } = result.data;
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await crypto.hash(password);
      const user = await storage.createUser({ username, password: hashedPassword });

      req.login({ id: user.id, username: user.username }, (err) => {
        if (err) return next(err);
        res.json({ id: user.id, username: user.username });
      });
    } catch (error: any) {
      next(error);
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Login failed" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // Profile routes
  app.get("/api/profile", requireAuth, async (req, res, next) => {
    try {
      const profile = await storage.getUserProfile(req.user!.id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/profile", requireAuth, async (req, res, next) => {
    try {
      const result = insertUserProfileSchema.safeParse({ ...req.body, userId: req.user!.id });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const existingProfile = await storage.getUserProfile(req.user!.id);
      if (existingProfile) {
        const updated = await storage.updateUserProfile(req.user!.id, result.data);
        return res.json(updated);
      }

      const profile = await storage.createUserProfile(result.data);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/profile", requireAuth, async (req, res, next) => {
    try {
      const profile = await storage.updateUserProfile(req.user!.id, req.body);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      next(error);
    }
  });

  // Flight routes
  app.get("/api/flights", requireAuth, async (req, res, next) => {
    try {
      const flights = await storage.getFlights(req.user!.id);
      res.json(flights);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/flights", requireAuth, async (req, res, next) => {
    try {
      const result = insertFlightSchema.safeParse({ ...req.body, userId: req.user!.id });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const flight = await storage.createFlight(result.data);
      res.json(flight);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/flights/:id", requireAuth, async (req, res, next) => {
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

  app.delete("/api/flights/:id", requireAuth, async (req, res, next) => {
    try {
      await storage.deleteFlight(req.params.id);
      res.json({ message: "Flight deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/flights/date/:date", requireAuth, async (req, res, next) => {
    try {
      await storage.deleteFlightsByDate(req.user!.id, req.params.date);
      res.json({ message: "Flights deleted for date" });
    } catch (error) {
      next(error);
    }
  });

  // Nutrition routes
  app.get("/api/nutrition", requireAuth, async (req, res, next) => {
    try {
      const { date } = req.query;
      if (date && typeof date === "string") {
        const logs = await storage.getNutritionLogsByDate(req.user!.id, date);
        return res.json(logs);
      }
      const logs = await storage.getNutritionLogs(req.user!.id);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/nutrition", requireAuth, async (req, res, next) => {
    try {
      const result = insertNutritionLogSchema.safeParse({ ...req.body, userId: req.user!.id });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const log = await storage.createNutritionLog(result.data);
      res.json(log);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/nutrition/:id", requireAuth, async (req, res, next) => {
    try {
      await storage.deleteNutritionLog(req.params.id);
      res.json({ message: "Nutrition log deleted" });
    } catch (error) {
      next(error);
    }
  });

  // Training routes
  app.get("/api/training", requireAuth, async (req, res, next) => {
    try {
      const { date } = req.query;
      if (date && typeof date === "string") {
        const sessions = await storage.getTrainingSessionsByDate(req.user!.id, date);
        return res.json(sessions);
      }
      const sessions = await storage.getTrainingSessions(req.user!.id);
      res.json(sessions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/training", requireAuth, async (req, res, next) => {
    try {
      const result = insertTrainingSessionSchema.safeParse({ ...req.body, userId: req.user!.id });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const session = await storage.createTrainingSession(result.data);
      res.json(session);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/training/:id", requireAuth, async (req, res, next) => {
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

  app.delete("/api/training/:id", requireAuth, async (req, res, next) => {
    try {
      await storage.deleteTrainingSession(req.params.id);
      res.json({ message: "Training session deleted" });
    } catch (error) {
      next(error);
    }
  });

  // Checklist routes
  app.get("/api/checklists/:date", requireAuth, async (req, res, next) => {
    try {
      const checklists = await storage.getDailyChecklists(req.user!.id, req.params.date);
      res.json(checklists);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/checklists", requireAuth, async (req, res, next) => {
    try {
      const result = insertDailyChecklistSchema.safeParse({ ...req.body, userId: req.user!.id });
      if (!result.success) {
        return res.status(400).json({ message: fromZodError(result.error).message });
      }

      const checklist = await storage.createDailyChecklist(result.data);
      res.json(checklist);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/checklists/:id", requireAuth, async (req, res, next) => {
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
