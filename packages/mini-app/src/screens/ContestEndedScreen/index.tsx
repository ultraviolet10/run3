"use client";

import { FlipHeader } from "../PreContestScreen/components/FlipHeader";
import { EndedCreatorCards } from "./components/EndedCreatorCards";
import { WinnerAnnouncement } from "./components/WinnerAnnouncement";
import { UserAddressProvider } from "~/contexts/UserAddressContext";

const _KISMET_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";

type ContestEndedScreenProps = {
  onNavigateToPreContest?: () => void;
};

export function ContestEndedScreen({ onNavigateToPreContest }: ContestEndedScreenProps) {
  return (
    <UserAddressProvider>
      <div className="min-h-screen bg-gray-50 pb-safe">
        {/* Header */}
        <FlipHeader />

        {/* Main Content */}
        <div className="px-3 py-3 space-y-4">
          {/* Creator Cards with Final Scores */}
          <EndedCreatorCards />

          {/* Winner Announcement */}
          <WinnerAnnouncement />

          {/* Reset Button for Testing */}
          {onNavigateToPreContest && (
            <div className="flex justify-center">
              <button
                onClick={onNavigateToPreContest}
                className="bg-lime-400 hover:bg-lime-300 text-black font-semibold py-3 px-6 rounded-full transition-colors"
              >
                🧪 Reset Contest (Testing)
              </button>
            </div>
          )}
        </div>
      </div>
    </UserAddressProvider>
  );
}
