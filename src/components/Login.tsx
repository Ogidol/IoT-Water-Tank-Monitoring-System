import { useState, React } from "react";
import { Droplets, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { type } from "os";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      if (email === "agricengr@gmail.com" && password === "222956") {
        setMessage({ type: "success", text: "Login successful!" });
        setIsLoading(false);
        setTimeout(() => {
          onLogin();
        }, 1500);
      } else {
        setMessage({ type: "error", text: "Invalid email or password." });
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen relative">
      {/* Water-inspired Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0891b2 0%, #06b6d4 20%, #22d3ee 40%, #67e8f9 70%, #e0f2fe 100%)",
        }}
      />

      {/* Abstract Wave Patterns */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="loginWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0fdfa" />
            </linearGradient>
            <linearGradient id="loginWave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Soft wave patterns */}
          <path
            d="M0,150 C300,50 600,250 900,150 C1000,100 1100,200 1200,150 L1200,0 L0,0 Z"
            fill="url(#loginWave1)"
          />
          <path
            d="M0,350 C300,250 600,450 900,350 C1000,300 1100,400 1200,350 L1200,0 L0,0 Z"
            fill="url(#loginWave2)"
            opacity="0.1"
          />
          <path
            d="M0,550 C400,450 800,650 1200,550 L1200,800 L0,800 Z"
            fill="url(#loginWave1)"
          />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-3 h-3 bg-white/20 rounded-full"
              style={{
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Content - Fixed positioning and padding */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* User Information Banner - Now with proper spacing */}
          <div
            className="mb-8 backdrop-blur-lg rounded-2xl p-6 border border-white/30 text-center animate-fade-in"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #0891b2, #06b6d4)",
                  boxShadow: "0 4px 16px rgba(8, 145, 178, 0.3)",
                }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="text-xl font-bold text-gray-800 mb-1">
                  Idris Ogundele Olawale
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Matric No: 222956
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  System Administrator
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div
            className="backdrop-blur-lg rounded-3xl p-8 border border-white/30 animate-fade-in"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              boxShadow:
                "0 25px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(8, 145, 178, 0.2)",
              animationDelay: "0.2s",
              animationFillMode: "both",
            }}
          >
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                style={{
                  background: "linear-gradient(135deg, #0891b2, #06b6d4)",
                  boxShadow: "0 8px 24px rgba(8, 145, 178, 0.3)",
                }}
              >
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                IoT Water Tank Monitor
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to access your monitoring dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    autoComplete="username"
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 bg-white/70 backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500 bg-white/70 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-gray-600 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-white border-none relative overflow-hidden group transition-all duration-300 hover:scale-[1.02] transform"
                style={{
                  background: "linear-gradient(135deg, #0891b2, #06b6d4)",
                  boxShadow: "0 8px 24px rgba(8, 145, 178, 0.3)",
                }}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span className="relative z-10 font-semibold">
                      Sign In to Dashboard
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
              </Button>
              {message && (
                <div
                  className={`text-sm mt-2 text-center ${
                    message.type === "error" ? "text-red-600" : "text-green-600"
                  } font-medium`}
                >
                  {message.text}
                </div>
              )}
            </form>

            {/* Quick Access Info */}
            <div className="mt-8 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #67e8f9)",
                  }}
                >
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-cyan-800">
                    Quick Access
                  </h4>
                  <p className="text-xs text-cyan-600">
                    Real-time water level monitoring & alerts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Credit */}
          <div
            className="mt-8 text-center animate-fade-in"
            style={{ animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <p
              className="text-white/90 text-sm backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-white/20 font-medium"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
              }}
            >
              © 2025 IoT Water Tank Monitor • Designed by{" "}
              <span className="font-bold">Idris Olawale</span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx="true">{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
