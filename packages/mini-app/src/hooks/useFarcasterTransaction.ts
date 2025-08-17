"use client";

import { useCallback, useState, useEffect } from "react";
import {
  useAccount,
  useSendTransaction,
  useSignMessage,
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
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();
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
      signMessage({
        message: {
          raw: address,
        },
      });

      setIsLoading(false);
      console.log("Challenge message signed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signing failed");
      setIsLoading(false);
    }
  }, [ensureFarcasterConnection, address, signMessage]);

  const signWaitlistMessage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure we're connected via Farcaster wallet
      await ensureFarcasterConnection();

      if (!address) {
        setError("Farcaster wallet not connected");
        setIsLoading(false);
        return null;
      }

      // Create a waitlist message with timestamp for uniqueness
      const waitlistMessage = `Join Flip Waitlist\nAddress: ${address}\nTimestamp: ${Date.now()}`;

      console.log("About to sign message:", waitlistMessage);

      // Use the signMessage function with proper async/await pattern
      return new Promise<string>((resolve, reject) => {
        signMessage(
          { message: waitlistMessage },
          {
            onSuccess: (signature) => {
              console.log("Signature received:", signature);
              setIsLoading(false);
              resolve(signature);
            },
            onError: (error) => {
              console.error("Signing failed:", error);
              setError(error.message);
              setIsLoading(false);
              reject(error);
            },
          }
        );
      });
    } catch (err) {
      console.error("Error in signWaitlistMessage:", err);
      setError(err instanceof Error ? err.message : "Signing failed");
      setIsLoading(false);
      return null;
    }
  }, [ensureFarcasterConnection, address, signMessage]);

  return {
    acceptChallenge,
    signChallengeMessage,
    signWaitlistMessage,
    connectFarcasterWallet: ensureFarcasterConnection,
    isLoading,
    error,
    txHash,
    isConnected: isFarcasterConnected,
    userFid: context?.user?.fid,
    address,
  };
}
