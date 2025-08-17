"use client";

import { useMiniApp } from "@neynar/react";
import { AuthScreen } from "~/screens/AuthScreen";

// --- Types ---

export interface AppProps {
  title?: string;
}

/**
 * Flip App - Creator Battle Mini App
 *
 * This is the main container for the Flip mini app, currently showing
 * only the AuthScreen with waitlist functionality.
 *
 * @param props - Component props
 * @param props.title - Optional title for the mini app (defaults to "Flip")
 */
export default function App(
  { title: _title }: AppProps = { title: "Flip" }
) {
  // --- Hooks ---
  const { isSDKLoaded, context } = useMiniApp();

  // --- Early Returns ---
  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-gray-800 border-t-green-500 rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading Flip...</p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <AuthScreen />
    </div>
  );
}
