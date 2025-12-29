import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key - please add VITE_CLERK_PUBLISHABLE_KEY to your environment");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    signInFallbackRedirectUrl="/"
    signUpFallbackRedirectUrl="/"
    allowedRedirectOrigins={[
      window.location.origin,
      /https:\/\/.*\.replit\.dev/,
      /https:\/\/.*\.replit\.app/,
    ]}
  >
    <App />
  </ClerkProvider>
);
