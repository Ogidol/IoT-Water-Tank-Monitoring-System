import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log("SplashScreen mounted, setting up timer...");

    // Set up the transition timer
    const timer = setTimeout(() => {
      console.log("Timer fired, starting transition...");
      setIsVisible(false);

      // Give time for fade out animation, then call onComplete
      setTimeout(() => {
        console.log("Calling onComplete...");
        onComplete();
      }, 500);
    }, 3000); // Show splash for 3 seconds

    // Cleanup function
    return () => {
      console.log("SplashScreen cleanup, clearing timer...");
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Add click handler for manual skip (for testing)
  const handleClick = () => {
    console.log("Manual skip triggered...");
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 cursor-pointer ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClick}
      style={{
        background:
          "linear-gradient(135deg, #0891b2 0%, #06b6d4 25%, #22d3ee 50%, #67e8f9 75%, #a5f3fc 100%)",
      }}
    >
      {/* Animated Water Waves Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
              <stop offset="100%" stopColor="rgba(34, 211, 238, 0.1)" />
            </linearGradient>
          </defs>

          {/* Animated wave paths */}
          <path
            d="M0,200 C300,100 600,300 900,200 C1000,150 1100,250 1200,200 L1200,0 L0,0 Z"
            fill="url(#wave1)"
            className="animate-pulse"
          />
          <path
            d="M0,400 C300,300 600,500 900,400 C1000,350 1100,450 1200,400 L1200,0 L0,0 Z"
            fill="url(#wave2)"
            className="animate-pulse"
          />
          <path
            d="M0,600 C400,500 800,700 1200,600 L1200,0 L0,0 Z"
            fill="rgba(255, 255, 255, 0.05)"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Floating Water Droplets */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Droplets
              className="w-4 h-4 text-white/30"
              style={{
                filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Water Tank Logo with Ripple Animation */}
        <div className="relative mb-8">
          {/* Ripple effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
            <div
              className="absolute w-40 h-40 rounded-full border-2 border-white/20 animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute w-48 h-48 rounded-full border border-white/10 animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Tank Logo */}
          <div
            className="relative w-24 h-24 mx-auto bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-bounce"
            style={{
              background: "linear-gradient(135deg, #ffffff, #f0f9ff)",
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(6, 182, 212, 0.4)",
              animationDuration: "2s",
            }}
          >
            {/* Water Tank Icon */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="text-cyan-600"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            >
              {/* Tank body */}
              <rect
                x="12"
                y="16"
                width="24"
                height="20"
                rx="2"
                ry="2"
                fill="currentColor"
                fillOpacity="0.1"
                stroke="currentColor"
                strokeWidth="2"
              />

              {/* Water level */}
              <rect
                x="14"
                y="20"
                width="20"
                height="12"
                rx="1"
                ry="1"
                fill="currentColor"
                fillOpacity="0.6"
                className="animate-pulse"
              />

              {/* Tank top */}
              <rect
                x="10"
                y="14"
                width="28"
                height="4"
                rx="2"
                ry="2"
                fill="currentColor"
              />

              {/* Sensor line */}
              <line
                x1="24"
                y1="8"
                x2="24"
                y2="14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Sensor */}
              <circle cx="24" cy="6" r="2" fill="currentColor" />

              {/* Water droplets with individual animation delays */}
              <circle
                cx="18"
                cy="26"
                r="1"
                fill="currentColor"
                fillOpacity="0.8"
                className="animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <circle
                cx="24"
                cy="24"
                r="1"
                fill="currentColor"
                fillOpacity="0.8"
                className="animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <circle
                cx="30"
                cy="28"
                r="1"
                fill="currentColor"
                fillOpacity="0.8"
                className="animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
            </svg>
          </div>
        </div>

        {/* App Name with Typing Animation */}
        <div className="mb-6">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-2 animate-fade-in"
            style={{
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              animationDelay: "0.5s",
              animationFillMode: "both",
            }}
          >
            IoT Water Tank Monitor
          </h1>
          <p
            className="text-lg text-white/90 animate-fade-in"
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              animationDelay: "1s",
              animationFillMode: "both",
            }}
          >
            Smart Monitoring • Real-time Data • IoT Enabled
          </p>
        </div>

        {/* Loading Animation */}
        <div
          className="flex items-center justify-center space-x-2 animate-fade-in"
          style={{
            animationDelay: "1.5s",
            animationFillMode: "both",
          }}
        >
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <span className="text-white/80 text-sm ml-3">Loading...</span>
        </div>

        {/* Skip instruction */}
        <div
          className="mt-8 animate-fade-in"
          style={{
            animationDelay: "2s",
            animationFillMode: "both",
          }}
        >
          <p className="text-white/60 text-xs">Click anywhere to skip</p>
        </div>

        {/* Version and Credit */}
        <div
          className="mt-8 animate-fade-in"
          style={{
            animationDelay: "2.5s",
            animationFillMode: "both",
          }}
        >
          <p className="text-white/60 text-sm">
            Version 1.0 • Developed by{" "}
            <span className="font-semibold text-white/80">Idris Olawale</span>
          </p>
          <p className="text-white/50 text-xs mt-1">Matric No: 222956</p>
        </div>
      </div>

      {/* Progress indicator at bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/60 rounded-full transition-all duration-300"
            style={{
              width: isVisible ? "100%" : "0%",
              transition: "width 3s linear",
            }}
          />
        </div>
      </div>

      {/* Custom CSS for all animations */}
      <style>{`
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
