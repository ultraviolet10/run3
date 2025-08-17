"use client";

import { useState, useCallback } from "react";

export function useShareDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [creatorName, setCreatorName] = useState<string>("");

  const openDrawer = useCallback((creator?: string) => {
    if (creator) {
      setCreatorName(creator);
    }
    setIsOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openWithWaitlistSuccess = useCallback((creator: string) => {
    setCreatorName(creator);
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    creatorName,
    openDrawer,
    closeDrawer,
    openWithWaitlistSuccess,
  };
}
