"use client";

import React from 'react';
import { useFarcasterTransaction } from '~/hooks/useFarcasterTransaction';

interface AcceptChallengeButtonProps {
  className?: string;
  onSuccess?: (txHash: string) => void;
}

export function AcceptChallengeButton({ className = "", onSuccess }: AcceptChallengeButtonProps) {
  const { 
    acceptChallenge, 
    signChallengeMessage, 
    connectFarcasterWallet,
    isLoading, 
    error, 
    txHash, 
    isConnected, 
    userFid 
  } = useFarcasterTransaction();

  const handleAcceptChallenge = async () => {
    try {
      await acceptChallenge();
      if (txHash && onSuccess) {
        onSuccess(txHash);
      }
    } catch (err) {
      console.error('Challenge acceptance failed:', err);
    }
  };

  const handleSignMessage = async () => {
    try {
      await signChallengeMessage();
    } catch (err) {
      console.error('Message signing failed:', err);
    }
  };

  const handleConnectFarcaster = async () => {
    try {
      await connectFarcasterWallet();
    } catch (err) {
      console.error('Farcaster wallet connection failed:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className={`space-y-3 ${className}`}>
        <button
          onClick={handleConnectFarcaster}
          disabled={isLoading}
          className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-600 disabled:opacity-50 text-white text-lg font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            "Connect Farcaster Wallet"
          )}
        </button>
        <p className="text-gray-400 text-sm text-center">Connect your Farcaster wallet to accept the challenge</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Accept Challenge Button */}
      <button
        onClick={handleAcceptChallenge}
        disabled={isLoading || !isConnected}
        className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-green-600 disabled:opacity-50 text-white text-lg font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          "Accept Challenge"
        )}
      </button>

      {/* Alternative Sign Message Button */}
      <button
        onClick={handleSignMessage}
        disabled={isLoading || !isConnected}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all duration-200"
      >
        {isLoading ? "Signing..." : "Sign Challenge Message"}
      </button>

      {/* Status Messages */}
      {error && (
        <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">
          Error: {error}
        </div>
      )}

      {txHash && (
        <div className="text-green-400 text-sm text-center bg-green-900/20 p-2 rounded-lg">
          <p>Challenge accepted!</p>
          <p className="text-xs opacity-75">TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}</p>
        </div>
      )}

      {userFid && (
        <p className="text-gray-500 text-xs text-center">
          Farcaster ID: {userFid}
        </p>
      )}
    </div>
  );
}
