import { getProfileCoins } from "@zoralabs/coins-sdk";

export type GetProfileCoinsParams = {
  identifier: string;             // The user's wallet address or zora handle
  count?: number;                 // Optional: Number of coins to return per page (default: 20)
  after?: string;                 // Optional: Pagination cursor for fetching next page
  chainIds?: Array<number>;       // Optional: Filter by specific chain IDs
  platformReferrerAddress?: Array<string>; // Optional: Filter by platform referrer addresses
};

export interface ProfileCoinsData {
  profile?: {
    id?: string;              // Globally unique ID for the profile
    handle?: string;          // Username/handle
    avatar?: {                // Profile avatar
      previewImage?: {
        blurhash?: string;    // Blurhash for image loading
        medium?: string;      // Medium version of profile image
        small?: string;       // Small version of profile image
      };
    };
    createdCoins?: {          // Coins created by this user
      count?: number;         // Total number of created coins
      edges?: Array<{
        node?: {
          id?: string;        // Coin ID
          name?: string;      // Coin name
          symbol?: string;    // Trading symbol
          description?: string; // Coin description
          address?: string;   // Coin contract address
          chainId?: number;   // Chain ID where coin exists
          totalSupply?: string; // Total supply of the coin
          totalVolume?: string; // Total trading volume
          volume24h?: string; // 24-hour trading volume
          marketCap?: string; // Current market capitalization
          marketCapDelta24h?: string; // 24h market cap change
          uniqueHolders?: number; // Number of unique holders
          createdAt?: string; // Creation timestamp
          creatorAddress?: string; // Creator's wallet address
          tokenUri?: string;  // Token metadata URI
          mediaContent?: {    // Associated media
            mimeType?: string;
            originalUri?: string;
            previewImage?: {
              small?: string;
              medium?: string;
              blurhash?: string;
            };
          };
          uniswapV4PoolKey?: { // Uniswap V4 pool information
            token0Address?: string;
            token1Address?: string;
            fee?: number;
            tickSpacing?: number;
            hookAddress?: string;
          };
          uniswapV3PoolAddress?: string; // Uniswap V3 pool address
        };
      }>;
      pageInfo?: {            // Pagination information
        hasNextPage?: boolean; // Whether more results exist
        endCursor?: string;   // Cursor for next page
      };
    };
  };
}

export async function getCreatorCoins(params: GetProfileCoinsParams): Promise<ProfileCoinsData | null> {
  try {
    const response = await getProfileCoins({
      identifier: params.identifier,
      count: params.count || 20,
      after: params.after,
      chainIds: params.chainIds,
      platformReferrerAddress: params.platformReferrerAddress,
    });

    if (!response?.data?.profile) {
      console.warn(`No profile found for identifier: ${params.identifier}`);
      return null;
    }

    const profileData = response.data as ProfileCoinsData;
    
    // Log coin information for debugging
    if (profileData.profile?.createdCoins) {
      console.log(`Found ${profileData.profile.createdCoins.count} created coins for ${params.identifier}`);
      
      profileData.profile.createdCoins.edges?.forEach((edge, index) => {
        const coin = edge.node;
        console.log(`Coin ${index + 1}:`, {
          name: coin?.name,
          symbol: coin?.symbol,
          marketCap: coin?.marketCap,
          uniqueHolders: coin?.uniqueHolders,
          address: coin?.address,
        });
      });
    } else {
      console.log(`User ${params.identifier} has not created any coins`);
    }

    return profileData;
  } catch (error) {
    console.error(`Failed to fetch creator coins for ${params.identifier}:`, error);
    return null;
  }
}

// Helper function to get coins for a specific creator address
export async function getCreatorCoinsByAddress(address: string, count?: number): Promise<ProfileCoinsData | null> {
  return getCreatorCoins({
    identifier: address,
    count: count || 20,
  });
}