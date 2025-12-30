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
      case "Clock": return <Clock className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={2} />;
      case "Droplets": return <Droplets className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={2} />;
      default: return <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={2} />;
    }
  };

  const getSupplementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "performance": return <Zap className="w-5 h-5 text-yellow-500" strokeWidth={2} />;
      case "health": return <Heart className="w-5 h-5 text-red-500" strokeWidth={2} fill="currentColor" />;
      case "immunity": return <Shield className="w-5 h-5 text-blue-500" strokeWidth={2} />;
      case "cognitive/power": return <Brain className="w-5 h-5 text-purple-500" strokeWidth={2} />;
      case "recovery": return <Dumbbell className="w-5 h-5 text-orange-500" strokeWidth={2} />;
      case "sleep support": return <Moon className="w-5 h-5 text-indigo-500" strokeWidth={2} fill="currentColor" />;
      default: return <Pill className="w-5 h-5 text-primary" strokeWidth={2} />;
    }
  };

  const completedCount = mergedChecklist.filter(item => item.status === "complete").length;
  const totalCount = mergedChecklist.length;
  const checklistProgress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-5 pb-24">
      <header className="flex justify-between items-center pt-2 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flight Deck</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center cursor-pointer hover:bg-accent transition-colors" data-testid="button-settings">
            <Settings className="w-5 h-5 text-foreground" strokeWidth={2} />
          </div>
        </Link>
      </header>

      <CockpitCard title="Status Overview" variant="instrument">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1.5">Duty Start</span>
              <span className="text-xl font-semibold text-foreground">{CURRENT_DUTY.dutyStart}</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <GaugeRing 
                value={checklistProgress} 
                max={100} 
                size={60}
                label="Ready"
                status={checklistProgress === 100 ? "normal" : checklistProgress > 50 ? "amber" : "warning"}
              />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground mb-1.5">Goal</span>
              <span className="text-xl font-semibold text-foreground">{userGoal}</span>
            </div>
          </div>
          
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm text-muted-foreground">Conditions</span>
              </div>
              <span className="text-sm font-medium text-foreground">{CURRENT_DUTY.conditions}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                <span className="text-sm text-muted-foreground">Duty Type</span>
              </div>
              <span className="text-sm font-medium text-foreground">{CURRENT_DUTY.dutyType}</span>
            </div>
          </div>
        </div>
      </CockpitCard>

      {ADVISORIES.length > 0 && (
        <CockpitCard title="Alerts" variant="default">
          <div className="space-y-3">
            {ADVISORIES.map((adv) => (
              <div key={adv.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm text-foreground">{adv.message}</span>
                  </div>
                  {adv.value !== undefined && (
                    <span className="text-sm font-medium text-muted-foreground">{adv.value}%</span>
                  )}
                </div>
                {adv.value !== undefined && (
                  <div className="pl-4.5">
                    <Progress value={(adv.value / (adv.maxValue || 100)) * 100} className="h-1.5 bg-muted [&>div]:bg-amber-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CockpitCard>
      )}

      <CockpitCard title="Pre-Flight Checklist" variant="default">
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Checklist</h3>
            <span className="text-sm text-muted-foreground">{completedCount}/{totalCount}</span>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading checklist...</div>
          ) : (
            mergedChecklist.map((item, index) => (
              <div key={item.id}>
                <div 
                  onClick={() => toggleChecklist(item)}
                  data-testid={`checklist-item-${item.id}`}
                  className="group flex items-center justify-between py-3.5 px-1 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {item.status === "complete" ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} fill="currentColor" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/40 group-hover:border-primary/60 transition-colors flex-shrink-0" />
                  )}
                    <span className="font-medium text-sm text-foreground">
                      {item.label}
                    </span>
                  </div>
                  {item.value && (
                    <span className="text-sm text-muted-foreground ml-3">
                      {item.value}
                    </span>
                  )}
                </div>
                {index < mergedChecklist.length - 1 && (
                  <div className="h-px bg-border/50 ml-8" />
                )}
              </div>
            ))
          )}
        </div>
      </CockpitCard>

      <CockpitCard title="Supplements" variant="default">
        <div className="space-y-0">
          {SUPPLEMENT_STACK.map((supp, index) => (
            <div key={supp.id} className={`flex items-center justify-between py-4 ${index < SUPPLEMENT_STACK.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                   {getSupplementIcon(supp.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{supp.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{supp.type}</div>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="font-semibold text-sm text-foreground">{supp.dose}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{supp.timing}</div>
              </div>
            </div>
          ))}
        </div>
      </CockpitCard>
    </div>
  );
}
