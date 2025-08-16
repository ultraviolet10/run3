"use client";

import { useState } from "react";
import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";

export function FlipHeader() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const {ready, authenticated, user} = usePrivy();
  const { loginWithCrossAppAccount } = useCrossAppAccounts();

  return (
    <div className="relative">
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
        {/* App Name */}
        <h1 className="text-xl font-bold text-white tracking-tight">flip</h1>

        {/* Authentication UI */}
        {ready && authenticated && user ? (
          /* Show avatar when authenticated */
          <div
            className="cursor-pointer relative"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border border-gray-600 hover:border-green-500 transition-colors">
              <span className="text-black text-sm font-semibold">
                {user.linkedAccounts?.[0]?.subject?.slice(0, 2).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        ) : (
          /* Show login button when not authenticated */
          <button
            onClick={() =>
              loginWithCrossAppAccount({ appId: "clpgf04wn04hnkw0fv1m11mnb" })
            }
            disabled={!ready}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-600 disabled:opacity-50 text-black text-sm font-semibold rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {!ready ? "Loading..." : "Login with Zora"}
          </button>
        )}
      </div>
    </div>
  );
}
