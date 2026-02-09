"use client";

import QueryProvider from "@/layouts/QueryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { memo, ReactNode } from "react";
import { AuthContextProvider } from "../context/auth-context";
import ModalProvider from "../context/ModalProvider";
import { BooksStoreProvider } from "@/context/BooksStoreProvider";

const AppTree = memo(function AppTree({ children }: { children: ReactNode }) {
  return <>{children}</>;
});

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <AuthContextProvider>
          <BooksStoreProvider>
            <ModalProvider>
              <AppTree>{children}</AppTree>
            </ModalProvider>
          </BooksStoreProvider>
        </AuthContextProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
}

export default Providers;
