"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import { getZoraProfile } from "~/lib/getZoraProfile";

interface UserAddressContextType {
  userAddress: string | null;
  zoraProfileAddress: string | null;
  loading: boolean;
  error: string | null;
  refreshAddress: () => Promise<void>;
}

const UserAddressContext = createContext<UserAddressContextType | undefined>(
  undefined
);

interface UserAddressProviderProps {
  children: ReactNode;
}

export function UserAddressProvider({ children }: UserAddressProviderProps) {
  const { user, authenticated } = usePrivy();
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [zoraProfileAddress, setZoraProfileAddress] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's smart wallet address from Privy
  const privyAddress =
    authenticated && user?.linkedAccounts[0]?.smartWallets[0]?.address;

  const fetchZoraProfileAddress = async (address: string) => {
    try {
      setLoading(true);
      setError(null);

      const profileData = await getZoraProfile(address);

      if (profileData?.profile) {
        // Extract address from Zora profile - prioritize creator coin address, then public wallet
        const extractedAddress = profileData.profile.creatorCoin?.address || "";

        setZoraProfileAddress(extractedAddress);
      } else {
        setZoraProfileAddress(address); // fallback to original address
      }
    } catch (err) {
      console.error("Error fetching Zora profile address:", err);
      setError("Failed to fetch Zora profile address");
      setZoraProfileAddress(address); // fallback to original address
    } finally {
      setLoading(false);
    }
  };

  const refreshAddress = async () => {
    if (privyAddress) {
      await fetchZoraProfileAddress(privyAddress);
    }
  };

  useEffect(() => {
    if (privyAddress) {
      setUserAddress(privyAddress);
      fetchZoraProfileAddress(privyAddress);
    } else {
      setUserAddress(null);
      setZoraProfileAddress(null);
    }
  }, [privyAddress]);

  const value: UserAddressContextType = {
    userAddress,
    zoraProfileAddress,
    loading,
    error,
    refreshAddress,
  };

  return (
    <UserAddressContext.Provider value={value}>
      {children}
    </UserAddressContext.Provider>
  );
}

export function useUserAddress() {
  const context = useContext(UserAddressContext);
  if (context === undefined) {
    throw new Error("useUserAddress must be used within a UserAddressProvider");
  }
  return context;
}
