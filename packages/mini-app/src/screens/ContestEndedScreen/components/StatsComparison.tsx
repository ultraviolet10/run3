"use client";

import { useState, useEffect } from "react";
import { getZoraProfile } from "~/lib/getZoraProfile";
import {
  getCreatorCoinsByAddress,
  ProfileCoinsData,
} from "~/lib/getCreatorCoins";
import { ProfileData } from "~/types/profile";
import { TrendingUp, DollarSign, Users, Crown } from "lucide-react";
import { useUserAddress } from "~/contexts/UserAddressContext";

type StatsComparisonProps = {
  creatorAddress2: string;
};

// Get real stats data from coins API response
const getStatsFromCoins = (coinsData: ProfileCoinsData | null) => {
  // Get the first (most recent) coin if available
  const firstCoin = coinsData?.profile?.createdCoins?.edges?.[0]?.node;

  if (!firstCoin) {
    return {
      marketCap: "$0.00",
      totalVolume: "$0.00",
      creatorEarnings: {
        value: "$0.00",
        isPositive: true,
      },
      totalSupporters: 0,
      finalScore: 0,
    };
  }

  const marketCap = parseFloat(firstCoin.marketCap || "0");
  const totalVolume = parseFloat(firstCoin.totalVolume || "0");
  const uniqueHolders = firstCoin.uniqueHolders || 0;

  // Handle market cap delta (can be positive or negative)
  const marketCapDelta = firstCoin.marketCapDelta24h
    ? parseFloat(firstCoin.marketCapDelta24h)
    : 0;
  const isPositiveChange = marketCapDelta >= 0;

  // Calculate a final score based on multiple metrics
  // For negative market cap changes, we reduce the score contribution
  const finalScore = Math.round(
    marketCap * 0.4 +
      totalVolume * 0.3 +
      uniqueHolders * 10 +
      marketCapDelta * 0.3 // Use actual value (positive or negative)
  );

  return {
    marketCap: `$${marketCap.toFixed(2)}`,
    totalVolume: `$${totalVolume.toFixed(2)}`,
    creatorEarnings: {
      value: `$${Math.abs(marketCapDelta).toFixed(2)}`,
      isPositive: isPositiveChange,
    },
    totalSupporters: uniqueHolders,
    finalScore: Math.max(0, finalScore), // Ensure score is never negative
  };
};

export function StatsComparison({
  creatorAddress2,
}: StatsComparisonProps) {
  const { userAddress, loading: _addressLoading, error: addressError } = useUserAddress();
  const [creators, setCreators] = useState<
    [ProfileData | null, ProfileData | null]
  >([null, null]);
  const [coinsData, setCoinsData] = useState<
    [ProfileCoinsData | null, ProfileCoinsData | null]
  >([null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stats1 = getStatsFromCoins(coinsData[0]);
  const stats2 = getStatsFromCoins(coinsData[1]);

  useEffect(() => {
    async function loadCreators() {
      if (!userAddress) {
        setError(addressError || "Please authenticate to view stats comparison");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [profile1, profile2, coins1, coins2] = await Promise.all([
          getZoraProfile(userAddress),
          getZoraProfile(creatorAddress2),
          getCreatorCoinsByAddress(userAddress, 10),
          getCreatorCoinsByAddress(creatorAddress2, 10),
        ]);

        setCreators([profile1, profile2]);
        setCoinsData([coins1, coins2]);
      } catch (err) {
        console.error("Error loading creators:", err);
        setError("Failed to load creator data");
      } finally {
        setLoading(false);
      }
    }

    loadCreators();
  }, [userAddress, creatorAddress2, addressError]);

  if (loading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!creators[0] && !creators[1])) {
    return (
      <div className="mb-8">
        <div className="bg-red-900/20 border border-red-600/30 rounded-2xl p-6">
          <div className="text-center">
            <p className="text-red-400 text-sm">
              {error || "Failed to load creator data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const CreatorStatsCard = ({
    creator,
    stats,
    isWinner,
  }: {
    creator: ProfileData | null;
    stats: any;
    isWinner: boolean;
  }) => (
    <div
      className={`relative p-6 rounded-2xl border-2 transition-all ${
        isWinner
          ? "bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/50 shadow-green-500/20 shadow-lg"
          : "bg-gray-900 border-gray-700"
      }`}
    >
      {/* Winner crown */}
      {isWinner && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-4 h-4 text-yellow-900" />
          </div>
        </div>
      )}

      {/* Creator info */}
      <div className="flex items-center space-x-3 mb-6">
        <img
          src={creator?.profile?.avatar?.medium || "/api/placeholder/48/48"}
          alt={creator?.profile?.displayName || "Creator"}
          className={`w-12 h-12 rounded-full border-2 ${
            isWinner ? "border-green-400" : "border-gray-600"
          }`}
        />
        <div>
          <h4
            className={`font-bold text-sm ${
              isWinner ? "text-green-400" : "text-white"
            }`}
          >
            {creator?.profile?.displayName ||
              creator?.profile?.handle ||
              "Unknown Creator"}
          </h4>
          <p className="text-gray-400 text-xs">
            @
            {creator?.profile?.username ||
              creator?.profile?.handle ||
              "unknown"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        {/* Market Cap */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-sm">Market Cap</span>
          </div>
          <span
            className={`font-semibold ${
              isWinner ? "text-green-400" : "text-white"
            }`}
          >
            {stats.marketCap}
          </span>
        </div>

        {/* Total Volume */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-sm">Total Volume</span>
          </div>
          <span
            className={`font-semibold ${
              isWinner ? "text-green-400" : "text-white"
            }`}
          >
            {stats.totalVolume}
          </span>
        </div>

        {/* Creator Earnings */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">💰</span>
            <span className="text-gray-400 text-sm">Market Cap Change</span>
          </div>
          <div className="flex items-center space-x-1">
            {stats.creatorEarnings.isPositive ? (
              <span className="text-green-400">↑</span>
            ) : (
              <span className="text-red-400">↓</span>
            )}
            <span
              className={`font-semibold ${
                isWinner
                  ? "text-green-400"
                  : stats.creatorEarnings.isPositive
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {stats.creatorEarnings.value}
            </span>
          </div>
        </div>

        {/* Supporters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-sm">Unique Holders</span>
          </div>
          <span
            className={`font-semibold ${
              isWinner ? "text-green-400" : "text-white"
            }`}
          >
            {stats.totalSupporters}
          </span>
        </div>

        {/* Final Score */}
        <div
          className={`pt-4 border-t ${
            isWinner ? "border-green-700" : "border-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-medium">Final Score</span>
            <span
              className={`text-xl font-bold ${
                isWinner ? "text-green-400" : "text-white"
              }`}
            >
              {stats.finalScore}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-2">Final Results</h3>
        <p className="text-gray-400 text-sm">
          Here&apos;s how the creators performed in the battle:
        </p>
      </div>

      <div className="space-y-4">
        <CreatorStatsCard
          creator={creators[0]}
          stats={stats1}
          isWinner={stats1.finalScore > stats2.finalScore}
        />
        <CreatorStatsCard
          creator={creators[1]}
          stats={stats2}
          isWinner={stats2.finalScore > stats1.finalScore}
        />
      </div>
    </div>
  );
}
