"use client";

import React from 'react';
import { useCrossAppAccounts, usePrivy } from "@privy-io/react-auth";

// SVG Asterisk Icon Component
const AsteriskIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
  >
    <g fill="#84cc16">
      <path d="M12 2a1 1 0 0 1 1 1v8.586l6.293-6.293a1 1 0 0 1 1.414 1.414L14.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414L13 13.414V22a1 1 0 1 1-2 0v-8.586l-6.293 6.293a1 1 0 0 1-1.414-1.414L9.586 12 3.293 5.707a1 1 0 0 1 1.414-1.414L11 10.586V3a1 1 0 0 1 1-1z"/>
    </g>
  </svg>
);

// Dot Pattern Background Component
const DotPattern = () => (
  <div 
    className="absolute inset-0 opacity-30"
    style={{
      backgroundImage: `radial-gradient(circle, #9ca3af 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0'
    }}
  />
);

export function AuthScreen() {
  const { ready, authenticated } = usePrivy();
  const { loginWithCrossAppAccount } = useCrossAppAccounts();

  const handleLogin = () => {
    loginWithCrossAppAccount({ appId: "clpgf04wn04hnkw0fv1m11mnb" });
  };

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      {/* Dot Pattern Background */}
      <DotPattern />
      
      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col px-6">
        {/* Header */}
        <div className="flex justify-between items-center pt-4 pb-8">
          <h1 className="text-2xl font-bold text-gray-700">flip</h1>
          <AsteriskIcon />
        </div>
        
        {/* Spacer to push content to bottom third */}
        <div className="flex-1" />
        
        {/* Main Text Content Block */}
        <div className="pb-8">
          <div className="space-y-1">
            <div className="text-4xl font-medium text-gray-700 leading-tight">
              Creators battle.
            </div>
            <div className="text-4xl font-bold text-black leading-tight">
              Support by trading.
            </div>
            <div className="text-4xl font-medium text-gray-400 leading-tight">
              Win together.
            </div>
            <div className="text-4xl font-medium text-gray-400 leading-tight">
              Win big.
            </div>
          </div>
        </div>

        {/* Zora Connect Button */}
        <div className="pb-12">
          <button
            onClick={handleLogin}
            disabled={!ready || authenticated}
            className="w-full px-6 py-4 bg-lime-400 hover:bg-lime-500 disabled:bg-lime-500 disabled:opacity-50 text-black text-lg font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
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
        </div>
      </div>
    </div>
  );
}
