import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { CockpitCard, Annunciator } from "@/components/ui/CockpitCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Brain, ScanLine, Activity, Zap, Scale, User, ArrowRight, Sparkles, Lock } from "lucide-react";
import { usePremium } from "@/lib/premium";

type ViewMode = "hero" | "scan" | "results";

export default function Progress() {
  const [, setLocation] = useLocation();
  const { isPremium } = usePremium();
  const [viewMode, setViewMode] = useState<ViewMode>("hero");
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'before') setBeforeImage(reader.result as string);
        else setAfterImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = () => {
    if (!beforeImage || !afterImage) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setViewMode('results');
    }, 3000);
  };

  const resetScan = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setAnalysisComplete(false);
    setViewMode('hero');
  };

  const AnalysisOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-xl">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/80 shadow-[0_0_15px_#2ecc71] animate-scan-down opacity-80" />
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 animate-pulse-slow" />
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-primary/30 text-[10px] font-mono text-primary flex items-center gap-2">
         <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
         ANALYZING
      </div>
      <div className="absolute top-1/4 left-1/4 w-8 h-8 border-t border-l border-primary/50" />
      <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-b border-r border-primary/50" />
    </div>
  );

  if (viewMode === "hero") {
    return (
      <div className="space-y-6 pb-24 animate-in fade-in duration-500">
        <header className="mb-2">
          <h1 className="text-lg font-bold tracking-[0.15em] text-foreground uppercase font-mono">PROGRESS</h1>
          <p className="text-[10px] text-muted-foreground font-mono tracking-wider">VISUAL ANALYSIS SYSTEM</p>
        </header>

        {isPremium ? (
          <div 
            className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 cursor-pointer group"
            onClick={() => setViewMode("scan")}
            data-testid="button-body-scan-hero"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
            
            <div className="absolute top-3 right-3">
              <Annunciator status="cyan">READY</Annunciator>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-10 h-10 text-primary" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
              </div>
              
              <h2 className="text-2xl font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                <ScanLine className="w-6 h-6 text-primary" />
                BODY SCAN
              </h2>
              
              <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
                Compare before & after photos to track your physical transformation
              </p>

              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wider px-8 group-hover:scale-105 transition-transform"
                data-testid="button-start-body-scan"
              >
                <Camera className="w-5 h-5 mr-2" />
                START BODY SCAN
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2 text-[10px] text-primary/60 font-mono">
                <Sparkles className="w-3 h-3" />
                <span>AI-POWERED ANALYSIS</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
            
            <div className="absolute top-3 right-3">
              <Annunciator status="amber">LOCKED</Annunciator>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mb-4">
                <Lock className="w-10 h-10 text-amber-400" />
              </div>
              
              <h2 className="text-2xl font-bold tracking-wider text-foreground mb-2 flex items-center gap-2">
                <ScanLine className="w-6 h-6 text-amber-400" />
                BODY SCAN
              </h2>
              
              <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
                AI-powered body composition tracking is available with FlightFuel Premium
              </p>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 font-mono tracking-wider px-8"
                onClick={() => setLocation('/upgrade')}
                data-testid="button-upgrade-body-scan"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                UPGRADE TO PREMIUM
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-2 text-[10px] text-amber-400/60 font-mono">
                <Lock className="w-3 h-3" />
                <span>PREMIUM FEATURE</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="instrument-bezel p-4 text-center">
            <div className="text-2xl font-mono lcd-text mb-1">0</div>
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Scans</div>
          </div>
          <div className="instrument-bezel p-4 text-center">
            <div className="text-2xl font-mono lcd-text-amber mb-1">--</div>
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Body Fat Δ</div>
          </div>
          <div className="instrument-bezel p-4 text-center">
            <div className="text-2xl font-mono lcd-text-cyan mb-1">--</div>
            <div className="text-[9px] text-muted-foreground font-mono uppercase">Muscle Δ</div>
          </div>
        </div>

        <CockpitCard title="How It Works" variant="default">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg pfd-display flex items-center justify-center shrink-0">
                <span className="font-mono text-primary text-sm">1</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Upload Baseline Photo</h4>
                <p className="text-xs text-muted-foreground">Take or upload a "before" photo as your starting point</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg pfd-display flex items-center justify-center shrink-0">
                <span className="font-mono text-primary text-sm">2</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Upload Current Photo</h4>
                <p className="text-xs text-muted-foreground">Add your most recent photo to compare progress</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg pfd-display flex items-center justify-center shrink-0">
                <span className="font-mono text-primary text-sm">3</span>
              </div>
              <div>
                <h4 className="text-sm font-medium">Get AI Analysis</h4>
                <p className="text-xs text-muted-foreground">Our system analyzes changes in body composition and muscle definition</p>
              </div>
            </div>
          </div>
        </CockpitCard>

        <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
          <div className="flex gap-3 items-start">
            <Zap className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-secondary mb-1">Pro Tip</h4>
              <p className="text-xs text-muted-foreground">
                For best results, use consistent lighting, pose, and camera distance between photos.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "scan") {
    return (
      <div className="space-y-6 pb-24 animate-in slide-in-from-right duration-300">
        <header className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold tracking-[0.15em] text-foreground uppercase font-mono">BODY SCAN</h1>
            <p className="text-[10px] text-muted-foreground font-mono tracking-wider flex items-center gap-2">
              <Brain className="w-3 h-3 text-primary" />
              AI COMPARISON MODULE
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs font-mono"
            onClick={resetScan}
            data-testid="button-cancel-scan"
          >
            CANCEL
          </Button>
        </header>

        <CockpitCard title="Upload Photos" variant="instrument">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                BEFORE
              </Label>
              <div 
                className="aspect-[3/4] bg-muted/10 border-2 border-dashed border-amber-500/50 hover:border-amber-500 rounded-xl relative overflow-hidden transition-all group cursor-pointer"
                onClick={() => document.getElementById('before-upload')?.click()}
                data-testid="upload-before-photo"
              >
                {beforeImage ? (
                  <>
                    <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Annunciator status="amber">LOADED</Annunciator>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500/70 group-hover:text-amber-500 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono uppercase">Tap to Upload</span>
                    <span className="text-[10px] text-muted-foreground mt-1">Baseline Photo</span>
                  </div>
                )}
                {isAnalyzing && beforeImage && <AnalysisOverlay />}
                <input 
                  id="before-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, 'before')}
                  disabled={isAnalyzing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                AFTER
              </Label>
              <div 
                className="aspect-[3/4] bg-muted/10 border-2 border-dashed border-primary/50 hover:border-primary rounded-xl relative overflow-hidden transition-all group cursor-pointer"
                onClick={() => document.getElementById('after-upload')?.click()}
                data-testid="upload-after-photo"
              >
                {afterImage ? (
                  <>
                    <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Annunciator status="green">LOADED</Annunciator>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/70 group-hover:text-primary transition-colors">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-mono uppercase">Tap to Upload</span>
                    <span className="text-[10px] text-muted-foreground mt-1">Current Photo</span>
                  </div>
                )}
                {isAnalyzing && afterImage && <AnalysisOverlay />}
                <input 
                  id="after-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageUpload(e, 'after')}
                  disabled={isAnalyzing}
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-6 font-mono tracking-wider h-14 text-base relative overflow-hidden" 
            disabled={!beforeImage || !afterImage || isAnalyzing}
            onClick={startAnalysis}
            data-testid="button-analyze"
          >
            {isAnalyzing ? (
              <>
                <ScanLine className="w-5 h-5 mr-2 animate-pulse" />
                ANALYZING BODY COMPOSITION...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                ANALYZE TRANSFORMATION
              </>
            )}
          </Button>
        </CockpitCard>

        {(!beforeImage || !afterImage) && (
          <div className="bg-muted/10 border border-border/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Upload both photos to start the analysis
            </p>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "results" && analysisComplete) {
    return (
      <div className="space-y-6 pb-24 animate-in slide-in-from-bottom duration-500">
        <header className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold tracking-[0.15em] text-foreground uppercase font-mono">ANALYSIS COMPLETE</h1>
            <p className="text-[10px] text-muted-foreground font-mono tracking-wider">TRANSFORMATION DETECTED</p>
          </div>
          <Annunciator status="green">SUCCESS</Annunciator>
        </header>

        <div className="grid grid-cols-2 gap-3">
          <div className="instrument-bezel p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Scale className="w-8 h-8" />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Est. Body Fat</div>
            <div className="text-2xl font-bold font-mono text-primary flex items-end gap-2">
              -1.4%
              <span className="text-[10px] mb-1 text-primary/70">DELTA</span>
            </div>
          </div>
          
          <div className="instrument-bezel p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Zap className="w-8 h-8" />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Muscle Def.</div>
            <div className="text-2xl font-bold font-mono text-secondary flex items-end gap-2">
              +8.2%
              <span className="text-[10px] mb-1 text-secondary/70">DELTA</span>
            </div>
          </div>
        </div>

        <CockpitCard title="Analysis Report" variant="instrument">
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-border/40">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Shoulder Definition</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Significant increase in lateral deltoid separation detected. Structural density improved by approximately 12%.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pb-4 border-b border-border/40">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_currentColor]" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Abdominal Visibility</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Mid-section vascularity markers detected. Lower abdominal definition has increased visibility consistent with sub-12% body fat levels.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_currentColor]" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Posture Alignment</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Thoracic extension improved. Shoulder internal rotation reduced compared to baseline image.
                </p>
              </div>
            </div>
          </div>
        </CockpitCard>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10" 
            onClick={resetScan}
            data-testid="button-new-scan"
          >
            NEW SCAN
          </Button>
          <Button 
            className="flex-1 font-mono text-xs"
            data-testid="button-save-results"
          >
            SAVE TO LOG
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
