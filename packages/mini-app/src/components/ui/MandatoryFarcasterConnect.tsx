"use client";

import React, { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

interface MandatoryFarcasterConnectProps {
  children: React.ReactNode;
}

export function MandatoryFarcasterConnect({ children }: MandatoryFarcasterConnectProps) {
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { connector } = useAccount();
  const { connect, connectors } = useConnect();

  // Check if connected via Farcaster
  const isFarcasterConnected = connector?.name === "Farcaster Frame" || 
                              connector?.name === "farcasterFrame" ||
                              connector?.name === "Farcaster" ||
                              connector?.id === "farcasterFrame";

  useEffect(() => {
    // Show modal if not connected via Farcaster
    if (!isFarcasterConnected) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [isFarcasterConnected]);

  const handleConnectFarcaster = async () => {
    setIsConnecting(true);
    
    try {
      console.log('Available connectors:', connectors.map(c => ({ name: c.name, id: c.id })));
      
      const farcasterConnector = connectors.find(c => 
        c.name === "Farcaster Frame" || 
        c.name === "farcasterFrame" ||
        c.name === "Farcaster" ||
        c.id === "farcasterFrame"
      );

      if (!farcasterConnector) {
        console.error('Available connector names:', connectors.map(c => c.name));
        throw new Error(`Farcaster connector not available. Available connectors: ${connectors.map(c => c.name).join(', ')}`);
      }

      await connect({ connector: farcasterConnector });
    } catch (error) {
      console.error('Farcaster connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!showModal) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-purple-600"
            >
              <path 
                d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Farcaster Wallet
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            To use Flip, you need to connect your Farcaster wallet. This enables you to participate in creator battles and manage your transactions securely.
          </p>

          {/* Connect Button */}
          <button
            onClick={handleConnectFarcaster}
            disabled={isConnecting}
            className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-lg font-bold rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              "Connect Farcaster Wallet"
            )}
          </button>

          {/* Footer text */}
          <p className="text-xs text-gray-500 mt-6">
            This connection is required to access all features of the app
          </p>
        </div>
      </div>

      {/* Hidden content until connected */}
      <div className="opacity-20 pointer-events-none">
        {children}
      </div>
    </>
  );
}
