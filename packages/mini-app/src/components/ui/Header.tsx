"use client";

import { useState, useCallback } from "react";
import { APP_NAME } from "~/lib/constants";
import sdk from "@farcaster/miniapp-sdk";
import { useMiniApp } from "@neynar/react";
import { SignIn as SignInCore } from "@farcaster/miniapp-sdk";
import { useQuickAuth } from "~/hooks/useQuickAuth";
import { Button } from "./Button";

type HeaderProps = {
  neynarUser?: {
    fid: number;
    score: number;
  } | null;
};

export function Header({ neynarUser }: HeaderProps) {
  const { context } = useMiniApp();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [authState, setAuthState] = useState({
    signingIn: false,
    signingOut: false,
  });
  const [signInFailure, setSignInFailure] = useState<string>();

  // --- Hooks ---
  const { status, signIn, signOut } = useQuickAuth();

  // --- Handlers ---
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

  return (
    <div className="relative">
      <div className="mt-4 mb-4 mx-4 px-2 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between border-[3px] border-double border-primary">
        <div className="text-lg font-light">Welcome to {APP_NAME}!</div>

        {/* Show sign in button when not authenticated */}
        {status !== "authenticated" && (
          <Button
            onClick={handleSignIn}
            disabled={authState.signingIn}
            className="text-sm px-3 py-1"
          >
            {authState.signingIn ? "Signing in..." : "Sign In"}
          </Button>
        )}

        {/* Show profile avatar when authenticated */}
        {status === "authenticated" && context?.user && (
          <div
            className="cursor-pointer"
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
            }}
          >
            {context.user.pfpUrl && (
              <img
                src={context.user.pfpUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
            )}
          </div>
        )}
      </div>
      {status === "authenticated" && context?.user && (
        <>
          {isUserDropdownOpen && (
            <div className="absolute top-full right-0 z-50 w-fit mt-1 mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-3 space-y-2">
                <div className="text-right">
                  <h3
                    className="font-bold text-sm hover:underline cursor-pointer inline-block"
                    onClick={() =>
                      sdk.actions.viewProfile({ fid: context.user.fid })
                    }
                  >
                    {context.user.displayName || context.user.username}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    @{context.user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    FID: {context.user.fid}
                  </p>
                  {neynarUser && (
                    <>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Neynar Score: {neynarUser.score}
                      </p>
                    </>
                  )}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <Button
                    onClick={handleSignOut}
                    disabled={authState.signingOut}
                    className="w-full text-sm px-2 py-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    {authState.signingOut ? "Signing out..." : "🚪 Sign out"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Error Display for Sign In */}
      {signInFailure && !authState.signingIn && (
        <div className="absolute top-full left-0 right-0 z-40 mt-1 mx-4 p-2 text-xs bg-red-100 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
          <div className="font-semibold text-red-700 dark:text-red-300 mb-1">
            Authentication Error
          </div>
          <div className="text-red-600 dark:text-red-400">{signInFailure}</div>
        </div>
      )}
    </div>
  );
}
