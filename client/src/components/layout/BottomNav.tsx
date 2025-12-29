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
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-2 mb-2 rounded-2xl overflow-hidden" style={{
        background: 'linear-gradient(180deg, hsl(222 18% 14%), hsl(222 18% 10%))',
        border: '1px solid hsl(222 18% 22%)',
        boxShadow: '0 -4px 24px hsla(0, 0%, 0%, 0.5), inset 0 1px 0 hsla(0, 0%, 100%, 0.03)'
      }}>
        <div className="flex justify-around items-stretch">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn("nav-button cursor-pointer min-w-[56px]", isActive && "active")}>
                  <item.icon
                    size={20}
                    className={cn(
                      "transition-all duration-300 relative z-10",
                      isActive 
                        ? "text-primary drop-shadow-[0_0_8px_hsla(142,76%,48%,0.6)]" 
                        : "text-muted-foreground"
                    )}
                  />
                  <span className={cn(
                    "text-[9px] font-mono tracking-[0.1em] uppercase relative z-10 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
