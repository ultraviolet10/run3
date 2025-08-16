"use client";

import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";
import { Zap, Shield, Users } from "lucide-react";

export function AuthScreen() {
  const { ready, authenticated } = usePrivy();
  const { loginWithCrossAppAccount } = useCrossAppAccounts();

  const handleLogin = () => {
    loginWithCrossAppAccount({ appId: "clpgf04wn04hnkw0fv1m11mnb" });
  };

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center px-6">
      {/* Logo/Brand Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8 text-black" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
          flip
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          The ultimate creator battle platform. Connect your Zora account to join the competition.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 gap-4 mb-12 max-w-sm w-full">
        <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Creator Battles</h3>
            <p className="text-gray-400 text-xs">Compete with top creators</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Real-time Stats</h3>
            <p className="text-gray-400 text-xs">Track performance live</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Secure & Private</h3>
            <p className="text-gray-400 text-xs">Your data stays protected</p>
          </div>
        </div>
      </div>

      {/* Authentication Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={handleLogin}
          disabled={!ready || authenticated}
          className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-green-600 disabled:opacity-50 text-black text-lg font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          {!ready ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : (
            "Connect with Zora"
          )}
        </button>
        
        <p className="text-center text-gray-500 text-xs mt-4">
          By connecting, you agree to our terms and privacy policy
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-green-500 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-32 right-16 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-60 right-12 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-30"></div>
    </div>
  );
}
