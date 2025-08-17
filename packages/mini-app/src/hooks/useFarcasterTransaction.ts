"use client";

import { useCallback, useState, useEffect } from "react";
import {
  useAccount,
  useSendTransaction,
  useSignTypedData,
  useChainId,
  useConnect,
  useDisconnect,
} from "wagmi";
import { useMiniApp } from "@neynar/react";

export function useFarcasterTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isFarcasterConnected, setIsFarcasterConnected] = useState(false);

  const { context } = useMiniApp();
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { sendTransaction } = useSendTransaction();
  const { signTypedData } = useSignTypedData();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Check if we're connected via Farcaster connector
  useEffect(() => {
    const isUsingFarcaster =
      connector?.name === "Farcaster Frame" ||
      connector?.name === "farcasterFrame" ||
      connector?.name === "Farcaster" ||
      connector?.id === "farcasterFrame";
    setIsFarcasterConnected(isUsingFarcaster);
  }, [connector]);

  // Function to ensure Farcaster wallet connection
  const ensureFarcasterConnection = useCallback(async () => {
    console.log(
      "Available connectors:",
      connectors.map((c) => ({ name: c.name, id: c.id }))
    );

    // Try multiple possible names for the Farcaster connector
    const farcasterConnector = connectors.find(
      (c) =>
        c.name === "Farcaster Frame" ||
        c.name === "farcasterFrame" ||
        c.name === "Farcaster" ||
        c.id === "farcasterFrame"
    );

    if (!farcasterConnector) {
      console.error(
        "Available connector names:",
        connectors.map((c) => c.name)
      );
      throw new Error(
        `Farcaster connector not available. Available connectors: ${connectors
          .map((c) => c.name)
          .join(", ")}`
      );
    }

    console.log("Found Farcaster connector:", farcasterConnector.name);

    // If not connected to Farcaster, disconnect current and connect to Farcaster
    if (!isFarcasterConnected && isConnected) {
      console.log("Disconnecting current wallet...");
      await disconnect();
    }

    if (!isFarcasterConnected) {
      console.log("Connecting to Farcaster wallet...");
      await connect({ connector: farcasterConnector });
    }
  }, [connectors, isFarcasterConnected, isConnected, connect, disconnect]);

  const acceptChallenge = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure we're connected via Farcaster wallet
      await ensureFarcasterConnection();

      if (!address) {
        setError("Farcaster wallet not connected");
        return;
      }

      // Option 1: Send a simple transaction (e.g., to a challenge contract)
      const challengeContractAddress =
        "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878"; // Example contract

      sendTransaction(
        {
          to: challengeContractAddress,
          value: BigInt(0), // No ETH value, just calling the contract
          data: "0x9846cd9e", // Example function selector for acceptChallenge()
        },
        {
          onSuccess: (hash) => {
            setTxHash(hash);
            setIsLoading(false);
            console.log("Challenge accepted! Transaction hash:", hash);
          },
          onError: (error) => {
            setError(error.message);
            setIsLoading(false);
          },
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setIsLoading(false);
    }
  }, [ensureFarcasterConnection, address, sendTransaction]);

  const signChallengeMessage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure we're connected via Farcaster wallet
      await ensureFarcasterConnection();

      if (!address) {
        setError("Farcaster wallet not connected");
        return;
      }

      // Sign a typed data message to accept the challenge
      signTypedData({
        domain: {
          name: "Flip Creator Battle",
          version: "1",
          chainId,
        },
        types: {
          Challenge: [
            { name: "creator", type: "address" },
            { name: "battleId", type: "uint256" },
            { name: "timestamp", type: "uint256" },
          ],
        },
        message: {
          creator: address,
          battleId: BigInt(1), // Example battle ID
          timestamp: BigInt(Math.floor(Date.now() / 1000)),
        },
        primaryType: "Challenge",
      });

      setIsLoading(false);
      console.log("Challenge message signed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signing failed");
      setIsLoading(false);
    }
  }, [ensureFarcasterConnection, address, chainId, signTypedData]);

  return {
    acceptChallenge,
    signChallengeMessage,
    connectFarcasterWallet: ensureFarcasterConnection,
    isLoading,
    error,
    txHash,
    isConnected: isFarcasterConnected,
    userFid: context?.user?.fid,
    address,
  };
}
