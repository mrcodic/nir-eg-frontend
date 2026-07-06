"use client";

import { StoreCartProvider } from "@/context/StoreProvider";
import QueryProvider from "@/layouts/QueryProvider";
import { IUser } from "@/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { memo, ReactNode } from "react";
import { AuthContextProvider } from "../context/auth-context";
import ModalProvider from "../context/ModalProvider";

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
          <StoreCartProvider>
            <ModalProvider>
              <AppTree>{children}</AppTree>
            </ModalProvider>
          </StoreCartProvider>
        </AuthContextProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
}

export default Providers;
