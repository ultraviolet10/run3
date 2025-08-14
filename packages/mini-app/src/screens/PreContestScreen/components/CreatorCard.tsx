"use client";

import { ProfileData } from "~/types/profile";
import { TrendingUp, TrendingDown } from "lucide-react";

type CreatorCardProps = {
  creator: ProfileData;
};

export function CreatorCard({ creator }: CreatorCardProps) {
  const handleCardClick = () => {
    window.open(
      `https://zora.co/${creator.profile?.handle}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (!creator.profile) return null;

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-3 cursor-pointer hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all"
      onClick={handleCardClick}
    >
      {/* Header with Avatar and Follow Button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img
            src={creator.profile.avatar?.medium || creator.profile.avatar?.small}
            alt={creator.profile.displayName}
            className="w-10 h-10 rounded-full border-2 border-gray-700"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base truncate">
              {creator.profile.displayName}
            </h3>
            <p className="text-gray-400 text-xs truncate">
              @{creator.profile.handle}
            </p>
          </div>
        </div>
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">+</span>
        </div>
      </div>

      {/* Bio - Condensed */}
      {creator.profile.bio && (
        <div className="mb-2 px-2 py-1 bg-gray-800/50 rounded border-l-2 border-green-500">
          <p className="text-gray-300 text-xs line-clamp-1">{creator.profile.bio}</p>
        </div>
      )}

      {/* Market Cap Card */}
      <div className="bg-gray-800/70 rounded-lg p-2 mb-3">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-400 text-sm font-medium">Market Cap</p>
          {creator.profile.creatorCoin?.marketCapDelta24h && (
            <div
              className={`flex items-center text-xs px-2 py-1 rounded-full ${
                parseFloat(creator.profile.creatorCoin.marketCapDelta24h) >= 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {parseFloat(creator.profile.creatorCoin.marketCapDelta24h) >=
              0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              <span>
                $
                {Math.abs(
                  parseFloat(creator.profile.creatorCoin.marketCapDelta24h)
                ).toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-baseline">
          <span className="font-bold text-2xl text-white">
            ${creator.profile.creatorCoin?.marketCap || "0"}
          </span>
        </div>
      </div>
    </div>
  );
}
