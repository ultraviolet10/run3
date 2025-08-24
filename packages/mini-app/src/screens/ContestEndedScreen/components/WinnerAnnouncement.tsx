"use client";

import { useState, useEffect } from "react";
import { getZoraProfile } from "~/lib/getZoraProfile";
import { ProfileData } from "~/types/profile";
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
      <div className="bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl p-4 text-center animate-pulse">
        <div className="h-8 bg-white/20 rounded-lg mb-3 mx-auto w-32"></div>
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !winner) {
    return (
      <div className="bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl p-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">WINNER!</h2>
        <div className="bg-white rounded-xl p-3">
          <p className="text-red-600 text-xs">
            {error || "Failed to load winner data"}
          </p>
        </div>
      </div>
    );
  }

  const avatar = winner.profile?.avatar?.medium || "/api/placeholder/60/60";
  const name = winner.profile?.displayName || winner.profile?.handle || "Unknown Creator";
  const handle = winner.profile?.handle ? `@${winner.profile.handle}` : "@unknown";

  return (
    <div className="bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl p-4 text-center relative overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-white/20"></div>
          ))}
        </div>
      </div>

      {/* Winner title */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
          WINNER!
        </h2>

        {/* Winner profile card */}
        <div className="bg-white rounded-xl p-3 shadow-xl">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center overflow-hidden">
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

            <div className="flex-1 text-left">
              <h3 className="text-sm font-bold text-black">{name}</h3>
              <p className="text-gray-500 text-xs">{handle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
