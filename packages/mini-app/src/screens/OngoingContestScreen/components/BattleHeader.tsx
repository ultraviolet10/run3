"use client";

import { usePrivy } from "@privy-io/react-auth";
import { InfoIcon } from "~/components/shared/Icons";

type BattleHeaderProps = {
  onNavigateToEnded?: () => void;
};

export function BattleHeader({ onNavigateToEnded }: BattleHeaderProps) {
  const { login, authenticated, logout } = usePrivy();

  const handleWalletAction = () => {
    if (authenticated) {
      logout();
    } else {
      login();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-gray-50">
      {/* Left - Flip Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 italic">flip</h1>
      </div>

      {/* Right - Connect Wallet Button and Info Icon */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleWalletAction}
          className="bg-lime-400 text-black font-semibold px-4 py-2 rounded-full border border-gray-600 hover:bg-lime-300 transition-colors"
        >
          {authenticated ? "Disconnect" : "Connect Wallet"}
        </button>
        
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <InfoIcon className="w-4 h-4 text-white" />
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
    </div>
  );
}
