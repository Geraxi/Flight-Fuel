import { useState } from "react";
import { Camera, ScanLine, X, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CockpitCard } from "@/components/ui/CockpitCard";

export default function FuelScan() {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const reset = () => {
    setScanned(false);
  };

  if (scanned) {
    return (
      <div className="h-full flex flex-col pb-20 animate-in zoom-in-95 duration-300">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Analysis Complete</h1>
          <Button variant="ghost" size="icon" onClick={reset}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 space-y-4">
          <div className="bg-card border border-border rounded-lg p-2 h-48 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50" />
             <ScanLine className="text-primary w-12 h-12 opacity-50" />
             <p className="absolute bottom-2 left-2 text-xs font-mono text-muted-foreground">IMG_SOURCE: CAM_01</p>
          </div>

          <CockpitCard title="Detected Items" className="border-primary/30">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <div>
                  <div className="text-lg font-medium">Grilled Chicken Salad</div>
                  <div className="text-xs text-primary font-mono">CONFIDENCE: HIGH (98%)</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl">320</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Est. KCAL</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/10 p-2 rounded">
                  <div className="text-xs text-muted-foreground mb-1">PRO</div>
                  <div className="font-mono">35g</div>
                </div>
                <div className="bg-muted/10 p-2 rounded">
                  <div className="text-xs text-muted-foreground mb-1">CARB</div>
                  <div className="font-mono">12g</div>
                </div>
                <div className="bg-muted/10 p-2 rounded">
                  <div className="text-xs text-muted-foreground mb-1">FAT</div>
                  <div className="font-mono">15g</div>
                </div>
              </div>
            </div>
          </CockpitCard>

          <div className="bg-secondary/10 border border-secondary/30 rounded p-3 flex gap-3 items-start">
             <div className="text-secondary font-mono text-xs pt-0.5">NOTE:</div>
             <p className="text-xs text-muted-foreground">
               Nutritional values are estimates for educational purposes only. Example food items are common choices, not medical prescriptions.
             </p>
          </div>
        </div>

        <div className="mt-4">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wide" size="lg">
            <Plus className="mr-2 h-4 w-4" /> ADD TO FLIGHT PLAN
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center relative -m-4 p-4 bg-black overflow-hidden">
      {/* Camera UI Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
        <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-primary/50" />
        <div className="absolute bottom-24 left-10 w-8 h-8 border-b-2 border-l-2 border-primary/50" />
        <div className="absolute bottom-24 right-10 w-8 h-8 border-b-2 border-r-2 border-primary/50" />
        
        {/* Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-64 h-64 border border-primary/20 rounded-lg relative">
             <div className="absolute top-1/2 left-0 w-full h-px bg-primary/30" />
             <div className="absolute left-1/2 top-0 h-full w-px bg-primary/30" />
             {scanning && (
               <div className="absolute inset-0 bg-primary/10 animate-pulse" />
             )}
           </div>
        </div>
        
        {scanning && (
            <div className="absolute top-1/2 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_#2ecc71] animate-[scan_2s_ease-in-out_infinite]" />
        )}
      </div>

      <div className="z-10 w-full max-w-xs space-y-8 text-center">
        <div className="bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-border inline-block">
          <span className="text-xs font-mono text-primary animate-pulse">
            {scanning ? "ANALYZING TARGET..." : "SYSTEM READY"}
          </span>
        </div>
        
        <Button 
          size="lg" 
          className="h-20 w-20 rounded-full border-4 border-primary/30 bg-primary/10 hover:bg-primary/20 hover:scale-105 transition-all p-0 flex items-center justify-center"
          onClick={handleScan}
          disabled={scanning}
        >
          <Camera className="w-8 h-8 text-primary" />
        </Button>
        
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          Align food in reticle
        </p>
      </div>
    </div>
  );
}
