"use client";

import { purgeExpiredDrafts } from "@/lib/task-draft-db";
import { useEffect } from "react";

export function DraftTasksPurgeManager() {
  useEffect(() => {
    purgeExpiredDrafts().catch(console.error);

    const interval = setInterval(
      () => {
        purgeExpiredDrafts().catch(console.error);
      },
      30 * 60 * 1000, // every 30 minutes
    );

    return () => clearInterval(interval);
  }, []);

  return null;
}
