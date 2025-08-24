"use client";

import { CreatorBattle } from "./components/CreatorBattle";
import { ContestTimer } from "./components/ContestTimer";
import { FlipHeader } from "./components/FlipHeader";
import { CoinComparison } from "./components/CoinComparison";
import {
  UserAddressProvider,
  useUserAddress,
} from "~/contexts/UserAddressContext";

// Creator addresses
const KISMET_ADDRESS = "0x91169bfa46481ba2b0db01bfdfd3d5be3d3dceb8";

type PreContestScreenProps = {
  onNavigateToOngoing?: () => void;
};

function PreContestScreenContent({
  onNavigateToOngoing,
}: PreContestScreenProps) {
  const { zoraProfileAddress } = useUserAddress();

  // Mock contest start time - 2 hours from now
  const contestStartTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

  // Contest start timestamp (24 hours ago for comparison purposes)
  const startTimestamp = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <FlipHeader />

      {/* Countdown Timer */}
      <div className="px-3 py-2">
        <ContestTimer contestStartTime={contestStartTime} />
      </div>

      {/* Main Content */}
      <div className="pb-3">
        <CreatorBattle />

        {/* Testing Navigation Button */}
        {onNavigateToOngoing && (
          <div className="px-3 py-4">
            <button
              onClick={onNavigateToOngoing}
              className="w-full bg-lime-400 text-black font-semibold py-3 px-6 rounded-full border-2 border-black hover:bg-lime-300 transition-colors"
            >
              🧪 Test Navigation → Ongoing Contest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function PreContestScreen({
  onNavigateToOngoing,
}: PreContestScreenProps) {
  return (
    <UserAddressProvider>
      <PreContestScreenContent onNavigateToOngoing={onNavigateToOngoing} />
    </UserAddressProvider>
  );
}
