import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { SignIn, SignUp, SignedIn, SignedOut, useClerk, RedirectToSignIn } from "@clerk/clerk-react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { setAuthTokenGetter } from "@/lib/api";
import { useEffect } from "react";
import BottomNav from "@/components/layout/BottomNav";
import FlightDeck from "@/pages/FlightDeck";
import Plan from "@/pages/Plan";
import FuelScan from "@/pages/FuelScan";
import Log from "@/pages/Log";
import Profile from "@/pages/Profile";
import Training from "@/pages/Training";
import Progress from "@/pages/Progress";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  const { hasProfile, profileLoading, refetchProfile, getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f35] to-[#0f1419] flex items-center justify-center">
        <div className="text-cyan-400">Loading profile...</div>
      </div>
    );
  }

  if (!hasProfile) {
    return <OnboardingPage onComplete={refetchProfile} />;
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
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <AuthProvider>
          <AuthenticatedApp />
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
