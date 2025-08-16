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
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <FlipHeader />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          {/* Contest Title with Performance Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-1">
                Creator Battle
              </h2>
              <p className="text-gray-400 text-xs">
                Two creators, one winner. Who will you support?
              </p>
            </div>
            <div className="ml-3 flex space-x-2">
              {zoraProfileAddress && (
                <CoinComparison
                  coinAddress1={zoraProfileAddress}
                  coinAddress2={KISMET_ADDRESS}
                  startTimestamp={startTimestamp}
                />
              )}
              {/* Test Navigation Button */}
              {onNavigateToOngoing && (
                <button
                  onClick={onNavigateToOngoing}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Test Live
                </button>
              )}
            </div>
          </div>
        </div>

        <CreatorBattle />
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
