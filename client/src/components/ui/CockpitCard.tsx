import { cn } from "@/lib/utils";
import React from "react";

interface CockpitCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  status?: "normal" | "amber" | "warning";
  children: React.ReactNode;
}

export function CockpitCard({ title, status = "normal", className, children, ...props }: CockpitCardProps) {
  return (
    <div 
      className={cn(
        "cockpit-panel flex flex-col", 
        status === "amber" && "border-secondary/50",
        className
      )} 
      {...props}
    >
      {title && (
        <div className="cockpit-header">
          <span className={cn(
            "cockpit-label",
            status === "amber" && "text-secondary"
          )}>
            {title}
          </span>
          {status !== "normal" && (
            <div className={cn(
              "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
              status === "amber" ? "bg-secondary text-secondary" : "bg-destructive text-destructive"
            )} />
          )}
        </div>
      )}
      <div className="p-4 flex-1">
        {children}
      </div>
      
      {/* Corner accents for tech feel */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-border opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-border opacity-50" />
    </div>
  );
}
