"use client";

import { FlipHeader } from "../PreContestScreen/components/FlipHeader";
import { ContestTimer } from "./components/ContestTimer";
import { UserAddressProvider } from "~/contexts/UserAddressContext";
import { OngoingCreatorBattle } from "./components/OngoingCreatorBattle";

type OngoingContestScreenProps = {
  onNavigateToPreContest?: () => void;
  onNavigateToEnded?: () => void;
};

const _KISMET_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";

function OngoingContestScreenContent({ onNavigateToEnded }: OngoingContestScreenProps) {
  // Mock contest end time - 1 hour from now
  const contestEndTime = new Date(Date.now() + 1 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Header */}
      <FlipHeader />

      {/* Countdown Timer */}
      <div className="px-3 py-2">
        <ContestTimer contestEndTime={contestEndTime} />
      </div>

      {/* Main Content */}
      <div className="pb-3">
        <OngoingCreatorBattle />

        {/* Testing Navigation Button */}
        {onNavigateToEnded && (
          <div className="px-3 py-4">
            <button
              onClick={onNavigateToEnded}
              className="w-full bg-lime-400 text-black font-semibold py-3 px-6 rounded-full border-2 border-black hover:bg-lime-300 transition-colors"
            >
              🧪 Test Navigation → Ended Contest
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function OngoingContestScreen(props: OngoingContestScreenProps) {
  return (
    <UserAddressProvider>
      <OngoingContestScreenContent {...props} />
    </UserAddressProvider>
  );
}
