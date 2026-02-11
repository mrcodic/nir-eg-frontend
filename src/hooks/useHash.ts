"use client";

import { useEffect, useState } from "react";

export function useHash() {
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    // Set initial hash
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHash(window.location.hash);

    // Listen for hash changes
    const handleHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return hash;
}
