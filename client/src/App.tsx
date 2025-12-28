import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/layout/BottomNav";
import FlightDeck from "@/pages/FlightDeck";
import Plan from "@/pages/Plan";
import FuelScan from "@/pages/FuelScan";
import Log from "@/pages/Log";
import Profile from "@/pages/Profile";
import Training from "@/pages/Training";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="bg-background min-h-screen font-sans text-foreground">
      <main className="p-4 pb-24 max-w-md mx-auto min-h-screen relative overflow-hidden">
        {/* Background Texture/Noise could go here */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />
        
        <div className="relative z-10 h-full">
          <Switch>
            <Route path="/" component={FlightDeck} />
            <Route path="/plan" component={Plan} />
            <Route path="/training" component={Training} />
            <Route path="/scan" component={FuelScan} />
            <Route path="/log" component={Log} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <BottomNav />
    </div>
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
