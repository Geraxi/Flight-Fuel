import { Link, useLocation } from "wouter";
import { LayoutDashboard, Map, ScanLine, FileText, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Deck" },
    { href: "/plan", icon: Map, label: "Plan" },
    { href: "/training", icon: Dumbbell, label: "Train" },
    { href: "/scan", icon: ScanLine, label: "Scan" },
    { href: "/log", icon: FileText, label: "Log" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-background/80 backdrop-blur-xl border-t border-border/50">
      <div className="flex justify-around items-stretch max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn("nav-button cursor-pointer min-w-[60px]", isActive && "active")}>
                <item.icon
                  size={22}
                  strokeWidth={2}
                  className={cn(
                    "transition-colors duration-200",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
