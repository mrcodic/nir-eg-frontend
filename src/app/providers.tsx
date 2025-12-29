"use client";

import QueryProvider from "@/layouts/QueryProvider";
import { memo, ReactNode } from "react";
import { AuthContextProvider } from "../context/auth-context";
import ModalProvider from "../context/ModalProvider";

const AppTree = memo(function AppTree({ children }: { children: ReactNode }) {
  return <>{children}</>;
});

function Providers({ children }: { children: React.ReactNode }) {
  // useTemplateColor();

  return (
    <QueryProvider>
      <AuthContextProvider>
        {/* <BooksStoreProvider> */}
        <ModalProvider>
          <AppTree>{children}</AppTree>
        </ModalProvider>
        {/* </BooksStoreProvider> */}
      </AuthContextProvider>
    </QueryProvider>
  );
}

export default Providers;
