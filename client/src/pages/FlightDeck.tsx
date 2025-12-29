import { CockpitCard, InstrumentDisplay, Annunciator, GaugeRing } from "@/components/ui/CockpitCard";
import { CURRENT_DUTY, CHECKLIST_ITEMS, ADVISORIES, SUPPLEMENT_STACK } from "@/lib/mockData";
import { Plane, AlertTriangle, CheckCircle2, Settings, Pill, Clock, Droplets, Zap, Heart, Shield, Brain, Dumbbell, Moon, Activity } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChecklistItem {
  id: string;
  itemId: string;
  label: string;
  status: string;
  value: string | null;
}

export default function FlightDeck() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  
  const userGoal = profile?.goal || "Maintain";

  const { data: savedChecklist = [], isLoading } = useQuery<ChecklistItem[]>({
    queryKey: ["/api/checklists", today],
    queryFn: () => apiRequest("GET", `/api/checklists/${today}`).then(res => res.json()),
  });

  const mergedChecklist = CHECKLIST_ITEMS.map(item => {
    const saved = savedChecklist.find(s => s.itemId === item.id);
    return {
      ...item,
      dbId: saved?.id,
      status: saved?.status || item.status,
    };
  });

  const createChecklistMutation = useMutation({
    mutationFn: (data: { itemId: string; label: string; status: string; value?: string }) => 
      apiRequest("POST", "/api/checklists", { ...data, date: today }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklists", today] });
    },
  });

  const updateChecklistMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      apiRequest("PUT", `/api/checklists/${id}`, { status }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklists", today] });
    },
  });

  const toggleChecklist = (item: typeof mergedChecklist[0]) => {
    const newStatus = item.status === "complete" ? "pending" : "complete";
    
    if (item.dbId) {
      updateChecklistMutation.mutate({ id: item.dbId, status: newStatus });
    } else {
      createChecklistMutation.mutate({
        itemId: item.id,
        label: item.label,
        status: newStatus,
        value: item.value,
      });
    }
  };

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "Clock": return <Clock className="w-4 h-4 text-secondary shrink-0 mt-0.5" />;
      case "Droplets": return <Droplets className="w-4 h-4 text-secondary shrink-0 mt-0.5" />;
      default: return <AlertTriangle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />;
    }
  };

  const getSupplementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "performance": return <Zap className="w-4 h-4 text-yellow-400" />;
      case "health": return <Heart className="w-4 h-4 text-red-400" />;
      case "immunity": return <Shield className="w-4 h-4 text-blue-400" />;
      case "cognitive/power": return <Brain className="w-4 h-4 text-purple-400" />;
      case "recovery": return <Dumbbell className="w-4 h-4 text-orange-400" />;
      case "sleep support": return <Moon className="w-4 h-4 text-indigo-400" />;
      default: return <Pill className="w-4 h-4 text-primary" />;
    }
  };

  const completedCount = mergedChecklist.filter(item => item.status === "complete").length;
  const totalCount = mergedChecklist.length;
  const checklistProgress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-[0.2em] text-foreground font-mono">FLIGHT DECK</h1>
              <p className="text-[10px] text-muted-foreground font-mono tracking-wider">
                SYS.READY <span className="text-primary">●</span> {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
        <Link href="/profile">
          <div className="mfd-button cursor-pointer" data-testid="button-settings">
            <Settings className="w-4 h-4" />
          </div>
        </Link>
      </header>

      <CockpitCard title="Primary Flight Display" variant="instrument" status="cyan">
        <div className="grid grid-cols-3 gap-4">
          <InstrumentDisplay 
            label="Duty Start" 
            value={CURRENT_DUTY.dutyStart}
            size="default"
          />
          <div className="flex flex-col items-center justify-center">
            <GaugeRing 
              value={checklistProgress} 
              max={100} 
              size={70}
              label="Ready"
              status={checklistProgress === 100 ? "normal" : checklistProgress > 50 ? "amber" : "warning"}
            />
          </div>
          <InstrumentDisplay 
            label="Mode" 
            value={userGoal.toUpperCase().slice(0, 8)}
            size="default"
          />
        </div>
        
        <div className="h-px bg-border/50 my-4" />
        
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="cockpit-label">Conditions</span>
          </div>
          <Annunciator status={CURRENT_DUTY.conditions === "ISA" ? "green" : "amber"}>
            {CURRENT_DUTY.conditions.toUpperCase()}
          </Annunciator>
        </div>
        
        <div className="flex justify-between items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="cockpit-label">Duty Type</span>
          </div>
          <Annunciator status="cyan">
            {CURRENT_DUTY.dutyType.toUpperCase()}
          </Annunciator>
        </div>
      </CockpitCard>

      {ADVISORIES.length > 0 && (
        <CockpitCard title="Crew Alerting System" status="amber" variant="default">
          <div className="space-y-4">
            {ADVISORIES.map((adv) => (
              <div key={adv.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <div className="status-led amber" />
                  <div className="flex justify-between w-full items-center">
                     <span className="font-mono text-sm text-secondary">{adv.message}</span>
                     {adv.value !== undefined && (
                        <span className="font-mono text-xs text-secondary/70">{adv.value}%</span>
                     )}
                  </div>
                </div>
                {adv.value !== undefined && (
                   <div className="pl-6">
                      <Progress value={(adv.value / (adv.maxValue || 100)) * 100} className="h-1.5 bg-secondary/20 [&>div]:bg-secondary" />
                   </div>
                )}
              </div>
            ))}
          </div>
        </CockpitCard>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="cockpit-label">PRE-FLIGHT CHECKLIST</h3>
          <span className="font-mono text-xs text-primary">{completedCount}/{totalCount}</span>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground text-sm">Loading checklist...</div>
        ) : (
          mergedChecklist.map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleChecklist(item)}
              data-testid={`checklist-item-${item.id}`}
              className="group flex items-center justify-between p-3 instrument-bezel hover:border-primary/50 transition-all cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                {item.status === "complete" ? (
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-muted-foreground/50 group-hover:border-primary/50 transition-colors" />
                )}
                <span className={`font-medium text-sm transition-colors ${item.status === "complete" ? "text-primary" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {item.value}
              </span>
            </div>
          ))
        )}
      </div>

      <CockpitCard title="Supplement Protocol" variant="default">
        <div className="space-y-3">
          {SUPPLEMENT_STACK.map((supp) => (
            <div key={supp.id} className="flex items-center justify-between border-b border-border/30 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg pfd-display flex items-center justify-center">
                   {getSupplementIcon(supp.type)}
                </div>
                <div>
                  <div className="font-medium text-sm">{supp.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono tracking-wider">{supp.type.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm lcd-text">{supp.dose}</div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase">{supp.timing}</div>
              </div>
            </div>
          ))}
        </div>
      </CockpitCard>
    </div>
  );
}
