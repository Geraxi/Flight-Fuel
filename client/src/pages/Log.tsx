import { LOG_DATA } from "@/lib/mockData";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Battery, Scale, Moon } from "lucide-react";

export default function Log() {
  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Pilot Log</h1>
        <p className="text-xs text-muted-foreground font-mono">BIOMETRICS & STATUS MONITORING</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <CockpitCard className="items-center justify-center py-4 gap-2">
          <Scale className="w-5 h-5 text-muted-foreground" />
          <div className="text-center">
             <div className="text-lg font-mono font-bold">74.6</div>
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
