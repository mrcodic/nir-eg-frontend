"use client";

import QueryProvider from "@/layouts/QueryProvider";
import { AuthContextProvider } from "../context/auth-context";
import ModalProvider from "../context/ModalProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthContextProvider>
        {/* <BooksStoreProvider> */}
        <ModalProvider>{children}</ModalProvider>
        {/* </BooksStoreProvider> */}
      </AuthContextProvider>
    </QueryProvider>
  );
}

export default Providers;
