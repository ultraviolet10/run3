"use client";

import { useState, useEffect } from "react";
import { getZoraProfile } from "~/lib/getZoraProfile";
import {
  getCreatorCoinsByAddress,
  ProfileCoinsData,
} from "~/lib/getCreatorCoins";
import { ProfileData } from "~/types/profile";
import { DownTriangleIcon } from "~/components/shared/Icons";

// Helper function to get post data from coins
const getPostDataFromCoins = (coinsData: ProfileCoinsData | null) => {
  if (!coinsData?.profile?.createdCoins?.edges?.length) {
    return {
      image: "/api/placeholder/400/400",
      zoraUrl: "https://zora.co",
      address: "",
      name: "",
      description: "",
    };
  }

  const latestCoin = coinsData.profile.createdCoins.edges[0].node;
  return {
    image: latestCoin?.mediaContent?.previewImage?.medium || "/api/placeholder/400/400",
    zoraUrl: `https://zora.co/collect/zora:${latestCoin?.address}`,
    address: latestCoin?.address,
    name: latestCoin?.name,
    description: latestCoin?.description,
  };
};

type StaticCreatorPostProps = {
  creatorAddress: string;
  _isFirst: boolean;
};

// Mock top holders data - in a real app this would come from the API
const mockTopHolders = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
];

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

// Truncate text to specified length
const truncate = (text: string, maxLength: number = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
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
    if (creator?.profile?.handle) {
      window.open(`https://zora.co/coin/base:${postData.address}`, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-100 rounded-lg p-3 h-16"></div>
          <div className="bg-gray-100 rounded-lg p-3 h-16"></div>
          <div className="bg-gray-100 rounded-lg p-3 h-16"></div>
        </div>
      </div>
    );
  }

  if (error || !creator?.profile) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
        <p className="text-red-600 text-sm">
          {error || "Failed to load creator data"}
        </p>
      </div>
    );
  }

  // Get derived data for display
  const avatar = creator?.profile?.avatar?.medium || "/api/placeholder/80/80";
  const name = creator?.profile?.displayName || creator?.profile?.handle || "Unknown";
  const handle = creator?.profile?.handle ? `@${creator.profile.handle}` : "@unknown";

  // Extract real data from coins API
  const latestCoin = coinsData?.profile?.createdCoins?.edges?.[0]?.node;
  const marketCap = latestCoin?.marketCap || "0";
  const volume = `$${parseFloat(latestCoin?.totalVolume || "0").toFixed(3)}`;
  const holders = latestCoin?.uniqueHolders?.toString() || "0";

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Top-left cutout styling */}
      <div className="absolute top-0 left-0 w-6 h-6 bg-gray-50" 
           style={{
             clipPath: 'polygon(0 0, 100% 0, 0 100%)'
           }}>
      </div>
      
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-start space-x-4 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="text-white text-xs">IMG</div>';
              }}
            />
          </div>
          
          {/* Creator Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black mb-1">{name}</h3>
            <p className="text-gray-500 text-sm mb-3">{handle}</p>
          </div>
        </div>

        {/* Post Content Section */}
        <div className="flex space-x-4 mb-6">
          {/* Large Post Image/Content */}
          <div className="w-32 h-32 bg-black rounded-xl overflow-hidden flex-shrink-0">
            <img 
              src={postData.image} 
              alt="Post content"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="text-white text-xs flex items-center justify-center h-full">POST</div>';
              }}
            />
          </div>
          
          {/* Right side content */}
          <div className="flex-1">
            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-bold text-black mb-1">{postData.name}</h3>
              <p className="text-gray-500 text-sm mb-3">{truncate(postData.description || '', 80)}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Market Cap */}
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <div className="flex items-center space-x-1">
              <DownTriangleIcon className="w-3 h-3 text-pink-500" />
              <span className="text-lg font-bold text-pink-500">{formatMarketCap(marketCap)}</span>
            </div>
          </div>
          
          {/* Volume */}
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Volume</p>
            <span className="text-lg font-bold text-black">{volume}</span>
          </div>
          
          {/* Holders */}
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Holders</p>
            <span className="text-lg font-bold text-black">{holders}</span>
          </div>
        </div>

        {/* Buy Button */}
        <button 
          onClick={handleBuyOnZora}
          className="w-full bg-lime-400 text-black font-semibold py-3 rounded-full border border-gray-600 hover:bg-lime-300 transition-colors mb-4"
        >
          Buy on Zora
        </button>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Pagination Dots */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-2 bg-lime-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Top Holders */}
          <div className="flex items-center space-x-1">
            {mockTopHolders.slice(0, 3).map((holder, index) => (
              <div 
                key={index}
                className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white -ml-1 first:ml-0"
                style={{ zIndex: 3 - index }}
              >
                <img 
                  src={holder} 
                  alt={`Holder ${index + 1}`}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
