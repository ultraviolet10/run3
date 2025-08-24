"use client";

import { useState, useEffect } from "react";
import { getZoraProfile } from "~/lib/getZoraProfile";
import {
  getCreatorCoinsByAddress,
  ProfileCoinsData,
} from "~/lib/getCreatorCoins";
import { ProfileData } from "~/types/profile";
import { useUserAddress } from "~/contexts/UserAddressContext";
// Lightning icon for separator
const LightningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
  </svg>
);

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

// Helper function to get post data from coins
const getPostDataFromCoins = (coinsData: ProfileCoinsData | null) => {
  if (!coinsData?.profile?.createdCoins?.edges?.length) {
    return {
      image: "/api/placeholder/400/400",
      zoraUrl: "https://zora.co",
      address: "",
      name: "Latest Collection",
      description: "Check out this amazing new drop!",
    };
  }

  const latestCoin = coinsData.profile.createdCoins.edges[0].node;
  return {
    image:
      latestCoin?.mediaContent?.previewImage?.medium ||
      "/api/placeholder/400/400",
    zoraUrl: `https://zora.co/collect/zora:${latestCoin?.address}`,
    address: latestCoin?.address,
    name: latestCoin?.name || "Latest Collection",
    description: latestCoin?.description || "Check out this amazing new drop!",
  };
};

type CreatorCardProps = {
  creatorAddress: string;
  _isFirst: boolean;
};

function CreatorCard({ creatorAddress, _isFirst }: CreatorCardProps) {
  const { userAddress } = useUserAddress();
  const [creator, setCreator] = useState<ProfileData | null>(null);
  const [coinsData, setCoinsData] = useState<ProfileCoinsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const postData = getPostDataFromCoins(coinsData);

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

  const handleBuyOnZora = () => {
    if (creator?.profile?.handle) {
      window.open(
        `https://zora.co/coin/base:${postData.address}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-3xl p-6 animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-300 rounded mb-6"></div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 h-20"></div>
          <div className="bg-white rounded-2xl p-4 h-20"></div>
          <div className="bg-white rounded-2xl p-4 h-20"></div>
        </div>
        <div className="h-12 bg-lime-300 rounded-full"></div>
      </div>
    );
  }

  if (error || !creator?.profile) {
    return (
      <div className="bg-gray-100 rounded-3xl p-6 text-center">
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

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
      {/* Profile Section */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden">
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
          <h3 className="text-lg font-bold text-black mb-0.5">{name}</h3>
          <p className="text-gray-500 text-sm">{handle}</p>
        </div>
      </div>

      {/* Post Section - Image and Title */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-20 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={postData.image}
            alt="Post content"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="text-white text-xs flex items-center justify-center h-full">POST</div>';
            }}
          />
        </div>

        <div className="flex-1 flex items-center">
          <h4 className="text-lg font-bold text-black leading-tight">{postData.name}</h4>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Market Cap</p>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-green-500 text-sm">▲</span>
            <span className="text-lg font-bold text-green-500">
              {formatMarketCap(marketCap)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Volume</p>
          <span className="text-lg font-bold text-black">${volume}</span>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Holders</p>
          <span className="text-lg font-bold text-black">{holders}</span>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuyOnZora}
        className="w-full bg-lime-400 text-black font-semibold py-3 rounded-full text-base hover:bg-lime-300 transition-colors"
      >
        Buy on Zora
      </button>
    </div>
  );
}

export function OngoingCreatorBattle() {
  const { userAddress } = useUserAddress();

  // Mock second creator address - in real app this would come from contest data
  const SECOND_CREATOR_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";

  return (
    <div className="px-4 space-y-2">
      {/* First Creator Card */}
      <CreatorCard creatorAddress={userAddress || ""} _isFirst={true} />

      <div className="flex items-center justify-center">
        <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center shadow-lg">
          <div className="text-black">
            <LightningIcon />
          </div>
        </div>
      </div>

      {/* Second Creator Card */}
      <CreatorCard creatorAddress={SECOND_CREATOR_ADDRESS} _isFirst={false} />
    </div>
  );
}
