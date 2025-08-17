"use client";

import { CreatorBattle } from "./components/CreatorBattle";
import { ContestTimer } from "./components/ContestTimer";
import { FlipHeader } from "./components/FlipHeader";
import { CoinComparison } from "./components/CoinComparison";
import { UserAddressProvider, useUserAddress } from "~/contexts/UserAddressContext";

// Creator addresses
const KISMET_ADDRESS = "0x91169bfa46481ba2b0db01bfdfd3d5be3d3dceb8";

type PreContestScreenProps = {
  onNavigateToOngoing?: () => void;
};

function PreContestScreenContent({ onNavigateToOngoing }: PreContestScreenProps) {
  const { zoraProfileAddress } = useUserAddress();
  
  // Mock contest start time - 2 hours from now
  const contestStartTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

  // Contest start timestamp (24 hours ago for comparison purposes)
  const startTimestamp = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <FlipHeader />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <CreatorBattle />
        
        {/* Testing Navigation Button */}
        {onNavigateToOngoing && (
          <div className="px-4 py-6">
            <button
              onClick={onNavigateToOngoing}
              className="w-full bg-lime-400 text-black font-semibold py-3 px-6 rounded-full border-2 border-black hover:bg-lime-300 transition-colors"
            >
              🧪 Test Navigation → Ongoing Contest
            </button>
          </div>
        )}
      </div>

      {/* Fixed Timer Footer */}
      <div className="flex-shrink-0">
        <ContestTimer contestStartTime={contestStartTime} />
      </div>
    </div>
  );
}

export function PreContestScreen({ onNavigateToOngoing }: PreContestScreenProps) {
  return (
    <UserAddressProvider>
      <PreContestScreenContent onNavigateToOngoing={onNavigateToOngoing} />
    </UserAddressProvider>
  );
}
