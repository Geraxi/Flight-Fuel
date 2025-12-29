import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from './api';

interface PremiumContextType {
  isPremium: boolean;
  subscriptionStatus: string;
  loading: boolean;
  refetch: () => void;
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  subscriptionStatus: 'free',
  loading: true,
  refetch: () => {},
});

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['subscription'],
    queryFn: subscriptionApi.getStatus,
    retry: false,
  });

  const isPremium = data?.status === 'active' || data?.status === 'trialing';
  const subscriptionStatus = data?.status || 'free';

  return (
    <PremiumContext.Provider value={{ isPremium, subscriptionStatus, loading: isLoading, refetch }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  return useContext(PremiumContext);
}

export const PREMIUM_FEATURES = {
  FUEL_SCAN: 'fuel_scan',
  TRAINING_VIDEOS: 'training_videos',
  PROGRESS_ANALYTICS: 'progress_analytics',
  PERSONALIZED_PLANS: 'personalized_plans',
  ADVANCED_METRICS: 'advanced_metrics',
} as const;

export function isPremiumFeature(feature: string): boolean {
  return Object.values(PREMIUM_FEATURES).includes(feature as any);
}
