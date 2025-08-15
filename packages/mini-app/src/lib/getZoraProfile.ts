import { getProfile } from "@zoralabs/coins-sdk";
import { ProfileData } from "~/types/profile";

export interface ZoraProfileResponse {
  profile?: {
    id?: string;
    handle?: string;
    displayName?: string;
    bio?: string;
    username?: string;
    website?: string;
    avatar?: {
      small?: string;
      medium?: string;
      blurhash?: string;
    };
    publicWallet?: {
      walletAddress?: string;
    };
    socialAccounts?: {
      instagram?: {
        username?: string;
        displayName?: string;
      };
      tiktok?: {
        username?: string;
        displayName?: string;
      };
      twitter?: {
        username?: string;
        displayName?: string;
      };
      farcaster?: {
        username?: string;
        displayName?: string;
      };
    };
    linkedWallets?: {
      edges?: Array<{
        node?: {
          walletType?: "PRIVY" | "EXTERNAL" | "SMART_WALLET";
          walletAddress?: string;
        };
      }>;
    };
    creatorCoin?: {
      address?: string;
      marketCap?: string;
      marketCapDelta24h?: string;
      price?: string;
    };
  };
}

export async function getZoraProfile(address: string): Promise<ProfileData | null> {
  try {
    const response = await getProfile({
      identifier: address,
    });

    if (!response?.data?.profile) {
      console.warn(`No profile found for address: ${address}`);
      return null;
    }

    const zoraProfile = response.data.profile as ZoraProfileResponse['profile'];
    
    // Transform Zora profile data to match our ProfileData type
    const profileData: ProfileData = {
      profile: {
        id: zoraProfile?.id || address,
        handle: zoraProfile?.handle || zoraProfile?.username,
        displayName: zoraProfile?.displayName || zoraProfile?.handle || 'Unknown',
        username: zoraProfile?.username || zoraProfile?.handle,
        bio: zoraProfile?.bio || 'Creator on Zora',
        avatar: {
          medium: zoraProfile?.avatar?.medium,
          small: zoraProfile?.avatar?.small
        },
        socialAccounts: {
          twitter: zoraProfile?.socialAccounts?.twitter,
          farcaster: zoraProfile?.socialAccounts?.farcaster
        },
        creatorCoin: zoraProfile?.creatorCoin ? {
          address: zoraProfile.creatorCoin.address,
          marketCap: zoraProfile.creatorCoin.marketCap,
          marketCapDelta24h: zoraProfile.creatorCoin.marketCapDelta24h
        } : undefined
      }
    };

    return profileData;
  } catch (error) {
    console.error(`Failed to fetch Zora profile for ${address}:`, error);
    return null;
  }
}