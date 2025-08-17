"use client";

import { ProfileData } from "~/types/profile";

type CreatorCardProps = {
  creator: ProfileData;
};

// Down Triangle Icon Component
const DownTriangleIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 9L2 3H10L6 9Z" fill="#ec4899" />
  </svg>
);

// Mock top holders data - in a real app this would come from the API
const mockTopHolders = [
  { id: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
  { id: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
  { id: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
];

export function CreatorCard({ creator }: CreatorCardProps) {
  const handleCardClick = () => {
    window.open(
      `https://zora.co/${creator.profile?.handle}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (!creator.profile) return null;

  // Use real data from Zora profile or fallback values
  // Note: Using mock data for followers/following as these aren't available in current Zora API
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

  return (
    <div
      className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all relative border-2 border-black"
      onClick={handleCardClick}
      style={{
        clipPath: "polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)",
      }}
    >
      {/* Profile Section */}
      <div className="flex items-start space-x-3 mb-4">
        <img
          src={
            creator.profile.avatar?.medium ||
            creator.profile.avatar?.small ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          }
          alt={creator.profile.displayName}
          className="w-16 h-16 rounded-xl bg-black"
        />
        <div className="flex-1">
          <h3 className="font-bold text-black text-lg font-syne">
            {creator.profile.displayName || "Creator"}
          </h3>
          <p className="text-gray-600 text-sm font-syne">
            @{creator.profile.handle || "creator"}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Market Cap */}
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 font-syne">Market Cap</span>
            <DownTriangleIcon />
          </div>
          <div className="text-lg font-bold text-pink-500 font-syne">
            {formatMarketCap(marketCap)}
          </div>
        </div>

        {/* Top Holders */}
        <div className="bg-gray-100 rounded-lg p-3">
          <span className="text-xs text-gray-500 font-syne block mb-2">
            Top Holders
          </span>
          <div className="flex -space-x-2">
            {mockTopHolders.map((holder, index) => (
              <img
                key={holder.id}
                src={holder.avatar}
                alt={`Holder ${holder.id}`}
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ zIndex: mockTopHolders.length - index }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-lime-400"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
}
