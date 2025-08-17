"use client";

import { useState, useEffect } from "react";

type BattleCountdownTimerProps = {
  contestEndTime: Date;
};

export function BattleCountdownTimer({ contestEndTime }: BattleCountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = contestEndTime.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [contestEndTime]);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => {
    const digits = formatNumber(value).split('');
    
    return (
      <div className="flex flex-col items-center">
        <div className="flex space-x-1 mb-1">
          {digits.map((digit, index) => (
            <div
              key={index}
              className="w-8 h-10 bg-white rounded-md flex items-center justify-center shadow-inner border border-gray-200"
            >
              <span className="text-xl font-bold text-gray-700">{digit}</span>
            </div>
          ))}
        </div>
        <span className="text-xs font-medium text-black uppercase tracking-wide">
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-lime-400 px-4 py-4 rounded-t-2xl">
      {/* Label */}
      <div className="text-center mb-3">
        <span className="text-sm font-medium text-black">Battle ends in:</span>
      </div>
      
      {/* Timer Display */}
      <div className="flex items-center justify-center space-x-4">
        <TimeUnit value={timeLeft.days} label="DAYS" />
        
        <div className="text-2xl font-bold text-black pb-4">:</div>
        
        <TimeUnit value={timeLeft.hours} label="HOURS" />
        
        <div className="text-2xl font-bold text-black pb-4">:</div>
        
        <TimeUnit value={timeLeft.minutes} label="MINUTES" />
        
        <div className="text-2xl font-bold text-black pb-4">:</div>
        
        <TimeUnit value={timeLeft.seconds} label="SECONDS" />
      </div>
    </div>
  );
}
