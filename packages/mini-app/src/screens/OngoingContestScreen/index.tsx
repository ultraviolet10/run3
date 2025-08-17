"use client";

import { BattleHeader } from "./components/BattleHeader";
import { CreatorPost } from "./components/CreatorPost";
import { StaticCreatorPost } from "./components/StaticCreatorPost";
import { BattleCountdownTimer } from "./components/BattleCountdownTimer";
import { UserAddressProvider } from "~/contexts/UserAddressContext";
import { Swords } from "lucide-react";

type OngoingContestScreenProps = {
  onNavigateToPreContest?: () => void;
  onNavigateToEnded?: () => void;
};

const KISMET_ADDRESS = "0x58f19e55058057b04feae2eea88f90b84b7714eb";

function OngoingContestScreenContent({ onNavigateToEnded }: OngoingContestScreenProps) {
  // Mock contest end time - 1 hour from now
  const contestEndTime = new Date(Date.now() + 1 * 60 * 60 * 1000);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <BattleHeader onNavigateToEnded={onNavigateToEnded} />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          {/* Contest Title */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-black mb-1">
                Creator Battle - Live
              </h2>
              <p className="text-gray-600 text-sm">
                Battle in progress. Support your favorite creator!
              </p>
            </div>
          </div>

          {/* Creator Posts */}
          <div className="space-y-6">
            <CreatorPost _isFirst={true} />
            
            {/* VS Separator */}
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
                  <Swords className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-bold text-black tracking-wider">
                  VS
                </span>
                <div className="w-8 h-8 bg-lime-400 rounded-full flex items-center justify-center">
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
        <BattleCountdownTimer contestEndTime={contestEndTime} />
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
