import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SignIn, SignUp, SignedIn, SignedOut, useClerk, RedirectToSignIn } from "@clerk/clerk-react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { PremiumProvider, usePremium } from "@/lib/premium";
import { setAuthTokenGetter } from "@/lib/api";
import { useEffect, useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import FlightDeck from "@/pages/FlightDeck";
import Plan from "@/pages/Plan";
import FuelScan from "@/pages/FuelScan";
import Log from "@/pages/Log";
import Profile from "@/pages/Profile";
import Training from "@/pages/Training";
import Progress from "@/pages/Progress";
import Upgrade from "@/pages/Upgrade";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  const { hasProfile, profileLoading, refetchProfile, getToken } = useAuth();
  const { isPremium } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  const handleOnboardingComplete = () => {
    refetchProfile();
    if (!isPremium) {
      setShowPaywall(true);
    }
  };

  // Redirect to upgrade page after onboarding for non-premium users
  useEffect(() => {
    if (showPaywall && !isPremium && hasProfile) {
      setShowPaywall(false);
      setLocation('/upgrade');
    }
  }, [showPaywall, isPremium, hasProfile, setLocation]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f35] to-[#0f1419] flex items-center justify-center">
        <div className="text-cyan-400">Loading profile...</div>
      </div>
    );
  }

  if (!hasProfile) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="bg-background min-h-screen font-sans text-foreground">
      <main className="p-4 pb-24 max-w-md mx-auto min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />
        
        <div className="relative z-10 h-full">
          <Switch>
            <Route path="/" component={FlightDeck} />
            <Route path="/plan" component={Plan} />
            <Route path="/training" component={Training} />
            <Route path="/scan" component={FuelScan} />
            <Route path="/log" component={Log} />
            <Route path="/progress" component={Progress} />
            <Route path="/profile" component={Profile} />
            <Route path="/upgrade" component={Upgrade} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

function Router() {
  const { loaded } = useClerk();

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f35] to-[#0f1419] flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 text-lg mb-2">FlightFuel</div>
          <div className="text-cyan-400/60 text-sm">Initializing...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f35] to-[#0f1419] flex items-center justify-center p-4">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-[#1a1f35] border border-cyan-500/20",
              }
            }}
          />
        </div>
      </SignedOut>
      <SignedIn>
        <AuthProvider>
          <PremiumProvider>
            <AuthenticatedApp />
          </PremiumProvider>
        </AuthProvider>
      </SignedIn>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
