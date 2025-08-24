"use client";

import { useState } from "react";
import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";
import { InfoDrawer } from "./InfoDrawer";

// Lightning Icon Component
const LightningIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
  </svg>
);

// Info Icon Component
const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="m12 16 0-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="m12 8 .01 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Share Icon Component
const ShareIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="16,6 12,2 8,6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="2"
      x2="12"
      y2="15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function FlipHeader() {
  const { ready, authenticated, user } = usePrivy();
  const { loginWithCrossAppAccount } = useCrossAppAccounts();
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);

  return (
    <>
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
        {/* Left - Lightning Icon */}
        <div className="w-9 h-9 rounded-full bg-lime-400 flex items-center justify-center">
          <LightningIcon />
        </div>

        {/* Right - Info and Share Icons */}
        <div className="flex items-center space-x-2">
          {ready && authenticated && user ? (
            <div className="px-5 py-2 bg-lime-400 text-black text-sm font-semibold rounded-full border-2 border-lime-500">
              Connected
            </div>
          ) : (
            <button
              onClick={() =>
                loginWithCrossAppAccount({ appId: "clpgf04wn04hnkw0fv1m11mnb" })
              }
              disabled={!ready}
              className="px-5 py-2 bg-lime-400 hover:bg-lime-500 disabled:bg-lime-500 disabled:opacity-50 text-black text-sm font-semibold rounded-full border-2 border-lime-500 transition-all duration-200"
            >
              {!ready ? "Loading..." : "Connect Wallet"}
            </button>
          )}
          <button
            onClick={() => setIsInfoDrawerOpen(true)}
            className="text-gray-600 hover:text-gray-800 transition-colors p-1"
          >
            <InfoIcon />
          </button>
          <button className="text-gray-600 hover:text-gray-800 transition-colors p-1">
            <ShareIcon />
          </button>
        </div>
      </div>

      {/* Info Drawer */}
      <InfoDrawer
        isOpen={isInfoDrawerOpen}
        onClose={() => setIsInfoDrawerOpen(false)}
      />
    </>
  );
}
