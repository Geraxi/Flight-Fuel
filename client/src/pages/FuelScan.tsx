import { useState, useEffect, useRef } from "react";
import { Camera, ScanLine, X, Check, Plus, Image as ImageIcon, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CockpitCard } from "@/components/ui/CockpitCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FuelScan() {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [mealType, setMealType] = useState("lunch");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (!scanned && !capturedImage) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
          console.error("Error accessing camera:", err);
      });
    }

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [scanned, capturedImage]);

  const captureFrame = () => {
    if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            return canvas.toDataURL("image/png");
        }
    }
    return null;
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const img = captureFrame();
      setCapturedImage(img);
      setScanning(false);
      setScanned(true);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCapturedImage(reader.result as string);
            setScanning(true);
            setTimeout(() => {
                setScanning(false);
                setScanned(true);
            }, 1500);
        };
        reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const reset = () => {
    setScanned(false);
    setCapturedImage(null);
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
          <div className="bg-card border border-border rounded-lg p-2 h-64 relative overflow-hidden flex items-center justify-center group">
             {capturedImage ? (
                 <img src={capturedImage} alt="Scanned Food" className="absolute inset-0 w-full h-full object-cover opacity-80" />
             ) : (
                 <div className="absolute inset-0 bg-black" />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
             
             <ScanLine className="text-primary w-12 h-12 opacity-80 relative z-10 drop-shadow-[0_0_10px_rgba(46,204,113,0.8)]" />
             <p className="absolute bottom-2 left-2 text-xs font-mono text-muted-foreground z-10 bg-black/50 px-2 py-1 rounded">IMG_SOURCE: {capturedImage ? 'CAPTURE_BUFFER' : 'CAM_01'}</p>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Log Entry For:</span>
             </div>
             <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger className="font-mono uppercase tracking-wider">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
             </Select>
          </div>

          <CockpitCard title="Detected Items (Simulation)" className="border-primary/30">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <div>
                  <div className="text-lg font-medium">Mixed Meal Analysis</div>
                  <div className="text-xs text-primary font-mono">CONFIDENCE: MOD (82%)</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl">450</div>
                  <div className="text-[10px] text-muted-foreground uppercase">Est. KCAL</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted/10 p-2 rounded">
                  <div className="text-xs text-muted-foreground mb-1">PRO</div>
                  <div className="font-mono">28g</div>
                </div>
                <div className="bg-muted/10 p-2 rounded">
                  <div className="text-xs text-muted-foreground mb-1">CARB</div>
                  <div className="font-mono">45g</div>
                </div>
                <div className="bg-muted/10 p-2 rounded">
                  <div className="text-xs text-muted-foreground mb-1">FAT</div>
                  <div className="font-mono">18g</div>
                </div>
              </div>
            </div>
          </CockpitCard>

          <div className="bg-secondary/10 border border-secondary/30 rounded p-3 flex gap-3 items-start">
             <div className="text-secondary font-mono text-xs pt-0.5">NOTE:</div>
             <p className="text-xs text-muted-foreground">
               This is a simulation. To perform actual AI analysis of your food photos, this application requires backend integration.
             </p>
          </div>
        </div>

        <div className="mt-4">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wide" size="lg">
            <Plus className="mr-2 h-4 w-4" /> ADD TO {mealType.toUpperCase()} LOG
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      {/* Camera View */}
      {!capturedImage && (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
      )}
      
      {capturedImage && (
          <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="Captured" />
      )}

      {/* Camera UI Overlay */}
      <div className="absolute inset-0 z-0 bg-black/10">
        {/* HUD Corners */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/60 rounded-tl-lg" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/60 rounded-tr-lg" />
        <div className="absolute bottom-32 left-8 w-12 h-12 border-b-2 border-l-2 border-primary/60 rounded-bl-lg" />
        <div className="absolute bottom-32 right-8 w-12 h-12 border-b-2 border-r-2 border-primary/60 rounded-br-lg" />
        
        {/* Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-72 h-96 border border-primary/30 rounded-lg relative overflow-hidden backdrop-blur-[2px]">
             <div className="absolute top-1/2 left-0 w-full h-px bg-primary/40" />
             <div className="absolute left-1/2 top-0 h-full w-px bg-primary/40" />
             
             {/* Scanning Effect Overlay */}
             {scanning && (
               <div className="absolute inset-0 bg-primary/10 animate-pulse" />
             )}
           </div>
        </div>
        
        {/* Vertical Scan Line */}
        {scanning && (
            <div className="absolute left-0 top-0 h-full w-1 bg-primary/60 shadow-[0_0_20px_#2ecc71] animate-[scan-vertical_1.5s_ease-in-out_infinite] z-20" />
        )}
      </div>

      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-6 right-6 z-20 text-white hover:bg-black/20"
        onClick={() => window.history.back()}
      >
        <X className="w-8 h-8" />
      </Button>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/90 to-transparent z-10 flex flex-col items-center gap-6">
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="text-xs font-mono text-primary animate-pulse tracking-widest">
            {scanning ? "PROCESSING DATA..." : "TARGET ACQUIRED"}
          </span>
        </div>
        
        <div className="flex items-center gap-8">
            <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full border-white/20 bg-black/40 text-white hover:bg-white/10"
                onClick={triggerFileUpload}
                disabled={scanning}
            >
                <ImageIcon className="w-5 h-5" />
            </Button>

            <Button 
              size="lg" 
              className="h-20 w-20 rounded-full border-4 border-white/80 bg-transparent hover:bg-white/10 hover:scale-105 transition-all p-0 flex items-center justify-center relative group"
              onClick={handleScan}
              disabled={scanning}
            >
              <div className="w-16 h-16 rounded-full bg-white group-hover:scale-90 transition-transform" />
            </Button>

             <div className="w-12 h-12" /> {/* Spacer for balance */}
        </div>
        
        <p className="text-[10px] text-white/60 font-mono uppercase tracking-[0.2em]">
          Tap to Analyze
        </p>
      </div>
    </div>
  );
}