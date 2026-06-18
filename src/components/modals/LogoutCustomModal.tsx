"use client";

import { useModal } from "@/context/ModalProvider";
import useLogout from "@/modules/auth/hooks/useLogout";
import { Button } from "../ui/button";

function LogoutCustomModal() {
  const { logout } = useLogout();
  const modal = useModal();

  return (
    <div className="flex flex-col items-center gap-8 max-md:p-2">
      <img className="size-12" src="/assets/sign-out.svg" />

      <p className="text-center font-bold">
        هل أنت متأكد من أنك تريد تسجيل الخروج؟
      </p>

      <div className="grid w-full grid-cols-2 gap-6">
        <Button
          onClick={() => {
            logout();
          }}
          className="bg-semantics-red hover:bg-semantics-red/90 h-11 w-full"
        >
          تسجيل خروج
        </Button>

        <Button
          onClick={() => {
            modal.closeModal();
          }}
          className="border-gray-light h-11 w-full border bg-transparent text-black hover:bg-transparent"
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
}

export default LogoutCustomModal;
