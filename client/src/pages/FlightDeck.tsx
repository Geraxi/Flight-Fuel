import { CockpitCard } from "@/components/ui/CockpitCard";
import { CURRENT_DUTY, CHECKLIST_ITEMS, ADVISORIES } from "@/lib/mockData";
import { Plane, AlertTriangle, CheckCircle2, Circle } from "lucide-react";

export default function FlightDeck() {
  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-foreground">FLIGHT DECK</h1>
          <p className="text-xs text-muted-foreground font-mono">SYS.READY // {new Date().toLocaleDateString()}</p>
        </div>
        <div className="h-8 w-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
          <Plane className="text-primary w-4 h-4" />
        </div>
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
          <div className="space-y-3">
            {ADVISORIES.map((adv) => (
              <div key={adv.id} className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span className="font-mono text-sm text-secondary-foreground">{adv.message}</span>
              </div>
            ))}
          </div>
        </CockpitCard>
      )}

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 gap-4">
        <h3 className="cockpit-label mt-2">PRE-FLIGHT CHECKLIST</h3>
        {CHECKLIST_ITEMS.map((item) => (
          <div 
            key={item.id}
            className="group flex items-center justify-between p-3 bg-card border border-border rounded-md hover:border-primary/50 transition-colors cursor-pointer"
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
    </div>
  );
}
