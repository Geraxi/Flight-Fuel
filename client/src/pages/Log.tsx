import { LOG_DATA } from "@/lib/mockData";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Battery, Scale, Moon, Settings, Edit2, Zap, Utensils, Activity, Radio, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

function SimpleSlider({ value, onValueChange, max, className, trackColor = "bg-primary" }: any) {
  const val = value[0];
  const percentage = Math.min(100, Math.max(0, (val / max) * 100));
  
  return (
    <div className={`relative flex items-center select-none touch-none w-full h-8 ${className}`}>
      <div className={`absolute w-full h-2 ${trackColor}/10 rounded-sm overflow-hidden flex gap-[2px]`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 bg-current opacity-20" />
        ))}
      </div>
      
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
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: healthLog } = useQuery({
    queryKey: ["/api/health", today],
    queryFn: () => apiRequest("GET", `/api/health/${today}`).then(res => res.json()),
  });

  const [dailyStats, setDailyStats] = useState({
    energy: 50,
    hunger: 50,
    mood: 3,
    sleep: 7,
    weight: profile?.weight ?? undefined as number | undefined
  });

  useEffect(() => {
    if (healthLog) {
      setDailyStats({
        energy: healthLog.energy ?? 50,
        hunger: healthLog.hunger ?? 50,
        mood: healthLog.mood ?? 3,
        sleep: healthLog.sleep ?? 7,
        weight: healthLog.weight ?? profile?.weight ?? undefined,
      });
    }
  }, [healthLog, profile]);

  const updateHealthMutation = useMutation({
    mutationFn: (data: typeof dailyStats) => 
      apiRequest("POST", "/api/health", { 
        energy: data.energy,
        hunger: data.hunger,
        mood: data.mood,
        sleep: data.sleep,
        weight: data.weight,
        date: today 
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health", today] });
      queryClient.invalidateQueries({ queryKey: ["/api/health/range"] });
    },
  });

  // Get weekly health logs for trend chart
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6); // Last 7 days
  const endDate = new Date().toISOString().split("T")[0];
  const weekStartDate = startDate.toISOString().split("T")[0];

  const { data: weeklyLogs = [] } = useQuery({
    queryKey: ["/api/health/range", weekStartDate, endDate],
    queryFn: () => apiRequest("GET", `/api/health/range/${weekStartDate}/${endDate}`).then(res => res.json()),
  });

  const handleStatChange = (field: keyof typeof dailyStats, value: number | undefined) => {
    const newStats = { ...dailyStats, [field]: value };
    setDailyStats(newStats);
    updateHealthMutation.mutate(newStats);
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
            <Link href="/profile">
              <Button variant="outline" size="sm" className="h-7 font-mono text-[10px] border-primary/30 text-primary hover:bg-primary/10 uppercase tracking-wider">
                <Settings className="w-3 h-3 mr-2" /> Sys Config
              </Button>
           </Link>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
          <div className="p-3 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <Scale className="w-3 h-3 text-muted-foreground" />
              <div className="text-[8px] font-mono text-muted-foreground uppercase">WGT.LOAD</div>
            </div>
            <div className="relative w-full">
              <Input 
                type="number" 
                className="text-xl font-mono font-bold text-center border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-foreground w-full" 
                value={dailyStats.weight ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number(e.target.value);
                  handleStatChange('weight', value);
                }}
                placeholder={profile?.weight?.toString() || "--"}
                data-testid="input-weight"
              />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">KG</div>
          </div>
        </div>
        
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
                 onChange={(e) => handleStatChange('sleep', Number(e.target.value))}
                 data-testid="input-sleep"
               />
            </div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">HRS</div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
          <div className="p-3 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <Battery className="w-3 h-3 text-muted-foreground" />
              <div className="text-[8px] font-mono text-muted-foreground uppercase">ENG.LVL</div>
            </div>
            <div className="text-xl font-mono font-bold">{dailyStats.energy}%</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">PWR</div>
          </div>
        </div>
      </div>

      <CockpitCard title="Physiological State">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-mono text-muted-foreground">ENERGY</label>
              <span className="text-sm font-mono text-primary">{dailyStats.energy}%</span>
            </div>
            <SimpleSlider
              value={[dailyStats.energy]}
              onValueChange={(v: number[]) => handleStatChange('energy', v[0])}
              max={100}
              trackColor="bg-primary"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-mono text-muted-foreground">HUNGER</label>
              <span className="text-sm font-mono text-secondary">{dailyStats.hunger}%</span>
            </div>
            <SimpleSlider
              value={[dailyStats.hunger]}
              onValueChange={(v: number[]) => handleStatChange('hunger', v[0])}
              max={100}
              trackColor="bg-secondary"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-mono text-muted-foreground">MOOD</label>
              <span className="text-sm font-mono text-blue-400">
                {['😴', '😔', '😐', '🙂', '😊'][dailyStats.mood - 1] || '😐'}
              </span>
            </div>
            <div className="flex gap-2 justify-between">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleStatChange('mood', level)}
                  data-testid={`mood-${level}`}
                  className={`flex-1 h-10 rounded-lg border-2 transition-all font-mono text-sm ${
                    dailyStats.mood === level 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                      : 'bg-muted/10 border-border hover:border-blue-500/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CockpitCard>

      {getAdvice(dailyStats.energy, dailyStats.hunger, dailyStats.mood, dailyStats.sleep)}

      <CockpitCard title="Energy Trend">
        <div className="h-48 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LOG_DATA} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 76% 48%)" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="hsl(142 76% 48%)" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.2}
                vertical={false}
              />
              <XAxis 
                dataKey="day" 
                tick={{ 
                  fill: 'hsl(180 20% 75%)', 
                  fontSize: 12, 
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                tick={{ 
                  fill: 'hsl(180 20% 75%)', 
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                domain={[0, 100]}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  fontSize: '13px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="energy" 
                stroke="hsl(142 76% 48%)" 
                strokeWidth={2.5}
                fill="url(#energyGrad)"
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(142 76% 48%)', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CockpitCard>

      <CockpitCard title="Weight Trend">
        <div className="h-48 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={(() => {
                // Generate chart data from weekly logs, filling in missing days
                const chartData = [];
                const weightMap = new Map(weeklyLogs.map((log: any) => [log.date, log.weight]));
                const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                
                for (let i = 6; i >= 0; i--) {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const dateStr = date.toISOString().split("T")[0];
                  const dayIndex = date.getDay();
                  const weight = weightMap.get(dateStr);
                  
                  chartData.push({
                    day: dayNames[dayIndex],
                    weight: weight ?? null
                  });
                }
                return chartData;
              })()} 
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(195 100% 50%)" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="hsl(195 100% 50%)" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.2}
                vertical={false}
              />
              <XAxis 
                dataKey="day" 
                tick={{ 
                  fill: 'hsl(180 20% 75%)', 
                  fontSize: 12, 
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                tick={{ 
                  fill: 'hsl(180 20% 75%)', 
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                width={50}
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  fontSize: '13px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
                formatter={(value: any) => value !== null ? `${value} kg` : 'No data'}
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(195 100% 50%)" 
                strokeWidth={2.5}
                fill="url(#weightGrad)"
                dot={{ r: 3, fill: 'hsl(195 100% 50%)', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                activeDot={{ r: 5, fill: 'hsl(195 100% 50%)', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CockpitCard>
    </div>
  );
}
