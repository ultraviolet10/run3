"use client";

import { useState, useEffect } from "react";
import { getZoraProfile } from "~/lib/getZoraProfile";
import { ProfileData } from "~/types/profile";
import { Trophy, Crown } from "lucide-react";
import { useUserAddress } from "~/contexts/UserAddressContext";

export function WinnerAnnouncement() {
  const { userAddress, loading: _addressLoading, error: addressError } = useUserAddress();
  const [winner, setWinner] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWinner() {
      if (!userAddress) {
        setError(addressError || "Please authenticate to view winner data");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const profile = await getZoraProfile(userAddress);
        setWinner(profile);
      } catch (err) {
        console.error("Error loading winner:", err);
        setError("Failed to load winner data");
      } finally {
        setLoading(false);
      }
    }

    loadWinner();
  }, [userAddress, addressError]);

  if (loading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-600/30 rounded-2xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !winner) {
    return (
      <div className="mb-8">
        <div className="bg-red-900/20 border border-red-600/30 rounded-2xl p-6">
          <div className="text-center">
            <p className="text-red-400 text-sm">
              {error || "Failed to load winner data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border border-yellow-600/30 rounded-2xl p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5"></div>
        
        {/* Winner content */}
        <div className="relative text-center">
          {/* Trophy icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-yellow-900" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Winner title */}
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">
            🎉 WINNER! 🎉
          </h3>

          {/* Winner profile */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img
              src={winner.profile?.avatar?.medium || "/api/placeholder/60/60"}
              alt={winner.profile?.displayName || "Winner"}
              className="w-12 h-12 rounded-full border-2 border-yellow-400 shadow-lg"
            />
            <div className="text-left">
              <h4 className="text-white font-bold text-lg">
                {winner.profile?.displayName || winner.profile?.handle || "Unknown Creator"}
              </h4>
              <p className="text-yellow-400 text-sm font-medium">
                @{winner.profile?.username || winner.profile?.handle || "unknown"}
              </p>
            </div>
          </div>

          {/* Victory message */}
          <p className="text-gray-300 text-sm">
            Congratulations on winning the creator battle! 🏆
          </p>
        </div>
      </div>
    </div>
  );
}
