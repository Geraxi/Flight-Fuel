import { LOG_DATA, DEFAULT_PROFILE, PilotProfile } from "@/lib/mockData";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Battery, Scale, Moon, Settings, Edit2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function Log() {
  const [profile, setProfile] = useState<PilotProfile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem("flightfuel_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleUpdate = (field: keyof PilotProfile, value: number) => {
    const newProfile = { ...profile, [field]: value };
    setProfile(newProfile);
    localStorage.setItem("flightfuel_profile", JSON.stringify(newProfile));
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Pilot Log</h1>
          <p className="text-xs text-muted-foreground font-mono">BIOMETRICS & STATUS MONITORING</p>
        </div>
        <Link href="/profile">
           <Button variant="outline" size="sm" className="h-8 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10">
             <Settings className="w-3 h-3 mr-2" /> SETUP PROFILE
           </Button>
        </Link>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <CockpitCard className="items-center justify-center py-4 gap-2 relative group cursor-pointer hover:border-primary/50 transition-colors">
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit2 className="w-3 h-3 text-muted-foreground" />
          </div>
          <Scale className="w-5 h-5 text-muted-foreground" />
          <div className="text-center w-full">
             <Input 
               type="number" 
               className="text-lg font-mono font-bold text-center border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-foreground w-full" 
               value={profile.weight}
               onChange={(e) => handleUpdate('weight', Number(e.target.value))}
             />
             <div className="text-[10px] text-muted-foreground uppercase">Kg</div>
          </div>
        </CockpitCard>
        
        <CockpitCard className="items-center justify-center py-4 gap-2">
          <Moon className="w-5 h-5 text-muted-foreground" />
          <div className="text-center">
             <div className="text-lg font-mono font-bold">7.5</div>
             <div className="text-[10px] text-muted-foreground uppercase">Hrs Sleep</div>
          </div>
        </CockpitCard>
        
        <CockpitCard className="items-center justify-center py-4 gap-2">
          <Battery className="w-5 h-5 text-primary" />
          <div className="text-center">
             <div className="text-lg font-mono font-bold text-primary">85%</div>
             <div className="text-[10px] text-muted-foreground uppercase">Energy</div>
          </div>
        </CockpitCard>
      </div>

      <div className="bg-muted/10 border border-border rounded-md p-4 flex flex-col gap-2">
        <h3 className="font-mono text-xs text-muted-foreground uppercase">Current Profile Configuration</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm font-medium">
           <div className="flex justify-between">
             <span>Goal:</span>
             <span className="text-primary font-mono">{profile.goal}</span>
           </div>
           <div className="flex justify-between">
             <span>Activity:</span>
             <span className="text-foreground font-mono">{profile.activityLevel}</span>
           </div>
           <div className="flex justify-between">
             <span>Height:</span>
             <span className="text-foreground font-mono">{profile.height}cm</span>
           </div>
        </div>
        <Link href="/profile">
          <Button variant="ghost" className="w-full mt-2 text-xs font-mono h-8 border border-dashed border-border hover:border-primary/50">
            UPDATE PARAMETERS
          </Button>
        </Link>
      </div>

      {/* Chart */}
      <CockpitCard title="Weight Trend (7 Days)" className="h-64">
        <div className="h-full w-full pt-4 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LOG_DATA}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 22%)" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="hsl(215, 15%, 60%)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                stroke="hsl(215, 15%, 60%)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 14%, 13%)', 
                  borderColor: 'hsl(220, 14%, 22%)',
                  borderRadius: '4px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }}
                itemStyle={{ color: 'hsl(142, 70%, 45%)' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(142, 70%, 45%)" 
                fillOpacity={1} 
                fill="url(#colorWeight)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CockpitCard>
    </div>
  );
}
