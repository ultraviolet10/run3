"use client";

import { useState } from "react";
import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";

// Info Icon Component
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="m12 16 0-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="m12 8 .01 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export function FlipHeader() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const {ready, authenticated, user} = usePrivy();
  const { loginWithCrossAppAccount } = useCrossAppAccounts();

  return (
    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
      {/* App Name - Italicized */}
      <h1 className="text-xl font-bold text-gray-700 font-syne italic">flip</h1>

      {/* Right side with Connect Wallet and Info */}
      <div className="flex items-center space-x-3">
        {ready && authenticated && user ? (
          /* Show user info when authenticated */
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-syne">Connected</span>
            <div
              className="cursor-pointer relative"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center border border-lime-500 hover:border-lime-600 transition-colors">
                <span className="text-black text-sm font-semibold">
                  {user.id?.slice(0, 2).toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Show Connect Wallet button when not authenticated */
          <button
            onClick={() =>
              loginWithCrossAppAccount({ appId: "clpgf04wn04hnkw0fv1m11mnb" })
            }
            disabled={!ready}
            className="px-4 py-2 bg-lime-400 hover:bg-lime-500 disabled:bg-lime-500 disabled:opacity-50 text-black text-sm font-semibold font-syne rounded-full border border-lime-500 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {!ready ? "Loading..." : "Connect Wallet"}
          </button>
        )}
        
        {/* Info Icon */}
        <button className="text-gray-600 hover:text-gray-800 transition-colors">
          <InfoIcon />
        </button>
      </div>
    </div>
  );
}
