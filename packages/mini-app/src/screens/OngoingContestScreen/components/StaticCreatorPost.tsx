"use client";

import { useState, useEffect } from "react";
import { getZoraProfile } from "~/lib/getZoraProfile";
import {
  getCreatorCoinsByAddress,
  ProfileCoinsData,
} from "~/lib/getCreatorCoins";
import { ProfileData } from "~/types/profile";
import { ExternalLink, TrendingUp, DollarSign, Users } from "lucide-react";

type StaticCreatorPostProps = {
  creatorAddress: string;
  _isFirst: boolean;
};

// Get real post data from coins API response
const getPostDataFromCoins = (coinsData: ProfileCoinsData | null) => {
  // Get the first (most recent) coin if available
  const firstCoin = coinsData?.profile?.createdCoins?.edges?.[0]?.node;

  if (!firstCoin) {
    return {
      imageUrl: "/api/placeholder/96/96",
      title: "No coins created yet",
      marketCap: "$0.00",
      totalVolume: "$0.00",
      creatorEarnings: "$0.00",
      zoraUrl: "https://zora.co",
      uniqueHolders: 0,
    };
  }

  return {
    imageUrl:
      firstCoin.mediaContent?.previewImage?.medium || "/api/placeholder/96/96",
    title: firstCoin.name || "Untitled Coin",
    marketCap: firstCoin.marketCap ? `$${firstCoin.marketCap}` : "$0.00",
    totalVolume: firstCoin.totalVolume ? `$${firstCoin.totalVolume}` : "$0.00",
    creatorEarnings: firstCoin.marketCapDelta24h
      ? `$${Math.abs(parseFloat(firstCoin.marketCapDelta24h)).toFixed(2)}`
      : "$0.00",
    zoraUrl: `https://zora.co/coin/base:${firstCoin.address}`,
    uniqueHolders: firstCoin.uniqueHolders || 0,
  };
};

export function StaticCreatorPost({ creatorAddress, _isFirst }: StaticCreatorPostProps) {
  const [creator, setCreator] = useState<ProfileData | null>(null);
  const [coinsData, setCoinsData] = useState<ProfileCoinsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get post data from real coins data
  const postData = getPostDataFromCoins(coinsData);

  useEffect(() => {
    async function loadCreatorData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both profile and coins data in parallel
        const [profile, coins] = await Promise.all([
          getZoraProfile(creatorAddress),
          getCreatorCoinsByAddress(creatorAddress, 10),
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
  }, [creatorAddress]);

  const handleBuyOnZora = () => {
    window.open(postData.zoraUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="h-48 bg-gray-800 rounded-xl mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 text-sm">
          {error || "Failed to load creator data"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Creator Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={creator.profile?.avatar?.medium || "/api/placeholder/40/40"}
          alt={creator.profile?.displayName || "Creator"}
          className="w-10 h-10 rounded-full border border-gray-600"
        />
        <div>
          <h3 className="text-white font-semibold text-sm">
            {creator.profile?.displayName ||
              creator.profile?.handle ||
              "Unknown Creator"}
          </h3>
          <p className="text-gray-400 text-xs">
            @{creator.profile?.username || creator.profile?.handle || "unknown"}
          </p>
        </div>
      </div>

      {/* Post Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
        {/* Post Content */}
        <div className="flex space-x-4">
          {/* Post Image/Video */}
          <div className="flex-shrink-0">
            <img
              src={postData.imageUrl}
              alt={postData.title}
              className="w-24 h-24 rounded-xl object-cover border border-gray-700"
            />
          </div>

          {/* Post Stats */}
          <div className="flex-1 space-y-3">
            <h4 className="text-white font-semibold text-sm">
              {postData.title}
            </h4>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Market Cap */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Market Cap</p>
                <p className="text-green-400 font-semibold text-sm">
                  {postData.marketCap}
                </p>
              </div>

              {/* Total Volume */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-3 h-3 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Total Volume</p>
                <p className="text-blue-400 font-semibold text-sm">
                  {postData.totalVolume}
                </p>
              </div>

              {/* Unique Holders */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <DollarSign className="w-3 h-3 text-yellow-400" />
                </div>
                <p className="text-xs text-gray-400 mb-1">Holders</p>
                <p className="text-yellow-400 font-semibold text-sm">
                  {postData.uniqueHolders}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={handleBuyOnZora}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
        >
          <span>Buy on Zora</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
