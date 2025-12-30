import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { Capacitor } from "@capacitor/core";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key - please add VITE_CLERK_PUBLISHABLE_KEY to your environment");
}

// Initialize Capacitor
if (Capacitor.isNativePlatform()) {
  // Configure for native platform
  import("@capacitor/app").then(({ App: CapacitorApp }) => {
    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    signInFallbackRedirectUrl="/"
    signUpFallbackRedirectUrl="/"
    allowedRedirectOrigins={[
      window.location.origin,
      "capacitor://localhost",
      "ionic://localhost",
      "http://localhost",
      "http://localhost:5173",
      "http://localhost:5000",
      /https:\/\/.*\.replit\.dev/,
      /https:\/\/.*\.replit\.app/,
    ]}
  >
    <App />
  </ClerkProvider>
);
