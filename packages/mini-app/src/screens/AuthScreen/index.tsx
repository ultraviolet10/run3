"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useMiniApp } from "@neynar/react";
import { useFarcasterTransaction } from "~/hooks/useFarcasterTransaction";
import { useShareDrawer } from "~/hooks/useShareDrawer";
import { ShareDrawer } from "~/components/ui/ShareDrawer";
import { useWaitlist } from "~/hooks/useWaitlist";

export function AuthScreen() {
  const { context } = useMiniApp();
  const { address, connectFarcasterWallet, isConnected, signWaitlistMessage } =
    useFarcasterTransaction();
  const { isOpen, creatorName, closeDrawer, openWithWaitlistSuccess } =
    useShareDrawer();
  const { submitToWaitlist, checkWaitlistStatus, isSubmitting } = useWaitlist();
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false);
  const [isCheckingWaitlist, setIsCheckingWaitlist] = useState(false);
  const [_waitlistData, setWaitlistData] = useState<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      if (context?.user?.fid) {
        setIsCheckingWaitlist(true);
        try {
          const result = await checkWaitlistStatus(context.user.fid.toString());
          if (result.success && result.data) {
            setHasJoinedWaitlist(true);
          }
        } catch (error) {
          console.error("Error checking waitlist status:", error);
        } finally {
          setIsCheckingWaitlist(false);
        }
      }
    };

    checkStatus();
  }, [context?.user?.fid, checkWaitlistStatus]);

  const handleJoinWaitlist = async () => {
    try {
      if (context?.user && !isConnected) {
        try {
          await connectFarcasterWallet();
        } catch (connectError) {
          console.error("Connection error:", connectError);
        }
      }

      if (context?.user?.fid) {
        try {
          const signature = await signWaitlistMessage();

          const completeWaitlistData = {
            // User Profile Data
            fid: context.user.fid.toString(),
            username: context.user.username,
            displayName: context.user.displayName,
            pfpUrl: context.user.pfpUrl,
            location: context.user.location,

            // Wallet Data
            walletAddress: address,

            // Signature Data
            signature: signature,
            signatureMessage: `Join the waitlist for Blitz! - ${new Date().toISOString()}`,

            // Metadata
            chainId: context.client?.platformType || "web",
            clientFid: context.client?.clientFid?.toString(),
            platformType: context.client?.platformType,

            fullContext: context,
          };

          setWaitlistData(completeWaitlistData);

          try {
            await submitToWaitlist(completeWaitlistData);
          } catch (apiError) {
            console.error("❌ Database operation failed:", apiError);
          }

          openWithWaitlistSuccess("Creator Battle");
        } catch (signError) {
          console.error("Sign error:", signError);
          throw signError;
        }
      } else {
        throw new Error(
          "Please ensure you're accessing this from within Farcaster"
        );
      }

      setHasJoinedWaitlist(true);

      openWithWaitlistSuccess("Creator Battle");
    } catch (error) {
      console.error("Error joining waitlist:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      // isSubmitting is handled by useWaitlist hook
    }
  };

  return (
    <div className="h-screen relative overflow-hidden bg-white">
      {/* Background with blur-bg.svg at top left */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
        <Image
          src="/blur-bg.svg"
          alt="Background Blur"
          width={800}
          height={800}
          className="object-contain opacity-80"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col px-6">
        {/* Top Right BLITZ Logo */}
        <div className="flex justify-end pt-4">
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2">
              <Image
                src="/icon.svg"
                alt="Logo"
                width={24}
                height={24}
                className="w-full h-full"
              />
            </div>
            <div
              className="text-lg font-bold uppercase"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px #67CE67",
                wordSpacing: "2px",
              }}
            >
              BLITZ
            </div>
          </div>
        </div>
        {/* Spacer to push content to bottom third */}
        <div className="flex-1" />

        {/* Main Text Content Block */}
        <div className="pb-8">
          <div className="space-y-1">
            <div
              className="text-4xl font-bold uppercase leading-tight"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px #67CE67",
                wordSpacing: "2px",
              }}
            >
              Creators battle.
            </div>
            <div
              className="text-4xl font-bold uppercase leading-tight"
              style={{
                color: "transparent",
                WebkitTextStroke: "1px #67CE67",
                wordSpacing: "2px",
              }}
            >
              You support.
            </div>
            <div
              className="text-4xl font-bold uppercase leading-tight"
              style={{
                color: "#67CE67",
                wordSpacing: "2px",
              }}
            >
              Win together.
            </div>
          </div>
        </div>

        {/* Join Waitlist Button */}
        <div className="pb-12">
          <button
            onClick={handleJoinWaitlist}
            disabled={isSubmitting || hasJoinedWaitlist || isCheckingWaitlist}
            className="w-full px-6 py-4 text-2xl font-bold rounded-full transition-all duration-200 hover:opacity-90 active:scale-99 text-[#124D04]"
            style={{
              fontFamily: "var(--font-grotesk)",
              background: hasJoinedWaitlist
                ? "linear-gradient(90deg, #86EFAC 0%, #4ADE80 100%)"
                : "linear-gradient(90deg, #A6EC9C 0%, #B8EF92 100%)",
              border: "3px solid #67CE67",
            }}
          >
            {isCheckingWaitlist ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-[#124D04] border-t-transparent rounded-full animate-spin"></div>
                <span>Checking Status...</span>
              </div>
            ) : isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-[#124D04] border-t-transparent rounded-full animate-spin"></div>
                <span>joining waitlist ⏳</span>
              </div>
            ) : hasJoinedWaitlist ? (
              "✓ battle incoming ✓"
            ) : (
              "join waitlist"
            )}
          </button>
        </div>
      </div>

      {/* Share Drawer */}
      <ShareDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        creatorName={creatorName}
      />
    </div>
  );
}
