"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

type ContestTimerProps = {
  contestStartTime: Date;
};

type TimeUnit = {
  value: number;
  label: string;
  max: number;
};

export function ContestTimer({ contestStartTime }: ContestTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const contestTime = contestStartTime.getTime();
      const difference = contestTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        
        // Trigger animation on seconds change
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 200);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [contestStartTime]);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  const getProgressPercentage = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const timeUnits: TimeUnit[] = [
    { value: timeLeft.days, label: "DAYS", max: 365 },
    { value: timeLeft.hours, label: "HRS", max: 24 },
    { value: timeLeft.minutes, label: "MIN", max: 60 },
    { value: timeLeft.seconds, label: "SEC", max: 60 },
  ];

  return (
    <div className="bg-gray-900 border-t border-gray-700 backdrop-blur-sm">
      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-center mb-3">
          <div className={`flex items-center transition-all duration-200 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
            <Zap className="w-4 h-4 text-green-500 mr-2 animate-pulse" />
            <h3 className="text-sm font-bold text-white">
              Battle Starts In
            </h3>
            <Zap className="w-4 h-4 text-green-500 ml-2 animate-pulse" />
          </div>
        </div>

        {/* Timer Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {timeUnits.map((unit, _index) => (
            <div key={unit.label} className="text-center">
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
                      className="text-green-500 transition-all duration-1000 ease-out"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${getProgressPercentage(unit.value, unit.max)}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  
                  {/* Time Value */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm font-bold text-white transition-all duration-200 ${
                      isAnimating && unit.label === 'SEC' ? 'scale-110 text-green-400' : ''
                    }`}>
                      {formatTime(unit.value)}
                    </span>
                  </div>
                </div>
                
                {/* Label */}
                <div className="text-xs text-gray-400 font-medium mt-1">
                  {unit.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-xs text-gray-400 animate-pulse">
            ⚡ Get ready for the ultimate creator battle! ⚡
          </p>
        </div>
      </div>
    </div>
  );
}
