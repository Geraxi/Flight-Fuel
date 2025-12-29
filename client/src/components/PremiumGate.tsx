import { ReactNode } from 'react';
import { usePremium } from '@/lib/premium';
import { Lock, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

interface PremiumGateProps {
  children: ReactNode;
  featureName: string;
  fallback?: ReactNode;
}

export function PremiumGate({ children, featureName, fallback }: PremiumGateProps) {
  const { isPremium, loading } = usePremium();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-cyan-400/60">Loading...</div>
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e1a]/80 to-[#0a0e1a] z-10 flex flex-col items-center justify-center p-6 rounded-lg">
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 p-4 rounded-full mb-4 border border-amber-500/30">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
        <p className="text-cyan-400/70 text-sm text-center mb-4">
          {featureName} is available with FlightFuel Premium
        </p>
        <button
          onClick={() => setLocation('/upgrade')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
          data-testid="button-upgrade-premium"
        >
          <Sparkles className="w-4 h-4" />
          Upgrade to Premium
        </button>
      </div>
      <div className="blur-sm opacity-50 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export function PremiumBadge({ small = false }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full ${small ? 'text-xs' : 'text-sm'} text-amber-400`}>
      <Sparkles className={small ? 'w-3 h-3' : 'w-4 h-4'} />
      Premium
    </span>
  );
}

export function UpgradePrompt({ compact = false }: { compact?: boolean }) {
  const [, setLocation] = useLocation();

  if (compact) {
    return (
      <button
        onClick={() => setLocation('/upgrade')}
        className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors"
        data-testid="button-upgrade-compact"
      >
        <Sparkles className="w-4 h-4" />
        Upgrade
      </button>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white">Upgrade to Premium</h4>
          <p className="text-sm text-cyan-400/70">Unlock all features</p>
        </div>
        <button
          onClick={() => setLocation('/upgrade')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
          data-testid="button-upgrade"
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}
