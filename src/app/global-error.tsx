"use client";

import "./globals.css";

import CustomGlobalError from "./CustomGlobalError";

export default function GlobalError({
  error,
  // reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <CustomGlobalError error={error} />;
}
