"use client";

import { useState, useEffect } from "react";
import { CreatorCard } from "./CreatorCard";
import { getZoraProfile } from "~/lib/getZoraProfile";
import { ProfileData } from "~/types/profile";
import { useUserAddress } from "~/contexts/UserAddressContext";

// Lightning Icon Component
const LightningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
  </svg>
);

const KISMET_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";

export function CreatorBattle() {
  const {
    userAddress,
    loading: _addressLoading,
    error: addressError,
  } = useUserAddress();
  const [creators, setCreators] = useState<
    [ProfileData | null, ProfileData | null]
  >([null, null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCreators() {
      if (!userAddress) {
        setError(addressError || "Please authenticate to view creator battle");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [userProfile, kismetProfile] = await Promise.all([
          getZoraProfile(userAddress),
          getZoraProfile(KISMET_ADDRESS),
        ]);

        setCreators([userProfile, kismetProfile]);
      } catch (err) {
        console.error("Error loading creators:", err);
        setError("Failed to load creator data");
      } finally {
        setLoading(false);
      }
    }

    loadCreators();
  }, [userAddress, addressError]);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Creator Battle</h2>
          <p className="text-gray-400 text-sm">Loading creator profiles...</p>
        </div>
        <div className="space-y-4 mb-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 animate-pulse">
            <div className="h-20 bg-gray-800 rounded"></div>
          </div>
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
              <span className="text-lg font-bold text-gray-500 tracking-wider">
                VS
              </span>
              <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 animate-pulse">
            <div className="h-20 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (!creators[0] && !creators[1])) {
    return (
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white mb-2">Creator Battle</h2>
          <p className="text-red-400 text-sm">
            {error || "Failed to load creator data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="space-y-6">
        {creators[0] && <CreatorCard creator={creators[0]} />}

        <div className="flex items-center justify-center py-2">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="text-black">
              <LightningIcon />
            </div>
          </div>
        </div>

        {creators[1] && <CreatorCard creator={creators[1]} />}
      </div>
    </div>
  );
}
