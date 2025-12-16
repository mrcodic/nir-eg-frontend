"use client";

import QueryProvider from "@/context/QueryProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default Providers;
