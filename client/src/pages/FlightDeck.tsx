import { CockpitCard } from "@/components/ui/CockpitCard";
import { CURRENT_DUTY, CHECKLIST_ITEMS, ADVISORIES, SUPPLEMENT_STACK } from "@/lib/mockData";
import { Plane, AlertTriangle, CheckCircle2, Circle, Settings, Pill, Clock, Droplets, Info, Zap, Heart, Shield, Brain, Dumbbell, Moon } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function FlightDeck() {
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === "complete" ? "pending" : "complete" }
        : item
    ));
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "Clock": return <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />;
      case "Droplets": return <Droplets className="w-4 h-4 text-secondary shrink-0 mt-0.5" />;
      default: return <AlertTriangle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />;
    }
  };

  const getSupplementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "performance": return <Zap className="w-4 h-4 text-yellow-400" />;
      case "health": return <Heart className="w-4 h-4 text-red-400" />;
      case "immunity": return <Shield className="w-4 h-4 text-blue-400" />;
      case "cognitive/power": return <Brain className="w-4 h-4 text-purple-400" />;
      case "recovery": return <Dumbbell className="w-4 h-4 text-orange-400" />;
      case "sleep support": return <Moon className="w-4 h-4 text-indigo-400" />;
      default: return <Pill className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-foreground">FLIGHT DECK</h1>
          <p className="text-xs text-muted-foreground font-mono">SYS.READY // {new Date().toLocaleDateString()}</p>
        </div>
        <Link href="/profile">
          <div className="h-8 w-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 hover:bg-primary/20 cursor-pointer transition-colors">
            <Settings className="text-primary w-4 h-4" />
          </div>
        </Link>
      </header>

      {/* Main Status Card */}
      <CockpitCard title="Today's Flight Plan" className="border-primary/30 shadow-[0_0_20px_rgba(46,204,113,0.1)]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="cockpit-label mb-1">Duty Start</div>
            <div className="text-2xl font-mono text-primary text-shadow-glow">
              {CURRENT_DUTY.dutyStart}
            </div>
          </div>
          <div>
            <div className="cockpit-label mb-1">Mode</div>
            <div className="text-xl font-mono text-foreground">
              {CURRENT_DUTY.mode.toUpperCase()}
            </div>
          </div>
          
          <div className="col-span-2 h-px bg-border/50 my-2" />
          
          <div className="flex justify-between items-center">
            <span className="cockpit-label">Conditions</span>
            <span className="font-mono text-sm text-secondary">{CURRENT_DUTY.conditions.toUpperCase()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="cockpit-label">Type</span>
            <span className="font-mono text-sm">{CURRENT_DUTY.dutyType.toUpperCase()}</span>
          </div>
        </div>
      </CockpitCard>

      {/* Advisories */}
      {ADVISORIES.length > 0 && (
        <CockpitCard title="Advisories" status="amber">
          <div className="space-y-4">
            {ADVISORIES.map((adv) => (
              <div key={adv.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  {getIcon(adv.icon)}
                  <div className="flex justify-between w-full items-center">
                     <span className="font-mono text-sm text-secondary">{adv.message}</span>
                     {adv.value !== undefined && (
                        <span className="font-mono text-xs text-secondary/70">{adv.value}%</span>
                     )}
                  </div>
                </div>
                {adv.value !== undefined && (
                   <div className="pl-7">
                      <Progress value={(adv.value / (adv.maxValue || 100)) * 100} className="h-1.5 bg-secondary/20 [&>div]:bg-secondary" />
                   </div>
                )}
              </div>
            ))}
          </div>
        </CockpitCard>
      )}

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="cockpit-label mt-2">PRE-FLIGHT CHECKLIST</h3>
        {checklist.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleChecklist(item.id)}
            className="group flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              {item.status === "complete" ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Supplement Protocol */}
      <CockpitCard title="Supplement Protocol">
        <div className="space-y-3">
          {SUPPLEMENT_STACK.map((supp) => (
            <div key={supp.id} className="flex items-center justify-between border-b border-border/50 last:border-0 pb-2 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                   {getSupplementIcon(supp.type)}
                </div>
                <div>
                  <div className="font-medium text-sm">{supp.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{supp.type.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-primary">{supp.dose}</div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase">{supp.timing}</div>
              </div>
            </div>
          ))}
        </div>
      </CockpitCard>
    </div>
  );
}
