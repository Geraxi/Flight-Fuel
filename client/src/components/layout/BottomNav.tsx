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
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 w-12 cursor-pointer transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-all duration-300",
                    isActive && "drop-shadow-[0_0_8px_hsla(142,70%,45%,0.5)]"
                  )}
                />
                <span className="text-[9px] font-mono tracking-wider uppercase">
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
