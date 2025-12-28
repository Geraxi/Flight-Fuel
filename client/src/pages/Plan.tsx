import { PLAN_PHASES } from "@/lib/mockData";
import { Coffee, Plane, Utensils, Moon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const iconMap = {
  Coffee,
  Plane,
  Utensils,
  Moon
};

export default function Plan() {
  const [mealVariations, setMealVariations] = useState<Record<number, number>>({});

  const toggleVariation = (index: number, max: number) => {
    setMealVariations(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) + 1) % max
    }));
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Duty Timeline</h1>
        <p className="text-xs text-muted-foreground font-mono">PROFILE: LONG HAUL WESTBOUND</p>
      </header>

      <div className="relative border-l border-border ml-3 space-y-8 pl-8 py-2">
        {PLAN_PHASES.map((phase, index) => {
          const Icon = iconMap[phase.icon as keyof typeof iconMap] || Plane;
          const currentVariation = mealVariations[index] || 0;
          const variationCount = phase.foodEquivalents?.length || 1;
          
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
                "cockpit-panel p-4 transition-all duration-300 group",
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
                
                {/* Targets */}
                {phase.macros && (
                   <div className="flex gap-2 mb-3">
                      <div className="bg-muted/30 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground">
                        PRO: <span className="text-foreground">{phase.macros.protein}g</span>
                      </div>
                      <div className="bg-muted/30 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground">
                        CHO: <span className="text-foreground">{phase.macros.carbs}g</span>
                      </div>
                      <div className="bg-muted/30 px-2 py-1 rounded text-[10px] font-mono text-muted-foreground">
                        FAT: <span className="text-foreground">{phase.macros.fat}g</span>
                      </div>
                   </div>
                )}

                <div className="relative">
                  <p className="text-sm text-foreground leading-relaxed font-medium mb-1">
                    {phase.foodEquivalents ? phase.foodEquivalents[currentVariation] : phase.guidance}
                  </p>
                  
                   {/* Swap Control */}
                   {variationCount > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleVariation(index, variationCount)}
                      className="h-6 px-2 text-[10px] font-mono text-primary hover:text-primary hover:bg-primary/10 mt-2"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      SWAP OPTION ({currentVariation + 1}/{variationCount})
                    </Button>
                   )}
                   
                   <p className="text-xs text-muted-foreground mt-2 italic border-t border-border/50 pt-2">
                     *Swap based on preference/tolerance. All amounts are estimates.
                   </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
