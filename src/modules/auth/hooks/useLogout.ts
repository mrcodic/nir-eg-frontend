import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { deleteCookie } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

export default function useLogout() {
  const { setToken } = useAuthContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const modal = useModal();
  const pathname = usePathname();

  const logout = useCallback(
    async ({ closeModal = true }: { closeModal?: boolean } = {}) => {
      try {
        setIsLoggingOut(true);
        setToken(null);
        queryClient.removeQueries({ queryKey: ["/students/profile"] });
        localStorage.removeItem("timer");
        Cookies.remove("guest_token");
        Cookies.remove("nir_token");

        if (closeModal) modal?.closeModal();

        await deleteCookie("nir_token");

        if (!pathname.includes("login")) window.location.href = "/login";
      } finally {
        setIsLoggingOut(false);
      }
    },
    [modal, queryClient, setToken, pathname],
  );

  return { logout, isLoggingOut };
}
