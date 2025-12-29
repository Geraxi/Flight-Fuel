import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { useLocation } from 'wouter';
import { subscriptionApi } from '@/lib/api';
import { usePremium } from '@/lib/premium';

const FEATURES = [
  { icon: Zap, title: 'AI Fuel Scan', description: 'Instantly analyze meals with camera' },
  { icon: Shield, title: 'Advanced Analytics', description: 'Deep insights into your performance' },
  { icon: Crown, title: 'Personalized Plans', description: 'Custom training and nutrition plans' },
  { icon: Sparkles, title: 'Exercise Video Library', description: 'Full access to workout videos' },
];

export default function Upgrade() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const { isPremium, subscriptionStatus } = usePremium();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: subscriptionApi.getProducts,
  });

  const product = products?.data?.[0];
  const monthlyPrice = product?.prices?.find((p: any) => p.recurring?.interval === 'month');
  const yearlyPrice = product?.prices?.find((p: any) => p.recurring?.interval === 'year');

  const handleCheckout = async () => {
    const priceId = selectedPlan === 'yearly' ? yearlyPrice?.id : monthlyPrice?.id;
    if (!priceId) return;

    setLoading(true);
    try {
      const { url } = await subscriptionApi.checkout(priceId);
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { url } = await subscriptionApi.portal();
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setLocation('/profile')}
            className="p-2 rounded-lg bg-[#1a2235]/60 border border-cyan-500/20 text-cyan-400"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Subscription</h1>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl p-6 border border-amber-500/30 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/30 rounded-xl">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">FlightFuel Premium</h2>
              <p className="text-amber-400/80 text-sm capitalize">{subscriptionStatus}</p>
            </div>
          </div>
          <p className="text-cyan-400/70 text-sm mb-4">You have full access to all premium features.</p>
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="w-full py-3 bg-[#1a2235]/80 text-white font-medium rounded-xl border border-cyan-500/20 hover:bg-[#1a2235] transition-all disabled:opacity-50"
            data-testid="button-manage-subscription"
          >
            {loading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setLocation('/profile')}
          className="p-2 rounded-lg bg-[#1a2235]/60 border border-cyan-500/20 text-cyan-400"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white">Upgrade to Premium</h1>
      </div>

      <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-2xl p-6 border border-amber-500/20 mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <h2 className="text-lg font-bold text-white">FlightFuel Premium</h2>
        </div>
        <p className="text-center text-cyan-400/70 text-sm">Unlock your full potential with premium features designed for pilots.</p>
      </div>

      <div className="space-y-3 mb-6">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex items-center gap-4 p-4 bg-[#1a2235]/60 rounded-xl border border-cyan-500/10">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <feature.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{feature.title}</h3>
              <p className="text-sm text-cyan-400/60">{feature.description}</p>
            </div>
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              selectedPlan === 'monthly'
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-cyan-500/20 bg-[#1a2235]/60'
            }`}
            data-testid="button-plan-monthly"
          >
            <div className="text-sm text-cyan-400/70 mb-1">Monthly</div>
            <div className="text-xl font-bold text-white">
              ${monthlyPrice ? (monthlyPrice.unit_amount / 100).toFixed(2) : '49.99'}
              <span className="text-sm font-normal text-cyan-400/60">/mo</span>
            </div>
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all relative ${
              selectedPlan === 'yearly'
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-cyan-500/20 bg-[#1a2235]/60'
            }`}
            data-testid="button-plan-yearly"
          >
            <div className="absolute -top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
              Save 33%
            </div>
            <div className="text-sm text-amber-400/70 mb-1">Yearly</div>
            <div className="text-xl font-bold text-white">
              ${yearlyPrice ? (yearlyPrice.unit_amount / 100).toFixed(2) : '399.99'}
              <span className="text-sm font-normal text-cyan-400/60">/yr</span>
            </div>
          </button>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading || !product}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="button-checkout"
      >
        {loading ? 'Processing...' : 'Start Premium'}
      </button>

      <button
        onClick={() => setLocation('/')}
        className="w-full py-3 mt-3 text-cyan-400/70 hover:text-cyan-400 text-sm font-medium transition-colors"
        data-testid="button-continue-free"
      >
        Continue with limited features
      </button>

      <p className="text-center text-cyan-400/50 text-xs mt-4">
        Cancel anytime. Secure payment powered by Stripe.
      </p>
    </div>
  );
}
