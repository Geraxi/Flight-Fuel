import { cn } from "@/lib/utils";
import React from "react";
import { Plane, QrCode } from "lucide-react";

interface BoardingPassProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  date?: string;
  status?: "normal" | "amber" | "warning";
  headerColor?: string;
  icon?: React.ElementType;
}

export function BoardingPass({ 
  title, 
  subtitle,
  date,
  status = "normal", 
  className, 
  children, 
  headerColor = "bg-primary",
  icon: Icon = Plane,
  ...props 
}: BoardingPassProps) {
  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden bg-card rounded-2xl border-0 shadow-lg group", 
        className
      )} 
      {...props}
    >
      {/* Top Section (Main Ticket) */}
      <div className="relative bg-card p-0">
        
        {/* Header Strip */}
        <div className={cn("h-2 w-full", headerColor)} />
        
        {/* Main Content Area */}
        <div className="p-5 pb-8">
            {/* Header Info */}
            <div className="flex justify-between items-start mb-6 border-b border-border/40 pb-4 border-dashed">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full bg-muted/20 text-foreground", status === 'amber' && "text-amber-500 bg-amber-500/10")}>
                        <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">{subtitle || "FLIGHT BRIEF"}</h3>
                        <div className="text-lg font-bold tracking-tight uppercase">{title}</div>
                    </div>
                </div>
                {date && (
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-muted-foreground uppercase">DATE</div>
                        <div className="text-sm font-mono font-bold">{date}</div>
                    </div>
                )}
            </div>

            {/* Dynamic Children Content */}
            <div className="space-y-4">
                {children}
            </div>
        </div>

        {/* Decorative Notches for Tear-off effect */}
        <div className="absolute bottom-16 left-0 transform -translate-x-1/2 w-6 h-6 bg-background rounded-full border-r border-border/10 shadow-[inset_-2px_0_5px_rgba(0,0,0,0.05)]" />
        <div className="absolute bottom-16 right-0 transform translate-x-1/2 w-6 h-6 bg-background rounded-full border-l border-border/10 shadow-[inset_2px_0_5px_rgba(0,0,0,0.05)]" />
        
        {/* Dashed Tear Line */}
        <div className="absolute bottom-[4.2rem] left-4 right-4 border-b-2 border-dashed border-muted-foreground/20" />
      </div>

      {/* Bottom Section (Stub) */}
      <div className="bg-muted/30 p-4 pt-6 flex justify-between items-center relative">
         <div className="flex flex-col">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest mb-1">BOARDING GROUP</span>
            <span className="text-xl font-bold font-mono">PRIORITY</span>
         </div>
         
         {/* Fake Barcode */}
         <div className="flex items-center gap-3 opacity-60">
            <div className="flex flex-col items-end gap-0.5">
                 <div className="h-8 w-px bg-foreground/80 inline-block mx-[1px]"></div>
                 <div className="h-8 w-[2px] bg-foreground/80 inline-block mx-[1px]"></div>
                 <div className="h-8 w-px bg-foreground/80 inline-block mx-[1px]"></div>
                 <div className="h-8 w-[3px] bg-foreground/80 inline-block mx-[1px]"></div>
                 <div className="h-8 w-px bg-foreground/80 inline-block mx-[1px]"></div>
                 <div className="h-8 w-[2px] bg-foreground/80 inline-block mx-[1px]"></div>
            </div>
            <QrCode className="w-8 h-8 text-foreground/80" />
         </div>
      </div>
    </div>
  );
}
