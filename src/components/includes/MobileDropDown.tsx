"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import { useModal } from "@/context/ModalProvider";
import { useCallback } from "react";
import { StudentSelectCenterModal } from "../modals/StudentSelectCenterModal";
import { useAuthContext } from "@/context/auth-context";
import { useState } from "react";
import SwitchTenantButton from "./SwitchTenantButton";

function MobileDropDown({ studentLinks }) {
  const { profile } = useAuthContext();
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const modal = useModal();

  const handleCenterSelect = useCallback(
    (isCenterDetails: boolean) => {
      if (!isCenterDetails) return;
      if (isCenterDetails && profile?.has_center === false) {
        modal.setDialogContent(<StudentSelectCenterModal />);
        modal.openModal();
      }
    },
    [modal, profile?.has_center],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger className="mobile:hidden flex size-10 items-center justify-center rounded-lg bg-white px-1 shadow-md">
        <MenuIcon size={24} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={18}
        className={cn(
          "mobile:hidden bg-background border-transparent px-0 group-data-[template=landing-v3]/template:bg-transparent group-data-[template=landing-v3]/template:px-4 sm:group-data-[template=landing-v3]/template:px-5",
          "border-b-gray-light border-b",
          //    {
          //   "ms-4 w-[calc(100vw-32px)] sm:ms-[7.5vw] sm:w-[85vw] md:ms-[calc(10vw+16px)] md:w-[calc(80vw-32px)]":
          //     template == 3,
          // }
        )}
      >
        <div
          className={cn(
            `wrapper bg-background relative left-0 flex-col p-4 transition-all group-data-[template!=landing-v3]/template:w-screen group-data-[template=landing-v3]/template:mt-2 group-data-[template=landing-v3]/template:rounded-lg`,
            // {
            //   wrapper: template == 3,
            //   "w-screen": template != 3,
            // },
          )}
        >
          {studentLinks.map((studentLink, index, arr) => (
            <Link
              key={index}
              href={studentLink.href}
              onClick={() => {
                setOpen(false);
                handleCenterSelect(studentLink.title === "الحصص");
              }}
              className={`border-gray-light flex h-11 items-center justify-center rounded-[10px] border px-3 ${
                pathName.substring(0, 6) === studentLink.href.substring(0, 6)
                  ? "bg-primary text-white"
                  : "bg-transparent text-black"
              } ${index < arr.length - 1 ? "mb-4" : ""} `}
            >
              <DropdownMenuItem>{studentLink.title}</DropdownMenuItem>
            </Link>
          ))}

          <SwitchTenantButton
            logoutOnSwitch
            className="mt-4 h-11 w-full rounded-[10px]"
            label="اختيار منصة أخرى"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MobileDropDown;
