"use client";

import { useState, useRef } from "react";
import { ProfileData } from "~/types/profile";

type CreatorCardProps = {
  creator: ProfileData;
};

// Up Triangle Icon Component
const UpTriangleIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 3L10 9H2L6 3Z" fill="#22c55e" />
  </svg>
);

// Green Arrow Icon Component
const GreenArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="#22c55e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="rotate(-90 8 8)"
    />
  </svg>
);

// Mock top holders data - in a real app this would come from the API
const mockTopHolders = [
  { id: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
  { id: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
  { id: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
];

export function CreatorCard({ creator }: CreatorCardProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleCardClick = () => {
    window.open(
      `https://zora.co/${creator.profile?.handle}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentPage < 1) {
        setCurrentPage(1);
      } else if (diffX < 0 && currentPage > 0) {
        setCurrentPage(0);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const endX = e.clientX;
    const diffX = startX.current - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && currentPage < 1) {
        setCurrentPage(1);
      } else if (diffX < 0 && currentPage > 0) {
        setCurrentPage(0);
      }
    }
  };

  if (!creator.profile) return null;

  // Use real data from Zora profile or fallback values
  const marketCap = creator.profile.creatorCoin?.marketCap || "0";

  // Format market cap for display
  const formatMarketCap = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(0)} M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)} K`;
    }
    return `$${num.toFixed(0)}`;
  };

  const renderPage1 = () => (
    <>
      {/* Profile Section */}
      <div className="flex items-start space-x-2 mb-3">
        <div className="w-12 h-12 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0">
          <img
            src={
              creator.profile?.avatar?.medium ||
              creator.profile?.avatar?.small ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            alt={creator.profile?.displayName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-0.5">
            <h3 className="font-bold text-black text-base truncate">
              {creator.profile?.displayName || "Creator"}
            </h3>
            <button
              onClick={handleCardClick}
              className="hover:scale-110 transition-transform"
            >
              <GreenArrowIcon />
            </button>
          </div>
          <p className="text-gray-600 text-xs mb-1 truncate">
            @{creator.profile?.handle || "creator"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Market Cap */}
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            Market Cap
          </span>
          <div className="flex items-center space-x-0.5">
            <UpTriangleIcon />
            <span className="text-sm font-bold text-green-500">
              {formatMarketCap(marketCap)}
            </span>
          </div>
        </div>

        {/* Top Holders */}
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            Top Holders
          </span>
          <div className="flex -space-x-0.5">
            {mockTopHolders.map((holder, index) => (
              <img
                key={holder.id}
                src={holder.avatar}
                alt={`Holder ${holder.id}`}
                className="w-5 h-5 rounded-full border-1 border-white"
                style={{ zIndex: mockTopHolders.length - index }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderPage2 = () => (
    <>
      {/* Profile Section - Simplified */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-10 h-10 rounded-full border-2 border-gray-200 overflow-hidden flex-shrink-0">
          <img
            src={
              creator.profile?.avatar?.medium ||
              creator.profile?.avatar?.small ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            alt={creator.profile?.displayName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-black text-sm truncate">
            {creator.profile?.displayName || "Creator"}
          </h3>
          <p className="text-gray-500 text-xs">Battle Stats</p>
        </div>
      </div>

      {/* Battle Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Total Trades */}
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            Total Trades
          </span>
          <span className="text-sm font-bold text-blue-500">1,247</span>
        </div>

        {/* Volume */}
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            24h Volume
          </span>
          <span className="text-sm font-bold text-purple-500">$12.4K</span>
        </div>

        {/* Supporters */}
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            Supporters
          </span>
          <span className="text-sm font-bold text-orange-500">89</span>
        </div>

        {/* Win Rate */}
        <div className="bg-gray-50 rounded-lg p-2">
          <span className="text-xs text-gray-500 font-medium block mb-1">
            Win Rate
          </span>
          <span className="text-sm font-bold text-green-500">73%</span>
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all relative mx-3 mb-2 border border-gray-200 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        clipPath: "polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Card Content */}
      <div className="min-h-[120px]">
        {currentPage === 0 ? renderPage1() : renderPage2()}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentPage(0);
          }}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            currentPage === 0 ? "bg-lime-400" : "bg-gray-300"
          }`}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentPage(1);
          }}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            currentPage === 1 ? "bg-lime-400" : "bg-gray-300"
          }`}
        />
      </div>
    </div>
  );
}
