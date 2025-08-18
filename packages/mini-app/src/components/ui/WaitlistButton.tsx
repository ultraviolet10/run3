"use client";

import React from "react";
import { useFarcasterTransaction } from "~/hooks/useFarcasterTransaction";
import { useShareDrawer } from "~/hooks/useShareDrawer";
import { ShareDrawer } from "./ShareDrawer";

type WaitlistButtonProps = {
  creatorName: string;
  className?: string;
};

export function WaitlistButton({ creatorName, className = "" }: WaitlistButtonProps) {
  const { signWaitlistMessage, isLoading, error } = useFarcasterTransaction();
  const { isOpen, creatorName: shareCreatorName, closeDrawer, openWithWaitlistSuccess } = useShareDrawer();

  const handleJoinWaitlist = async () => {
    try {
      const signature = await signWaitlistMessage();
      if (signature) {
        // Successfully signed waitlist message, open share drawer
        openWithWaitlistSuccess(creatorName);
      }
    } catch (err) {
      console.error("Failed to join waitlist:", err);
    }
  };

  return (
    <>
      <button
        onClick={handleJoinWaitlist}
        disabled={isLoading}
        className={`
          px-6 py-3 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-lg
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          font-syne ${className}
        `}
      >
        {isLoading ? "signing..." : "join waitlist"}
      </button>

      {error && (
        <p className="text-red-400 text-sm mt-2 font-syne">
          {error}
        </p>
      )}

      <ShareDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        creatorName={shareCreatorName}
      />
    </>
  );
}
