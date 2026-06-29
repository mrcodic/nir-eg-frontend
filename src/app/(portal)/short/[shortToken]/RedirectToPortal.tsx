"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RedirectToPortal({ token }: { token: string }) {
  const router = useRouter();

  useEffect(() => {
    router.push(`/parent-portal?token=${token}`);
  }, [router]);

  return null;
}

export default RedirectToPortal;
