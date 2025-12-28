import { LOG_DATA, DEFAULT_PROFILE, PilotProfile } from "@/lib/mockData";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Battery, Scale, Moon, Settings, Edit2, Zap, Utensils, Activity, Radio, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

function SimpleSlider({ value, onValueChange, max, className, trackColor = "bg-primary" }: any) {
  const val = value[0];
  const percentage = Math.min(100, Math.max(0, (val / max) * 100));
  
  return (
    <div className={`relative flex items-center select-none touch-none w-full h-8 ${className}`}>
      {/* Track Background with Segments */}
      <div className={`absolute w-full h-2 ${trackColor}/10 rounded-sm overflow-hidden flex gap-[2px]`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 bg-current opacity-20" />
        ))}
      </div>
      
      {/* Active Track */}
      <div className="absolute w-full h-2 rounded-sm overflow-hidden flex gap-[2px] pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => {
           const isActive = (i + 1) * 5 <= percentage;
           return (
             <div 
               key={i} 
               className={`flex-1 transition-all duration-100 ${isActive ? trackColor : 'bg-transparent'} ${isActive ? 'opacity-100' : 'opacity-0'}`} 
             />
           )
        })}
      </div>

      <input 
        type="range" 
        min={0} 
        max={max} 
        step={5}
        value={val} 
        onChange={(e) => onValueChange([Number(e.target.value)])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Thumb Indicator */}
      <div 
        className={`absolute h-4 w-1 bg-foreground shadow-[0_0_10px_currentColor] pointer-events-none transition-all duration-100 ease-out z-20`}
        style={{ left: `calc(${percentage}% - 2px)` }}
      />
    </div>
  )
}

function StatusIndicator({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`w-2 h-2 rounded-full mb-1 transition-all duration-500 ${active ? 'bg-primary shadow-[0_0_8px_#2ecc71]' : 'bg-muted-foreground/30'}`} />
      <span className={`text-[8px] font-mono tracking-widest ${active ? 'text-primary' : 'text-muted-foreground/50'}`}>{label}</span>
    </div>
  )
}

function getAdvice(energy: number, hunger: number, mood: number, sleep: number) {
  const alerts = [];
  
  if (energy < 40) {
    alerts.push({
      type: "warning",
      title: "Energy Critical",
      msg: "Caffeine + Hydration recommended immediately. Consider 20min power nap if duty permits."
    });
  } else if (energy < 60) {
    alerts.push({
      type: "advisory",
      title: "Energy Low",
      msg: "Prepare simple carbs + hydration. Monitor alertness."
    });
  }

  if (hunger > 70) {
    alerts.push({
      type: "warning",
      title: "Hunger High",
      msg: "Glycogen depletion risk. Consume complex carbs + protein (e.g. Wrap/Sandwich) now."
    });
  }

  if (mood < 3) {
     alerts.push({
      type: "advisory",
      title: "Fatigue Risk",
      msg: "Cognitive performance may be degraded. Verify checklists twice. Seek sunlight/bright light."
    });
  }

  if (sleep < 6) {
    alerts.push({
      type: "warning",
      title: "Sleep Debt Critical",
      msg: "Reaction times impacted. Limit complex tasks. Prioritize recovery sleep tonight."
    });
  } else if (sleep > 9.5) {
    alerts.push({
      type: "advisory",
      title: "Sleep Inertia Risk",
      msg: "Extended sleep duration detected. Engage in light exercise to activate CNS."
    });
  }

  if (energy >= 80 && hunger < 40 && mood >= 4 && sleep >= 7 && sleep <= 9) {
    return (
      <div className="bg-primary/10 border border-primary/30 p-3 rounded-2xl flex items-start gap-3">
        <div className="bg-primary/20 p-1.5 rounded-full mt-0.5">
           <Activity className="w-4 h-4 text-primary" />
        </div>
        <div>
           <div className="text-primary font-mono text-xs font-bold uppercase mb-1">Status Optimal</div>
           <div className="text-xs text-muted-foreground"> physiological parameters within ideal range. Maintain current hydration and fueling strategy.</div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => (
        <div key={i} className={`p-3 rounded-2xl border flex items-start gap-3 ${
          alert.type === "warning" 
            ? "bg-destructive/10 border-destructive/30" 
            : "bg-secondary/10 border-secondary/30"
        }`}>
           <div className={`p-1.5 rounded-full mt-0.5 ${
             alert.type === "warning" ? "bg-destructive/20" : "bg-secondary/20"
           }`}>
              <AlertTriangle className={`w-4 h-4 ${
                alert.type === "warning" ? "text-destructive" : "text-secondary"
              }`} />
           </div>
           <div>
              <div className={`font-mono text-xs font-bold uppercase mb-1 ${
                alert.type === "warning" ? "text-destructive" : "text-secondary"
              }`}>
                {alert.title}
              </div>
              <div className="text-xs text-muted-foreground">{alert.msg}</div>
           </div>
        </div>
      ))}
    </div>
  );
}

export default function Log() {
  const [profile, setProfile] = useState<PilotProfile>(DEFAULT_PROFILE);
  const [dailyStats, setDailyStats] = useState({
    energy: 85,
    hunger: 50,
    mood: 3, // 1-5 scale
    sleep: 7.5
  });
  
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
      <header className="mb-4 flex justify-between items-end border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-widest">LIVE DATA LINK</span>
          </div>
          <h1 className="text-2xl font-bold tracking-widest text-foreground uppercase">Pilot Log</h1>
        </div>
        
        <div className="flex gap-4">
          <StatusIndicator label="SYNC" active />
          <StatusIndicator label="REC" active />
          <StatusIndicator label="GPS" />
        </div>
      </header>
      
      <div className="flex justify-end mb-4">
         <div className="flex gap-2">
            <Link href="/progress">
               <Button variant="outline" size="sm" className="h-7 font-mono text-[10px] border-secondary/30 text-secondary hover:bg-secondary/10 uppercase tracking-wider">
                 <Settings className="w-3 h-3 mr-2" /> Visual Analysis
               </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="h-7 font-mono text-[10px] border-primary/30 text-primary hover:bg-primary/10 uppercase tracking-wider">
                <Settings className="w-3 h-3 mr-2" /> Sys Config
              </Button>
           </Link>
         </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Weight Panel */}
        <div className="bg-card border border-border rounded-2xl relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
          <div className="p-3 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <Scale className="w-3 h-3 text-muted-foreground" />
              <div className="text-[8px] font-mono text-muted-foreground uppercase">WGT.LOAD</div>
            </div>
            <div className="relative">
              <Input 
                 type="number" 
                 className="text-xl font-mono font-bold text-center border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-foreground w-full" 
                 value={profile.weight}
                 onChange={(e) => handleUpdate('weight', Number(e.target.value))}
               />
               <div className="absolute top-0 right-0 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="w-2 h-2 text-primary" />
               </div>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">KG</div>
          </div>
        </div>
        
        {/* Sleep Panel */}
        <div className="bg-card border border-border rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
          <div className="p-3 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <Moon className="w-3 h-3 text-muted-foreground" />
              <div className="text-[8px] font-mono text-muted-foreground uppercase">REST.CYC</div>
            </div>
            <div className="relative w-full">
              <Input 
                 type="number" 
                 className="text-xl font-mono font-bold text-center border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-foreground w-full" 
                 value={dailyStats.sleep}
                 onChange={(e) => setDailyStats({...dailyStats, sleep: Number(e.target.value)})}
                 step={0.5}
               />
               <div className="absolute top-0 right-0 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="w-2 h-2 text-primary" />
               </div>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">HRS</div>
          </div>
        </div>
        
        {/* Energy Panel */}
        <div className="bg-card border border-border rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="p-3 flex flex-col items-center">
             <div className="flex items-center justify-between w-full mb-2">
              <Battery className="w-3 h-3 text-primary" />
              <div className="text-[8px] font-mono text-primary uppercase">PWR.LVL</div>
            </div>
             <div className="text-xl font-mono font-bold text-primary text-shadow-glow">{dailyStats.energy}%</div>
             <div className="text-[10px] text-muted-foreground font-mono mt-1">CAPACITY</div>
          </div>
        </div>
      </div>
      
      {/* Dynamic Advice Panel */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {getAdvice(dailyStats.energy, dailyStats.hunger, dailyStats.mood, dailyStats.sleep)}
      </div>

      <CockpitCard title="Daily Status // MAN.INPUT">
         <div className="space-y-6 px-1">
           {/* Energy Slider */}
           <div className="space-y-2">
             <div className="flex justify-between items-end">
               <div className="flex items-center gap-2">
                 <Zap className="w-4 h-4 text-primary" />
                 <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Energy Reserve</span>
               </div>
               <span className="font-mono text-sm text-primary font-bold">{dailyStats.energy}%</span>
             </div>
             <SimpleSlider 
               value={[dailyStats.energy]} 
               onValueChange={([val]: any) => setDailyStats({...dailyStats, energy: val})}
               max={100} 
               trackColor="bg-primary"
             />
           </div>

           {/* Hunger Slider */}
           <div className="space-y-2">
             <div className="flex justify-between items-end">
               <div className="flex items-center gap-2">
                 <Utensils className="w-4 h-4 text-secondary" />
                 <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Hunger Index</span>
               </div>
               <span className="font-mono text-sm text-secondary font-bold">{dailyStats.hunger}%</span>
             </div>
             <SimpleSlider 
               value={[dailyStats.hunger]} 
               onValueChange={([val]: any) => setDailyStats({...dailyStats, hunger: val})}
               max={100} 
               trackColor="bg-secondary"
             />
           </div>
           
           {/* Mood Selector */}
           <div className="pt-4 border-t border-border/30 border-dashed">
             <div className="flex items-center gap-2 mb-3">
               <Radio className="w-4 h-4 text-muted-foreground" />
               <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Subjective State</div>
             </div>
             
             <div className="flex justify-between gap-2">
               {[1, 2, 3, 4, 5].map((level) => (
                 <button
                   key={level}
                   onClick={() => setDailyStats({...dailyStats, mood: level})}
                   className={`flex-1 h-12 rounded-sm border relative overflow-hidden group transition-all ${
                     dailyStats.mood === level 
                       ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(46,204,113,0.15)]" 
                       : "bg-card border-border hover:border-primary/50"
                   }`}
                 >
                   {/* Scanline effect for active state */}
                   {dailyStats.mood === level && (
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan" />
                   )}
                   
                   <div className={`flex flex-col items-center justify-center h-full relative z-10 font-mono ${dailyStats.mood === level ? 'text-primary' : 'text-muted-foreground'}`}>
                     <span className="text-lg font-bold">{level}</span>
                   </div>
                 </button>
               ))}
             </div>
             <div className="flex justify-between text-[9px] text-muted-foreground mt-1 px-1 font-mono uppercase tracking-widest opacity-60">
               <span>Fatigued</span>
               <span>Optimal</span>
             </div>
           </div>
         </div>
      </CockpitCard>

      <div className="bg-card border border-border rounded-2xl p-4 relative overflow-hidden">
        {/* Decorative background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />
        
        <div className="flex justify-between items-center mb-3 relative z-10">
          <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-primary/50 rounded-full animate-pulse" />
            Active Configuration
          </h3>
          <span className="text-[10px] font-mono text-primary border border-primary/30 px-1 rounded">V.1.0</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs font-mono relative z-10">
           <div className="bg-muted/10 p-2 border border-border/50">
             <div className="text-muted-foreground mb-1 text-[9px]">PROFILE</div>
             <div className="text-primary truncate">{profile.goal.toUpperCase()}</div>
           </div>
           <div className="bg-muted/10 p-2 border border-border/50">
             <div className="text-muted-foreground mb-1 text-[9px]">ACT.LVL</div>
             <div className="text-foreground truncate">{profile.activityLevel.substring(0, 8).toUpperCase()}</div>
           </div>
           <div className="bg-muted/10 p-2 border border-border/50">
             <div className="text-muted-foreground mb-1 text-[9px]">HGT.REF</div>
             <div className="text-foreground">{profile.height}CM</div>
           </div>
        </div>
        
        <Link href="/profile">
          <Button variant="ghost" className="w-full mt-3 text-[10px] font-mono h-8 border border-primary/20 hover:bg-primary/5 hover:border-primary/50 text-primary uppercase tracking-widest relative z-10">
            Re-Calibrate Parameters
          </Button>
        </Link>
      </div>

      {/* Chart */}
      <CockpitCard title="Trend Analysis // 7-DAY" className="h-64">
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
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                fontFamily="JetBrains Mono"
              />
              <YAxis 
                domain={['auto', 'auto']} 
                stroke="hsl(215, 15%, 60%)" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                width={30}
                fontFamily="JetBrains Mono"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 14%, 13%)', 
                  borderColor: 'hsl(220, 14%, 22%)',
                  borderRadius: '2px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px',
                  textTransform: 'uppercase'
                }}
                itemStyle={{ color: 'hsl(142, 70%, 45%)' }}
                cursor={{ stroke: 'hsl(142, 70%, 45%)', strokeWidth: 1, strokeDasharray: '4 4' }}
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