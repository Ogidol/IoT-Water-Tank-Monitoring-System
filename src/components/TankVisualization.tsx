import React, { useEffect, useState } from "react";
import { Droplets, Wifi, WifiOff, Zap } from "lucide-react";

interface TankVisualizationProps {
  waterLevel: number;
  tankCapacity: number;
  pumpStatus: "ON" | "OFF";
  connectionStatus: "connected" | "disconnected" | "error";
  temperature?: number;
  distance?: number;
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function TankVisualization({
  waterLevel,
  tankCapacity,
  pumpStatus,
  connectionStatus,
  temperature,
  distance,
  size = "large",
  className = "",
}: TankVisualizationProps) {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Track screen width for responsive design
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation loop for water movement
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360);
    }, 50); // Smooth 50ms updates

    return () => clearInterval(interval);
  }, []);

  // Responsive tank dimensions based on screen size and size prop
  const getResponsiveDimensions = () => {
    const is320 = screenWidth <= 320;
    const is375 = screenWidth <= 375;
    const isSmallMobile = screenWidth <= 480;

    if (is320) {
      return {
        small: { width: 140, height: 180 },
        medium: { width: 160, height: 200 },
        large: { width: 180, height: 220 },
      };
    }

    if (is375) {
      return {
        small: { width: 160, height: 200 },
        medium: { width: 180, height: 220 },
        large: { width: 200, height: 240 },
      };
    }

    if (isSmallMobile) {
      return {
        small: { width: 180, height: 220 },
        medium: { width: 220, height: 280 },
        large: { width: 260, height: 320 },
      };
    }

    // Default dimensions for larger screens
    return {
      small: { width: 200, height: 250 },
      medium: { width: 280, height: 320 },
      large: { width: 360, height: 400 },
    };
  };

  const dimensions = getResponsiveDimensions();
  const { width: tankWidth, height: tankHeight } = dimensions[size];

  // Calculate water height based on percentage
  // Margin for tank top/bottom spacing (optional, just for visuals)
  const topMargin = 20; // space at the top of the tank
  const bottomMargin = 10; // space at the bottom of the tank

  // Calculate the actual water height based on percentage
  const waterHeight =
    (waterLevel / 100) * (tankHeight - topMargin - bottomMargin);

  // Position from bottom of the tank container
  const waterBottomPosition = bottomMargin; // starts from bottomMargin

  // Current volume in liters
  const currentVolume = Math.round((tankCapacity * waterLevel) / 100);

  // Dynamic water color based on level
  const getWaterColor = (level: number) => {
    if (level < 20)
      return { primary: "#ef4444", secondary: "#fca5a5", accent: "#fee2e2" }; // Red
    if (level < 40)
      return { primary: "#f59e0b", secondary: "#fbbf24", accent: "#fef3c7" }; // Orange
    if (level < 70)
      return { primary: "#3b82f6", secondary: "#60a5fa", accent: "#dbeafe" }; // Blue
    return { primary: "#10b981", secondary: "#34d399", accent: "#d1fae5" }; // Green
  };

  const waterColors = getWaterColor(waterLevel);

  // Wave animation styles
  const waveOffset1 = Math.sin((animationPhase * Math.PI) / 180) * 8;
  const waveOffset2 = Math.cos(((animationPhase + 120) * Math.PI) / 180) * 6;
  const waveOffset3 = Math.sin(((animationPhase + 240) * Math.PI) / 180) * 4;

  // Water surface ripple effect
  const rippleScale = 1 + Math.sin((animationPhase * 2 * Math.PI) / 180) * 0.02;

  // Responsive text sizes
  const getTextSizes = () => {
    if (screenWidth <= 320) {
      return {
        mainValue: "text-2xl",
        title: "text-xs",
        info: "text-xs",
        badge: "text-xs",
        sensor: "text-xs",
      };
    }
    if (screenWidth <= 375) {
      return {
        mainValue: "text-3xl",
        title: "text-sm",
        info: "text-sm",
        badge: "text-xs",
        sensor: "text-xs",
      };
    }
    return {
      mainValue: "text-4xl",
      title: "text-sm",
      info: "text-sm",
      badge: "text-xs",
      sensor: "text-sm",
    };
  };

  const textSizes = getTextSizes();

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        screenWidth <= 320 ? "p-2" : "p-6"
      } ${className}`}
    >
      {/* Tank Container */}
      <div
        className="relative mx-auto mb-4"
        style={{
          width: tankWidth + 40,
          height: tankHeight + 60,
          perspective: "1000px",
        }}
      >
        {/* Tank Base Shadow */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          style={{
            width: tankWidth * 0.9,
            height: 12,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Main Tank Structure */}
        <div
          className="relative mx-auto bg-gradient-to-b from-white/40 to-white/20 rounded-2xl border border-white/30 overflow-hidden"
          style={{
            width: tankWidth,
            height: tankHeight,
            backdropFilter: "blur(10px)",
            boxShadow: `
              inset 0 2px 10px rgba(255,255,255,0.3),
              inset 0 -2px 10px rgba(0,0,0,0.1),
              0 8px 32px rgba(59, 130, 246, 0.15),
              0 0 0 1px rgba(255,255,255,0.1)
            `,
            transform: "rotateX(5deg) rotateY(-2deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Tank Capacity Markers - Hide on very small screens */}
          {screenWidth > 320 && (
            <div className="absolute right-2 top-4 bottom-4 w-8 flex flex-col justify-between text-xs text-gray-600">
              {[100, 75, 50, 25, 0].map((mark) => (
                <div key={mark} className="flex items-center">
                  <div className="w-2 h-px bg-gray-400 mr-1" />
                  <span className="text-[10px] font-medium">{mark}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Water Container with 3D effect */}
          <div
            className="absolute bottom-4 left-4 right-4 rounded-xl overflow-hidden"
            style={{
              height: Math.max(waterHeight, 0),
              bottom: waterBottomPosition,
              transform: "translateZ(10px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Animated Water Body */}
            <div
              className="absolute inset-0 rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(180deg, 
                  ${waterColors.accent} 0%,
                  ${waterColors.secondary} 30%,
                  ${waterColors.primary} 70%,
                  ${waterColors.primary} 100%)`,
                animation: "waterShimmer 3s ease-in-out infinite",
                opacity: 0.8,
              }}
            >
              {/* Water Surface Waves */}
              <div
                className="absolute top-0 left-0 right-0 h-8 overflow-hidden"
                style={{
                  transform: `scale(${rippleScale})`,
                  transformOrigin: "center",
                }}
              >
                {/* Wave Layer 1 - Large waves */}
                <div
                  className="absolute top-0 w-full h-full opacity-60"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, 
                      rgba(255,255,255,0.4) 0%, 
                      transparent 70%)`,
                    transform: `translateX(${waveOffset1}px) translateY(-2px)`,
                    borderRadius: "50%",
                  }}
                />

                {/* Wave Layer 2 - Medium waves */}
                <div
                  className="absolute top-1 w-full h-full opacity-40"
                  style={{
                    background: `radial-gradient(ellipse at 30% 0%, 
                      rgba(255,255,255,0.3) 0%, 
                      transparent 60%)`,
                    transform: `translateX(${waveOffset2}px)`,
                    borderRadius: "50%",
                  }}
                />

                {/* Wave Layer 3 - Small ripples */}
                <div
                  className="absolute top-2 w-full h-full opacity-20"
                  style={{
                    background: `radial-gradient(ellipse at 70% 0%, 
                      rgba(255,255,255,0.5) 0%, 
                      transparent 50%)`,
                    transform: `translateX(${waveOffset3}px)`,
                    borderRadius: "50%",
                  }}
                />
              </div>

              {/* Water Movement Patterns - Front to Back */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Moving water particles - Reduce on small screens */}
                {[...Array(screenWidth <= 320 ? 3 : 6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      left: `${15 + i * 12}%`,
                      top: `${
                        30 +
                        Math.sin(((animationPhase + i * 60) * Math.PI) / 180) *
                          20
                      }%`,
                      transform: `translateZ(${
                        Math.cos(((animationPhase + i * 45) * Math.PI) / 180) *
                        15
                      }px)`,
                      opacity:
                        0.3 +
                        Math.sin(((animationPhase + i * 30) * Math.PI) / 180) *
                          0.2,
                      animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
                    }}
                  />
                ))}

                {/* Depth layers for 3D effect */}
                <div
                  className="absolute inset-0 rounded-xl opacity-10"
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent 0%, 
                      rgba(0,0,0,0.1) 50%, 
                      transparent 100%)`,
                    transform: "translateZ(-5px)",
                  }}
                />
              </div>

              {/* Water Level Indicator Line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-white/50 shadow-lg"
                style={{
                  transform: `translateY(${
                    Math.sin((animationPhase * Math.PI) / 180) * 2
                  }px)`,
                  boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                }}
              />
            </div>
          </div>

          {/* Tank Frame Overlay */}
          <div
            className="absolute inset-2 rounded-xl pointer-events-none"
            style={{
              border: "2px solid rgba(255,255,255,0.2)",
              background:
                "linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.05) 50%, transparent 52%)",
            }}
          />
        </div>

        {/* Ultrasonic Sensor at Top - Smaller on mobile */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div
            className={`${
              screenWidth <= 320 ? "w-6 h-4" : "w-8 h-6"
            } bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg shadow-lg border border-gray-600`}
            style={{
              boxShadow:
                "0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)",
            }}
          >
            <div
              className={`${
                screenWidth <= 320 ? "w-2 h-2 mt-0.5" : "w-3 h-3 mt-1"
              } bg-blue-500 rounded-full mx-auto animate-pulse shadow-lg shadow-blue-500/50`}
            />
          </div>

          {/* Sensor Beam Visualization */}
          {connectionStatus === "connected" && (
            <div
              className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0.5 bg-gradient-to-b from-blue-400 to-transparent opacity-60"
              style={{
                height: Math.max(20, tankHeight - waterHeight - 40),
                boxShadow: "0 0 4px #3b82f6",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          )}
        </div>

        {/* Pump Inlet Pipe - Smaller on mobile */}
        <div className="absolute -top-4 -right-2">
          <div
            className={`${
              screenWidth <= 320 ? "w-3 h-12" : "w-4 h-16"
            } bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-lg`}
            style={{
              transform: "rotate(15deg)",
              transformOrigin: "bottom",
            }}
          >
            {/* Pump Status Indicator */}
            <div
              className={`absolute ${
                screenWidth <= 320
                  ? "-right-1 top-1 w-4 h-2"
                  : "-right-2 top-2 w-6 h-3"
              } rounded-full border-2 ${
                pumpStatus === "ON"
                  ? "bg-green-400 border-green-500 shadow-green-400/50"
                  : "bg-red-400 border-red-500 shadow-red-400/50"
              } shadow-lg flex items-center justify-center`}
            >
              <Zap
                className={`${screenWidth <= 320 ? "w-1.5 h-1.5" : "w-2 h-2"} ${
                  pumpStatus === "ON"
                    ? "text-white animate-pulse"
                    : "text-white"
                }`}
              />
            </div>

            {/* Animated water flow when pump is on */}
            {pumpStatus === "ON" && (
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-2 bg-blue-400 opacity-60 rounded-full"
                    style={{
                      animation: `waterFlow 0.8s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                      top: `${i * 20}%`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tank Information Display - Responsive layout */}
      <div
        className={`text-center ${
          screenWidth <= 320 ? "space-y-2" : "space-y-3"
        } w-full`}
      >
        {/* Main Water Level Display */}
        <div className="space-y-1">
          <div
            className={`${textSizes.mainValue} font-bold text-gray-800 drop-shadow-sm`}
          >
            {waterLevel}%
          </div>
          <div
            className={`${textSizes.title} font-semibold text-blue-600 uppercase tracking-widest`}
          >
            Water Level
          </div>
        </div>

        {/* Volume and Connection Info - Stack on very small screens */}
        <div
          className={`flex ${
            screenWidth <= 320
              ? "flex-col space-y-2"
              : "items-center justify-center space-x-4"
          } ${textSizes.info}`}
        >
          <div className="flex items-center justify-center space-x-1">
            <Droplets
              className={`${
                screenWidth <= 320 ? "w-3 h-3" : "w-4 h-4"
              } text-blue-500`}
            />
            <span className="font-medium text-gray-700">
              {currentVolume}L / {tankCapacity}L
            </span>
          </div>

          <div className="flex items-center justify-center space-x-1">
            {connectionStatus === "connected" ? (
              <Wifi
                className={`${
                  screenWidth <= 320 ? "w-3 h-3" : "w-4 h-4"
                } text-green-500`}
              />
            ) : (
              <WifiOff
                className={`${
                  screenWidth <= 320 ? "w-3 h-3" : "w-4 h-4"
                } text-red-500`}
              />
            )}
            <span className={`${textSizes.sensor} text-gray-600`}>
              {connectionStatus === "connected" ? "ESP8266 Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Additional Sensor Data - Hide some on very small screens */}
        {(temperature || distance) && screenWidth > 320 && (
          <div className="flex justify-center space-x-4 text-xs text-gray-600">
            {temperature && (
              <div className="flex items-center space-x-1">
                <span>🌡️</span>
                <span>{temperature}°C</span>
              </div>
            )}
            {distance && (
              <div className="flex items-center space-x-1">
                <span>📏</span>
                <span>{distance}cm</span>
              </div>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className="flex justify-center">
          <div
            className={`${
              screenWidth <= 320 ? "px-2 py-1" : "px-4 py-2"
            } rounded-full ${textSizes.badge} font-semibold border-2 ${
              waterLevel < 20
                ? "bg-red-100 text-red-800 border-red-300"
                : waterLevel < 40
                ? "bg-orange-100 text-orange-800 border-orange-300"
                : waterLevel < 70
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-green-100 text-green-800 border-green-300"
            }`}
          >
            {waterLevel < 20
              ? "🚨 Critical Level"
              : waterLevel < 40
              ? "⚠️ Low Level"
              : waterLevel < 70
              ? "💧 Normal Level"
              : "✅ Optimal Level"}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes waterShimmer {
          0%,
          100% {
            filter: brightness(1) saturate(1);
          }
          50% {
            filter: brightness(1.1) saturate(1.2);
          }
        }

        @keyframes waterFlow {
          0% {
            transform: translateY(100%) scaleY(0.5);
            opacity: 0;
          }
          50% {
            transform: translateY(50%) scaleY(1);
            opacity: 1;
          }
          100% {
            transform: translateY(0%) scaleY(0.5);
            opacity: 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-3px) translateX(2px);
          }
          50% {
            transform: translateY(-1px) translateX(-1px);
          }
          75% {
            transform: translateY(-4px) translateX(1px);
          }
        }

        /* Mobile specific optimizations */
        @media (max-width: 320px) {
          .tank-visualization-container {
            padding: 0.5rem;
          }

          .space-y-3 > * + * {
            margin-top: 0.5rem;
          }

          .space-x-4 > * + * {
            margin-left: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
