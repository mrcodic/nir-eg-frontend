"use client";

import ModalProvider from "@/context/ModalProvider";
import { AuthContextProvider } from "@/context/auth-context";

export default function DesktopProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider profile={null} enableProfileQuery={false}>
      <ModalProvider>{children}</ModalProvider>
    </AuthContextProvider>
  );
}
