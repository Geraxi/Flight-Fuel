# FlightFuel

## Overview

FlightFuel is a professional aviation-themed nutrition, hydration, and training decision-support tool for pilots. The app uses pilot language and checklist-style layouts, inspired by electronic flight bags (EFBs) and glass cockpits. It features a dark cockpit-style UI with avionics green and amber accents.

The application is a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data persistence. It includes user authentication via Clerk, subscription management via Stripe, and a comprehensive pilot profile system for personalized nutrition and training recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with custom aviation-themed design tokens
- **UI Components**: shadcn/ui (Radix primitives) with custom CockpitCard component
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based structure under `client/src/pages/` with five main screens:
- FlightDeck (home dashboard)
- Plan (duty timeline and flight scheduling)
- Training (workout generator and logging)
- FuelScan (camera-based meal scanning)
- Log (health metrics tracking)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Clerk Express SDK with JWT-based auth
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix

The server uses a modular structure:
- `server/routes.ts` - API route definitions with Clerk auth middleware
- `server/storage.ts` - Data access layer with typed methods
- `server/db.ts` - Database connection pool

### Authentication Flow
- Clerk handles all authentication (sign-in, sign-up, session management)
- Frontend uses `@clerk/clerk-react` with ClerkProvider
- Backend uses `@clerk/express` middleware for route protection
- Custom `AuthProvider` context manages profile loading and token management

### Data Model
Key entities in `shared/schema.ts`:
- **users**: Core user records with Stripe integration fields
- **userProfiles**: Detailed pilot profiles (biometrics, dietary preferences, training settings)
- **flights**: Flight schedules with origin/destination and times
- **nutritionLogs**: Meal tracking with calorie/macro estimates
- **trainingSessions**: Workout logging
- **dailyChecklists**: Daily health check-ins

### Premium/Subscription System
- Stripe integration for subscription billing
- `stripe-replit-sync` package for webhook handling and data sync
- Premium features gated via `PremiumGate` component and `usePremium` hook
- Features: AI meal scanning, training videos, advanced analytics

## External Dependencies

### Authentication
- **Clerk**: Full authentication solution (sign-in, sign-up, session management)
  - Environment: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

### Database
- **PostgreSQL**: Primary data store via Neon/Replit Postgres
  - Environment: `DATABASE_URL`
- **Drizzle ORM**: Type-safe database queries and migrations
  - Migrations stored in `./migrations/`
  - Schema push via `npm run db:push`

### Payments
- **Stripe**: Subscription billing and customer portal
  - Uses Replit Connectors for credentials
  - Webhook handling via `stripe-replit-sync`
  - Products seeded via `scripts/seed-products.ts`

### UI Dependencies
- **Radix UI**: Accessible component primitives (20+ components)
- **Recharts**: Chart components for analytics
- **date-fns**: Date manipulation
- **Lucide React**: Icon library

### Development
- **Vite**: Frontend build and dev server
- **esbuild**: Server bundling for production
- **TypeScript**: Full type coverage across client/server/shared