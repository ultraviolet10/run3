"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";

export function ContestEndedTimer() {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Confetti particles
  const confettiColors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  const confettiParticles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    left: Math.random() * 100,
  }));

  return (
    <div className="bg-gray-900 border-t border-gray-700 backdrop-blur-sm relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 opacity-80"
              style={{
                backgroundColor: particle.color,
                left: `${particle.left}%`,
                animation: `confetti-fall ${particle.duration}s ease-out ${particle.delay}s infinite`,
                transform: 'rotate(45deg)',
              }}
            />
          ))}
        </div>
      )}

      <div className="px-4 py-3 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center transition-all duration-200">
            <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
            <h3 className="text-sm font-bold text-white">
              Battle Complete!
            </h3>
            <Trophy className="w-4 h-4 text-yellow-500 ml-2" />
          </div>
        </div>

        {/* Timer Grid - All Zeros */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {['DAYS', 'HRS', 'MIN', 'SEC'].map((label) => (
            <div key={label} className="text-center">
              <div className="relative">
                {/* Background Circle */}
                <div className="w-12 h-12 mx-auto relative">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-800"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-yellow-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray="100, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  
                  {/* Time Value - Always 00 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-yellow-400">
                      00
                    </span>
                  </div>
                </div>
                
                {/* Label */}
                <div className="text-xs text-gray-400 font-medium mt-1">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-xs text-yellow-400 font-medium">
            🎉 Contest has ended! Check out the results above! 🎉
          </p>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
