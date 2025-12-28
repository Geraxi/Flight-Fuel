import { useState, useRef } from "react";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Brain, ScanLine, ArrowRight, ChevronRight, Activity, Zap, Scale } from "lucide-react";
import { Link } from "wouter";

export default function Progress() {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

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
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setActiveTab('results');
    }, 3000);
  };

  const AnalysisOverlay = () => (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-xl">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/80 shadow-[0_0_15px_#2ecc71] animate-scan-down opacity-80" />
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 animate-pulse-slow" />
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-primary/30 text-[10px] font-mono text-primary flex items-center gap-2">
         <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
         ANALYZING
      </div>
      
      {/* Target reticles */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 border-t border-l border-primary/50" />
      <div className="absolute bottom-1/4 right-1/4 w-8 h-8 border-b border-r border-primary/50" />
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-6 flex justify-between items-start">
         <div className="flex items-center gap-3">
           <Link href="/log">
             <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-primary/30 bg-primary/5 hover:bg-primary/10">
               <ChevronRight className="h-5 w-5 rotate-180 text-primary" />
             </Button>
           </Link>
           <div>
             <h1 className="text-xl font-bold tracking-widest text-foreground uppercase">Visual Analysis</h1>
             <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
               <Brain className="w-3 h-3 text-primary" />
               AI COMP. MODULE
             </p>
           </div>
         </div>
      </header>

      {activeTab === 'upload' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <CockpitCard title="Input Source Data">
            <div className="grid grid-cols-2 gap-4">
              {/* Before Image */}
              <div className="space-y-2">
                <Label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Baseline (Old)</Label>
                <div 
                  className="aspect-[3/4] bg-muted/10 border-2 border-dashed border-border hover:border-primary/50 rounded-xl relative overflow-hidden transition-all group"
                  onClick={() => document.getElementById('before-upload')?.click()}
                >
                  {beforeImage ? (
                    <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Camera className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-[9px] font-mono uppercase">Upload Ref</span>
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

              {/* After Image */}
              <div className="space-y-2">
                <Label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Current (New)</Label>
                <div 
                  className="aspect-[3/4] bg-muted/10 border-2 border-dashed border-border hover:border-primary/50 rounded-xl relative overflow-hidden transition-all group"
                  onClick={() => document.getElementById('after-upload')?.click()}
                >
                  {afterImage ? (
                    <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Upload className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-[9px] font-mono uppercase">Upload Current</span>
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
              className="w-full mt-6 font-mono tracking-wider relative overflow-hidden" 
              disabled={!beforeImage || !afterImage || isAnalyzing}
              onClick={startAnalysis}
            >
              {isAnalyzing ? (
                <>
                  <ScanLine className="w-4 h-4 mr-2 animate-pulse" />
                  ANALYZING VECTOR DATA...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  INITIATE ANALYSIS
                </>
              )}
            </Button>
          </CockpitCard>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
             <div className="flex gap-3">
               <div className="bg-primary/10 p-2 rounded-full h-fit">
                 <Zap className="w-4 h-4 text-primary" />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-primary mb-1">How it works</h4>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   The onboard AI compares structural markers between your baseline and current physique to estimate body composition shifts and hypertrophy velocity.
                 </p>
               </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && analysisComplete && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
           
           {/* Summary Stats */}
           <div className="grid grid-cols-2 gap-3">
             <div className="bg-card border border-border rounded-xl p-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                 <Scale className="w-8 h-8" />
               </div>
               <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Est. Body Fat</div>
               <div className="text-2xl font-bold font-mono text-primary flex items-end gap-2">
                 -1.4%
                 <span className="text-[10px] mb-1 text-primary/70">DELTA</span>
               </div>
             </div>
             
             <div className="bg-card border border-border rounded-xl p-4 relative overflow-hidden">
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

           <CockpitCard title="Analysis Report">
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
             <Button variant="outline" className="flex-1 font-mono text-xs border-primary/30 text-primary hover:bg-primary/10" onClick={() => setActiveTab('upload')}>
               NEW ANALYSIS
             </Button>
             <Button className="flex-1 font-mono text-xs" onClick={() => setActiveTab('upload')}>
               SAVE TO LOG
             </Button>
           </div>
        </div>
      )}
    </div>
  );
}
