import { cn } from "@/lib/utils";
import React from "react";

interface CockpitCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  status?: "normal" | "amber" | "warning" | "cyan";
  variant?: "default" | "instrument" | "pfd";
  children: React.ReactNode;
}

export function CockpitCard({ 
  title, 
  status = "normal", 
  variant = "default",
  className, 
  children, 
  ...props 
}: CockpitCardProps) {
  const panelClass = variant === "instrument" 
    ? "instrument-bezel" 
    : variant === "pfd" 
    ? "pfd-display" 
    : "cockpit-panel";

  return (
    <div 
      className={cn(
        panelClass,
        "flex flex-col", 
        className
      )} 
      {...props}
    >
      {title && (
        <div className="cockpit-header">
          <span className="cockpit-label">
            {title}
          </span>
        </div>
      )}
      <div className="p-5 flex-1">
        {children}
      </div>
    </div>
  );
}

export function InstrumentDisplay({ 
  label, 
  value, 
  unit,
  status = "normal",
  size = "default",
  className 
}: { 
  label: string; 
  value: string | number; 
  unit?: string;
  status?: "normal" | "amber" | "warning";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-lg",
    default: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="cockpit-label">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          sizeClasses[size],
          status === "normal" && "lcd-text",
          status === "amber" && "lcd-text-amber",
          status === "warning" && "text-destructive font-mono font-bold"
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground font-mono uppercase">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function Annunciator({
  children,
  status = "normal",
  className
}: {
  children: React.ReactNode;
  status?: "normal" | "green" | "amber" | "red" | "cyan";
  className?: string;
}) {
  return (
    <span className={cn(
      "annunciator",
      status !== "normal" && status,
      className
    )}>
      {children}
    </span>
  );
}

export function GaugeRing({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  status = "normal",
  label,
  className
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  status?: "normal" | "amber" | "warning";
  label?: string;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const strokeDashoffset = circumference - (percent * circumference);

  const strokeColor = 
    status === "warning" ? "hsl(0 80% 55%)" :
    status === "amber" ? "hsl(38 100% 50%)" :
    "hsl(142 76% 48%)";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="gauge-ring"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="gauge-fill transition-all duration-500"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ color: strokeColor }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn(
          "font-mono font-bold text-sm",
          status === "normal" && "lcd-text",
          status === "amber" && "lcd-text-amber",
          status === "warning" && "text-destructive"
        )}>
          {Math.round(percent * 100)}%
        </span>
        {label && (
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
