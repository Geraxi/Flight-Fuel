import { CockpitCard } from "@/components/ui/CockpitCard";

export default function Progress() {
  return (
    <div className="space-y-5 pb-24">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Progress</h1>
        <p className="text-sm text-muted-foreground">Track your fitness journey</p>
      </header>

      <CockpitCard title="Coming Soon">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Progress tracking features will be available here soon.
          </p>
        </div>
      </CockpitCard>
    </div>
  );
}
