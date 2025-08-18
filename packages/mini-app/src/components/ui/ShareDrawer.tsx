"use client";

import React from "react";
import Image from "next/image";
import { useMiniApp } from "@neynar/react";

type ShareDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ShareDrawer({ isOpen, onClose }: ShareDrawerProps) {
  const { context, actions } = useMiniApp();
  const shareText = `your favorite daily onchain spectacle ⚔️ @blitzdotfun`;

  const handleTwitterShare = () => {
    // Get the mini app URL for sharing
    const appUrl = "https://farcaster.xyz/miniapps/Kb45TQPDPpWb/blitz";
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : appUrl;

    // Build Twitter intent URL with proper parameters matching working example
    const twitterParams = new URLSearchParams({
      original_referer: encodeURIComponent(currentUrl),
      ref_src: "twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E",
      text: shareText,
      url: appUrl,
      // hashtags: "blitz,zora,creatorbattles,onchain",
    });

    const twitterUrl = `https://x.com/intent/tweet?${twitterParams.toString()}`;
    actions.openUrl(twitterUrl);
  };

  const handleFarcasterShare = async () => {
    try {
      // Create dynamic waitlist card image URL
      const cardImageUrl = context?.user?.fid
        ? `${window.location.origin}/api/waitlist-card?fid=${context.user.fid}`
        : null;

      // Mini app URL as embed
      const appUrl = "https://farcaster.xyz/miniapps/Kb45TQPDPpWb/blitz";

      // Build embeds array with both card image and app URL
      const embeds: string[] = [];
      embeds.push(appUrl);
      if (cardImageUrl) embeds.push(cardImageUrl);

      // Use actions.composeCast for proper Farcaster integration
      await actions.composeCast({
        text: shareText,
        embeds:
          embeds.length === 1
            ? [embeds[0]]
            : embeds.length === 2
            ? [embeds[0], embeds[1]]
            : undefined,
      });
    } catch (error) {
      console.error("Failed to share on Farcaster:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
        relative w-full max-w-sm bg-black rounded-t-2xl shadow-2xl
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}
      `}
        style={{
          backgroundColor: "#161616",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Share Your Entry</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Card Preview */}
          {context?.user?.fid && (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-gray-400">Your waitlist card</span>
              <div className="relative w-full max-w-xs aspect-[1.91/1] rounded-lg overflow-hidden border border-gray-700">
                <Image
                  src={`${window.location.origin}/api/waitlist-card?fid=${context.user.fid}`}
                  alt="Waitlist Card Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Share Icons */}
          <div className="flex justify-center space-x-6">
            {/* X post */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleTwitterShare}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                title="Share on X"
              >
                <Image
                  src="/x.svg"
                  alt="X"
                  width={16}
                  height={16}
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </button>
              <span className="text-xs text-white">X</span>
            </div>

            {/* Farcaster */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={handleFarcasterShare}
                className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                title="Share on Farcaster"
              >
                <Image
                  src="/farcaster.svg"
                  alt="Farcaster"
                  width={16}
                  height={16}
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </button>
              <span className="text-xs text-white">Farcaster</span>
            </div>
          </div>
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-6" />
      </div>
    </div>
  );
}
