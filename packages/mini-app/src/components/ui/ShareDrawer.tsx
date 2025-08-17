"use client";

import React, { useState } from "react";
import Image from "next/image";

type ShareDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  creatorName?: string;
};

export function ShareDrawer({
  isOpen,
  onClose,
  creatorName = "Creator",
}: ShareDrawerProps) {
  const [copied, setCopied] = useState(false);
  const shareText = `Just joined the waitlist for the ${creatorName} creator battle on Blitz! 🚀 Ready to support and win together. #BlitzCreatorBattle #Crypto`;
  const shareUrl = window.location.href;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleFarcasterShare = () => {
    const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.open(farcasterUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
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
        relative w-full max-w-md bg-white rounded-t-2xl border-t border-gray-200 shadow-2xl
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 font-syne">
            Share Your Battle Join
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Image
              src="/close.svg"
              alt="Close"
              width={16}
              height={16}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(27%) sepia(8%) saturate(1567%) hue-rotate(314deg) brightness(91%) contrast(88%)",
              }}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Preview Text */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-syne">Preview:</p>
            <p className="text-sm text-gray-700 font-syne leading-relaxed">
              {shareText}
            </p>
          </div>

          {/* Share Icons */}
          <div className="flex justify-center space-x-6 pt-2">
            {/* Twitter Share */}
            <button
              onClick={handleTwitterShare}
              className="w-12 h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors group"
              title="Share on Twitter"
            >
              <Image
                src="/x.svg"
                alt="Twitter"
                width={18}
                height={18}
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </button>

            {/* Farcaster Share */}
            <button
              onClick={handleFarcasterShare}
              className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors group"
              title="Share on Farcaster"
            >
              <Image
                src="/farcaster.svg"
                alt="Farcaster"
                width={19}
                height={18}
              />
            </button>

            {/* Copy URL */}
            <button
              onClick={handleCopyUrl}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group border ${
                copied
                  ? "bg-green-500 hover:bg-green-600 border-green-500"
                  : "bg-gray-200 hover:bg-gray-300 border-gray-300"
              }`}
              title={copied ? "Copied!" : "Copy URL"}
            >
              {copied ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 4.5L6.75 12.75L3 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <Image
                  src="/copy.svg"
                  alt="Copy"
                  width={18}
                  height={18}
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(27%) sepia(8%) saturate(1567%) hue-rotate(314deg) brightness(91%) contrast(88%)",
                  }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Bottom padding for safe area */}
        <div className="h-6" />
      </div>
    </div>
  );
}
