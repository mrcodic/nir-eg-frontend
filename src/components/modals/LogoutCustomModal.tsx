"use client";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { Button } from "../ui/button";

function LogoutCustomModal() {
  const { logout } = useAuthContext();
  const modal = useModal();

  return (
    <div className="flex flex-col items-center gap-8 max-md:p-2">
      <img className="size-12" src="/assets/sign-out.svg" />

      <p className="font-bold  text-center">
        هل أنت متأكد من أنك تريد تسجيل الخروج؟
      </p>

      <div className="grid grid-cols-2 gap-6 w-full">
        <Button
          onClick={() => {
            logout();
            window.location.href = "/login";
            modal.closeModal();
          }}
          className="bg-semantics-red hover:bg-semantics-red/90 h-11 w-full"
        >
          تسجيل خروج
        </Button>

        <Button
          onClick={() => {
            modal.closeModal();
          }}
          className="bg-transparent hover:bg-transparent h-11 text-black border border-gray-light w-full"
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
}

export default LogoutCustomModal;
