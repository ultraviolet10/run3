"use client";

import { useEffect } from "react";

type InfoDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Close Icon Component
const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function InfoDrawer({ isOpen, onClose }: InfoDrawerProps) {
  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-black rounded-t-3xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">How to Play Blitz?</h2>
            <p className="text-gray-400 text-sm mt-1">Welcome to ⚡ Blitz!</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-6 text-white">
            {/* Section 1 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="text-lime-400 mr-2">1.</span>
                Creators battle.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed ml-6">
                Each creator stakes 10% of their market cap into the prize pool.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="text-lime-400 mr-2">2.</span>
                You support by trading.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed ml-6">
                Buy your favorite creator&apos;s coin on Zora during the battle to back them. 
                The more you trade, the stronger your support — and your chance to win.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="text-lime-400 mr-2">3.</span>
                Winners take the prize.
              </h3>
              <div className="ml-6 space-y-2">
                <div className="flex items-start">
                  <span className="text-lime-400 mr-2 text-sm">•</span>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The winning creator receives 60% of the total pool.
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-lime-400 mr-2 text-sm">•</span>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The top 10 supporters share the remaining 40%, based on their contribution.
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-lime-400 mr-2 text-sm">•</span>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The losing creator loses their stake.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-800 pt-4">
              <p className="text-gray-300 text-sm leading-relaxed mb-3">
                There&apos;s no limit to how many battles you can join or how much you can trade.
              </p>
              <p className="text-white text-sm font-medium">
                Your trade is your vote. Back creators, grow their market cap, and win big together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
