"use client";

import { useState, useCallback } from "react";
import { useMiniApp } from "@neynar/react";
import sdk from "@farcaster/miniapp-sdk";
import { SignIn as SignInCore } from "@farcaster/miniapp-sdk";
import { useQuickAuth } from "~/hooks/useQuickAuth";
import { useNeynarUser } from "~/hooks/useNeynarUser";

type FlipHeaderProps = {
  neynarUser?: {
    fid: number;
    score: number;
  } | null;
};

export function FlipHeader({ neynarUser }: FlipHeaderProps = {}) {
  const { context } = useMiniApp();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [authState, setAuthState] = useState({
    signingIn: false,
    signingOut: false,
  });
  const [signInFailure, setSignInFailure] = useState<string>();
  const { status, signIn, signOut } = useQuickAuth();

  // Get neynar user data
  const { user: neynarUserData } = useNeynarUser(context || undefined);
  const finalNeynarUser = neynarUser || neynarUserData;

  const handleSignIn = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, signingIn: true }));
      setSignInFailure(undefined);

      const success = await signIn();

      if (!success) {
        setSignInFailure("Authentication failed");
      }
    } catch (e) {
      if (e instanceof SignInCore.RejectedByUser) {
        setSignInFailure("Rejected by user");
        return;
      }
      setSignInFailure("Unknown error");
    } finally {
      setAuthState((prev) => ({ ...prev, signingIn: false }));
    }
  }, [signIn]);

  const handleSignOut = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, signingOut: true }));
      setIsUserDropdownOpen(false);
      await signOut();
    } finally {
      setAuthState((prev) => ({ ...prev, signingOut: false }));
    }
  }, [signOut]);

  const handleProfileClick = useCallback(() => {
    if (context?.user) {
      sdk.actions.viewProfile({ fid: context.user.fid });
    }
  }, [context?.user]);

  return (
    <div className="relative">
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
        {/* App Name */}
        <h1 className="text-xl font-bold text-white tracking-tight">flip</h1>

        {/* Show sign in button when not authenticated */}
        {status !== "authenticated" && (
          <button
            onClick={handleSignIn}
            disabled={authState.signingIn}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-600 text-black text-sm font-semibold rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {authState.signingIn ? "Connecting..." : "Connect"}
          </button>
        )}

        {/* Avatar */}
        {status === "authenticated" && context?.user && (
          <div
            className="cursor-pointer relative"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            {context.user.pfpUrl ? (
              <img
                src={context.user.pfpUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-600 hover:border-green-500 transition-colors"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-black text-sm font-semibold">
                  {context.user.displayName?.[0] ||
                    context.user.username?.[0] ||
                    "U"}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Dropdown */}
      {isUserDropdownOpen && status === "authenticated" && context?.user && (
        <div className="absolute top-full right-4 z-50 w-72 mt-2 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          <div className="p-5">
            <div className="flex items-start space-x-4 mb-4">
              {context.user.pfpUrl ? (
                <img
                  src={context.user.pfpUrl}
                  alt="Profile"
                  className="w-14 h-14 rounded-full border-2 border-gray-600"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center border-2 border-gray-600">
                  <span className="text-black font-bold text-lg">
                    {context.user.displayName?.[0] ||
                      context.user.username?.[0] ||
                      "U"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-white hover:text-green-400 cursor-pointer transition-colors truncate"
                  onClick={handleProfileClick}
                >
                  {context.user.displayName || context.user.username}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  @{context.user.username}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-xs text-gray-500">FID: {context.user.fid}</p>
                  {finalNeynarUser && (
                    <p className="text-xs text-green-400 font-medium">
                      Score: {finalNeynarUser.score}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={handleSignOut}
                disabled={authState.signingOut}
                className="w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>🚪</span>
                <span>{authState.signingOut ? "Signing out..." : "Sign out"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display for Sign In */}
      {signInFailure && !authState.signingIn && (
        <div className="absolute top-full left-4 right-4 z-40 mt-2 p-4 bg-red-900/90 backdrop-blur-sm rounded-xl border border-red-700 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-red-400">⚠️</span>
            <div className="font-semibold text-red-300 text-sm">
              Authentication Error
            </div>
          </div>
          <div className="text-red-400 text-sm">{signInFailure}</div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </div>
  );
}
