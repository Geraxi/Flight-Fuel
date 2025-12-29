import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

export interface UserProfile {
  id: string;
  userId: string;
  height: number;
  weight: number;
  age: number;
  activityLevel: string;
  trainingFreq: number;
  goal: string;
  nextMedicalDate?: string | null;
  restingHeartRate?: number | null;
  dietType?: string | null;
  allergies?: string[] | null;
  foodRestrictions?: string | null;
  trainingLocation?: string | null;
  trainingStyle?: string | null;
  equipmentAccess?: string[] | null;
  healthConditions?: string | null;
  injuries?: string | null;
  sleepQuality?: string | null;
}

interface AuthContextType {
  user: { id: string; username: string } | null;
  loading: boolean;
  hasProfile: boolean;
  profileLoading: boolean;
  profile: UserProfile | null;
  refetchProfile: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      checkProfile();
    } else if (clerkLoaded && !clerkUser) {
      setProfileLoading(false);
      setHasProfile(false);
      setProfile(null);
    }
  }, [clerkLoaded, clerkUser]);

  const checkProfile = async () => {
    setProfileLoading(true);
    try {
      const token = await getToken();
      const response = await fetch("/api/profile", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setHasProfile(true);
      } else {
        setHasProfile(false);
        setProfile(null);
      }
    } catch (error) {
      setHasProfile(false);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const refetchProfile = async () => {
    await checkProfile();
  };

  const user = clerkUser
    ? {
        id: clerkUser.id,
        username: clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress || "User",
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: !clerkLoaded,
        hasProfile,
        profileLoading,
        profile,
        refetchProfile,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
