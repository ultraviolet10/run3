"use client";

import { DownTriangleIcon } from "~/components/shared/Icons";
import { ProfileData } from "~/types/profile";

type BattleCreatorCardProps = {
  creator: ProfileData;
};

// Mock top holders data - in a real app this would come from the API
const mockTopHolders = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
];

export function BattleCreatorCard({ creator }: BattleCreatorCardProps) {
  if (!creator.profile) return null;

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

  const marketCap = creator.profile.creatorCoin?.marketCap || "0";
  const name = creator.profile.displayName || "Creator";
  const handle = `@${creator.profile.handle || "creator"}`;
  const avatar = creator.profile.avatar?.medium || creator.profile.avatar?.small || "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Top-left cutout styling */}
      <div className="absolute top-0 left-0 w-6 h-6 bg-gray-50" 
           style={{
             clipPath: 'polygon(0 0, 100% 0, 0 100%)'
           }}>
      </div>
      
      <div className="p-4">
        {/* Profile Section */}
        <div className="flex items-start space-x-3 mb-4">
          {/* Avatar */}
          <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
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
            <h3 className="text-lg font-bold text-black mb-0.5">{name}</h3>
            <p className="text-gray-500 text-xs mb-2">{handle}</p>
            <p className="text-gray-600 text-xs">what is &quot;onchain&quot;?</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Market Cap */}
          <div className="bg-gray-100 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <div className="flex items-center space-x-0.5">
              <DownTriangleIcon className="w-3 h-3 text-pink-500" />
              <span className="text-sm font-bold text-pink-500">{formatMarketCap(marketCap)}</span>
            </div>
          </div>
          
          {/* Volume */}
          <div className="bg-gray-100 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Volume</p>
            <span className="text-sm font-bold text-black">$1.683</span>
          </div>
          
          {/* Holders */}
          <div className="bg-gray-100 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Holders</p>
            <span className="text-sm font-bold text-black">4</span>
          </div>
        </div>

        {/* Buy Button */}
        <button 
          onClick={() => window.open(`https://zora.co/${creator.profile?.handle}`, "_blank", "noopener,noreferrer")}
          className="w-full bg-lime-400 text-black font-semibold py-2.5 rounded-full border border-gray-600 hover:bg-lime-300 transition-colors mb-3 text-sm"
        >
          Buy on Zora
        </button>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Pagination Dots */}
          <div className="flex items-center space-x-1.5">
            <div className="w-5 h-1.5 bg-lime-400 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Top Holders */}
          <div className="flex items-center space-x-0.5">
            {mockTopHolders.slice(0, 3).map((holder, index) => (
              <div 
                key={index}
                className="w-5 h-5 bg-gray-400 rounded-full border-1 border-white -ml-0.5 first:ml-0"
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
