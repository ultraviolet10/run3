export type ProfileData = {
  profile?: {
    id?: string;              // Globally unique ID for the profile
    handle?: string;          // Username/handle
    displayName?: string;     // User's display name
    bio?: string;             // User's biography/description
    username?: string;        // Username
    website?: string;         // User's website URL
    avatar?: {                // Profile image data
      small?: string;         // Small version of profile image
      medium?: string;        // Medium version of profile image
      blurhash?: string;      // Blurhash for image loading
    };
    publicWallet?: {          // Public wallet information
      walletAddress?: string; // User's wallet address
    };
    socialAccounts?: {        // Connected social accounts
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
    linkedWallets?: {         // Connected wallets
      edges?: Array<{
        node?: {
          walletType?: "PRIVY" | "EXTERNAL" | "SMART_WALLET";
          walletAddress?: string;
        };
      }>;
    };
    creatorCoin?: {           // User's Creator Coin (if they have one)
      address?: string;       // Creator Coin contract address
      marketCap?: string;     // Current market capitalization
      marketCapDelta24h?: string; // 24-hour market cap change
    };
  };
};

// Simplified creator data for UI display
export type CreatorData = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  avatar: string;
  zoraUrl: string;
  socialAccounts?: {
    twitter?: string;
    instagram?: string;
  };
};
