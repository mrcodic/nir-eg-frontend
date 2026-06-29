"use client";

import QueryProvider from "@/layouts/QueryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { memo, ReactNode } from "react";
import { AuthContextProvider } from "../context/auth-context";
import ModalProvider from "../context/ModalProvider";
import { BooksStoreProvider } from "@/context/BooksStoreProvider";
import { IUser } from "@/types";

const AppTree = memo(function AppTree({ children }: { children: ReactNode }) {
  return <>{children}</>;
});

function Providers({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: IUser | null;
}) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <AuthContextProvider profile={profile}>
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
