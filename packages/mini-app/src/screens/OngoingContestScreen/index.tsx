"use client";

import { FlipHeader } from "../PreContestScreen/components/FlipHeader";
import { CreatorPost } from "./components/CreatorPost";
import { StaticCreatorPost } from "./components/StaticCreatorPost";
import { ContestTimer } from "./components/ContestTimer";
import { UserAddressProvider } from "~/contexts/UserAddressContext";
import { Swords } from "lucide-react";

const KISMET_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";

type OngoingContestScreenProps = {
  onNavigateToPreContest?: () => void;
  onNavigateToEnded?: () => void;
};

export function OngoingContestScreen({
  onNavigateToPreContest: _onNavigateToPreContest,
  onNavigateToEnded,
}: OngoingContestScreenProps) {
  // Mock contest end time - 1 hour from now
  const contestEndTime = new Date(Date.now() + 1 * 60 * 60 * 1000);

  return (
    <UserAddressProvider>
      <div className="h-screen bg-black flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0">
          <FlipHeader />
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            {/* Contest Title */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white mb-1">
                  Creator Battle - Live
                </h2>
                <p className="text-gray-400 text-xs">
                  Battle in progress. Support your favorite creator!
                </p>
              </div>
              {/* Test Navigation Button */}
              {onNavigateToEnded && (
                <button
                  onClick={onNavigateToEnded}
                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Test End
                </button>
              )}
            </div>

            {/* Creator Posts */}
            <div className="space-y-6">
              <CreatorPost _isFirst={true} />
              
              {/* VS Separator */}
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Swords className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-lg font-bold text-white tracking-wider">
                    VS
                  </span>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Swords className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
              
              <StaticCreatorPost 
                creatorAddress={KISMET_ADDRESS}
                _isFirst={false}
              />
            </div>
          </div>
        </div>

        {/* Fixed Timer Footer */}
        <div className="flex-shrink-0">
          <ContestTimer contestEndTime={contestEndTime} />
        </div>
      </div>
    </UserAddressProvider>
  );
}
