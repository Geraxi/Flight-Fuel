import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasProfile: boolean;
  profileLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        await checkProfile();
      } else {
        setUser(null);
        setHasProfile(false);
        setProfileLoading(false);
      }
    } catch (error) {
      setUser(null);
      setHasProfile(false);
      setProfileLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await fetch("/api/profile", {
        credentials: "include",
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

  const login = async (username: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    setUser(data);
    await checkProfile();
  };

  const signup = async (username: string, password: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const data = await response.json();
    setUser(data);
    setHasProfile(false);
    setProfileLoading(false);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setHasProfile(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasProfile, profileLoading, login, signup, logout, refetchProfile }}>
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
