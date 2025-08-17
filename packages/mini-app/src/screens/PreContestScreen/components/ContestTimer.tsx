"use client";

import { useState, useEffect } from "react";

type ContestTimerProps = {
  contestStartTime: Date;
};

export function ContestTimer({ contestStartTime }: ContestTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [contestStartTime]);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  // Split each time unit into individual digits
  const getDigits = (value: number) => {
    const formatted = formatTime(value);
    return [formatted[0], formatted[1]];
  };

  return (
    <div className="bg-lime-400 px-4 py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-black font-syne">
          Battle starts in:
        </h3>
      </div>

      {/* Timer Display */}
      <div className="flex items-center justify-center space-x-1 mb-3">
        {/* Days */}
        <div className="flex space-x-1">
          {getDigits(timeLeft.days).map((digit, index) => (
            <div key={`day-${index}`} className="w-8 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-xl font-bold text-black font-syne">{digit}</span>
            </div>
          ))}
        </div>
        
        {/* Separator */}
        <div className="flex flex-col space-y-1 mx-2">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>

        {/* Hours */}
        <div className="flex space-x-1">
          {getDigits(timeLeft.hours).map((digit, index) => (
            <div key={`hour-${index}`} className="w-8 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-xl font-bold text-black font-syne">{digit}</span>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="flex flex-col space-y-1 mx-2">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>

        {/* Minutes */}
        <div className="flex space-x-1">
          {getDigits(timeLeft.minutes).map((digit, index) => (
            <div key={`minute-${index}`} className="w-8 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-xl font-bold text-black font-syne">{digit}</span>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="flex flex-col space-y-1 mx-2">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1 bg-black rounded-full"></div>
        </div>

        {/* Seconds */}
        <div className="flex space-x-1">
          {getDigits(timeLeft.seconds).map((digit, index) => (
            <div key={`second-${index}`} className="w-8 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-xl font-bold text-black font-syne">{digit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-center space-x-8">
        <span className="text-xs font-bold text-black font-syne">DAYS</span>
        <span className="text-xs font-bold text-black font-syne">HOURS</span>
        <span className="text-xs font-bold text-black font-syne">MINUTES</span>
        <span className="text-xs font-bold text-black font-syne">SECONDS</span>
      </div>
    </div>
  );
}
