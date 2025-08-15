"use client";

import { FlipHeader } from "../PreContestScreen/components/FlipHeader";
import { ContestEndedTimer } from "./components/ContestEndedTimer";
import { StatsComparison } from "./components/StatsComparison";
import { WinnerAnnouncement } from "./components/WinnerAnnouncement";

// Creator addresses - must match those in other screens
const ARITRA_ADDRESS = "0xbcadc0da9c74d76825af50756ca0f4927a706723";
const KISMET_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";

type ContestEndedScreenProps = {
  onNavigateToPreContest?: () => void;
};

export function ContestEndedScreen({ onNavigateToPreContest: _onNavigateToPreContest }: ContestEndedScreenProps) {
  // Mock winner data - in real app this would come from contest results
  const winnerAddress = ARITRA_ADDRESS; // Aritra wins in this example

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <FlipHeader />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          {/* Contest Title */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-1">
              Creator Battle - Ended
            </h2>
            <p className="text-gray-400 text-xs">
              The battle has concluded! Here are the final results.
            </p>
          </div>

          {/* Winner Announcement */}
          <WinnerAnnouncement winnerAddress={winnerAddress} />

          {/* Stats Comparison */}
          <StatsComparison
            creatorAddress1={ARITRA_ADDRESS}
            creatorAddress2={KISMET_ADDRESS}
            winnerAddress={winnerAddress}
          />
        </div>
      </div>

      {/* Fixed Timer Footer with Confetti */}
      <div className="flex-shrink-0">
        <ContestEndedTimer />
      </div>
    </div>
  );
}
