"use client";

import { useState, useEffect } from "react";
import { getZoraProfile } from "~/lib/getZoraProfile";
import {
  getCreatorCoinsByAddress,
  ProfileCoinsData,
} from "~/lib/getCreatorCoins";
import { ProfileData } from "~/types/profile";
import { useUserAddress } from "~/contexts/UserAddressContext";

// Format market cap for display
const formatMarketCap = (value: string) => {
  const num = parseFloat(value);
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(0)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toFixed(0)}`;
};

type EndedCreatorCardProps = {
  creatorAddress: string;
  isWinner: boolean;
  finalScore: number;
};

function EndedCreatorCard({
  creatorAddress,
  isWinner,
  finalScore,
}: EndedCreatorCardProps) {
  const { userAddress } = useUserAddress();
  const [creator, setCreator] = useState<ProfileData | null>(null);
  const [coinsData, setCoinsData] = useState<ProfileCoinsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCreatorData() {
      const addressToUse = creatorAddress || userAddress;
      if (!addressToUse) {
        setError("No address available");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [profile, coins] = await Promise.all([
          getZoraProfile(addressToUse),
          getCreatorCoinsByAddress(addressToUse, 10),
        ]);

        setCreator(profile);
        setCoinsData(coins);
      } catch (err) {
        console.error("Error loading creator data:", err);
        setError("Failed to load creator data");
      } finally {
        setLoading(false);
      }
    }

    loadCreatorData();
  }, [creatorAddress, userAddress]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-200 animate-pulse">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-100 rounded-lg p-2 h-12"></div>
          <div className="bg-gray-100 rounded-lg p-2 h-12"></div>
          <div className="bg-gray-100 rounded-lg p-2 h-12"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  if (error || !creator?.profile) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 text-center">
        <p className="text-red-600 text-sm">
          {error || "Failed to load creator data"}
        </p>
      </div>
    );
  }

  const avatar = creator?.profile?.avatar?.medium || "/api/placeholder/80/80";
  const name =
    creator?.profile?.displayName || creator?.profile?.handle || "Unknown";
  const handle = creator?.profile?.handle
    ? `@${creator.profile.handle}`
    : "@unknown";

  const latestCoin = coinsData?.profile?.createdCoins?.edges?.[0]?.node;
  const marketCap = latestCoin?.marketCap || "245000000";
  const volume = parseFloat(latestCoin?.totalVolume || "1683").toFixed(0);
  const holders = latestCoin?.uniqueHolders?.toString() || "4";

  const scoreColor = isWinner ? "text-green-500" : "text-pink-500";
  const scoreBg = isWinner ? "bg-green-100" : "bg-pink-100";
  const borderColor = isWinner ? "border-green-200" : "border-pink-200";

  return (
    <div
      className={`bg-white rounded-2xl p-3 shadow-lg border-2 ${borderColor}`}
    >
      {/* Profile Section */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="text-white text-xs">IMG</div>';
            }}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-base font-bold text-black mb-0.5">{name}</h3>
          <p className="text-gray-500 text-xs">{handle}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400 mb-1">Market Cap</p>
          <div className="flex items-center justify-center space-x-0.5">
            <span
              className={`text-xs ${
                isWinner ? "text-green-500" : "text-pink-500"
              }`}
            >
              {isWinner ? "▲" : "▼"}
            </span>
            <span
              className={`text-xs font-bold ${
                isWinner ? "text-green-500" : "text-pink-500"
              }`}
            >
              {formatMarketCap(marketCap)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400 mb-1">Volume</p>
          <span className="text-xs font-bold text-black">${volume}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-400 mb-1">Holders</p>
          <span className="text-xs font-bold text-black">{holders}</span>
        </div>
      </div>

      {/* Final Score */}
      <div className={`${scoreBg} rounded-lg p-2.5 text-center`}>
        <span className={`text-sm font-bold ${scoreColor}`}>
          Final Score : {finalScore}
        </span>
      </div>
    </div>
  );
}

export function EndedCreatorCards() {
  const { userAddress } = useUserAddress();

  // Mock second creator address and scores
  const SECOND_CREATOR_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";
  const WINNER_SCORE = 91;
  const LOSER_SCORE = 80;

  return (
    <div className="space-y-4">
      {/* Winner Card */}
      <EndedCreatorCard
        creatorAddress={userAddress || ""}
        isWinner={true}
        finalScore={WINNER_SCORE}
      />

      {/* Loser Card */}
      <EndedCreatorCard
        creatorAddress={SECOND_CREATOR_ADDRESS}
        isWinner={false}
        finalScore={LOSER_SCORE}
      />
    </div>
  );
}
