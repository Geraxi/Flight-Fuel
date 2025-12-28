import { PLAN_PHASES } from "@/lib/mockData";
import { Coffee, Plane, Utensils, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  Coffee,
  Plane,
  Utensils,
  Moon
};

export default function Plan() {
  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Duty Timeline</h1>
        <p className="text-xs text-muted-foreground font-mono">PROFILE: LONG HAUL WESTBOUND</p>
      </header>

      <div className="relative border-l border-border ml-3 space-y-8 pl-8 py-2">
        {PLAN_PHASES.map((phase, index) => {
          const Icon = iconMap[phase.icon as keyof typeof iconMap] || Plane;
          
          return (
            <div key={index} className="relative">
              {/* Timeline Dot */}
              <div className={cn(
                "absolute -left-[41px] top-0 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center z-10",
                index === 1 ? "border-primary text-primary shadow-[0_0_10px_rgba(46,204,113,0.3)]" : "text-muted-foreground"
              )}>
                <Icon size={14} />
              </div>

              {/* Content Card */}
              <div className={cn(
                "cockpit-panel p-4 transition-all duration-300",
                index === 1 ? "border-primary/40 ring-1 ring-primary/20" : "opacity-80 hover:opacity-100"
              )}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    index === 1 ? "text-primary" : "text-foreground"
                  )}>
                    {phase.phase}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded">
                    {phase.time}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {phase.guidance}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
