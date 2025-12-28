import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";

interface AuthContextType {
  user: { id: string; username: string } | null;
  loading: boolean;
  hasProfile: boolean;
  profileLoading: boolean;
  refetchProfile: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      checkProfile();
    } else if (clerkLoaded && !clerkUser) {
      setProfileLoading(false);
      setHasProfile(false);
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
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      setHasProfile(false);
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
