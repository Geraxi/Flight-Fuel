import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plane } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await signup(username, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f35] to-[#0f1419] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-[#1a1f35]/90 border-cyan-500/20 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
            <Plane className="w-16 h-16 text-cyan-400 relative" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FlightFuel</h1>
          <p className="text-cyan-400/80 text-sm">Pilot Performance Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-cyan-400/80 mb-1 block">Username</label>
            <Input
              data-testid="input-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="text-sm text-cyan-400/80 mb-1 block">Password</label>
            <Input
              data-testid="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0a0e1a] border-cyan-500/30 text-white focus:border-cyan-400"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          <Button
            data-testid="button-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </Button>

          <button
            data-testid="button-toggle-mode"
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="w-full text-cyan-400/80 hover:text-cyan-400 text-sm"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </form>
      </Card>
    </div>
  );
}
