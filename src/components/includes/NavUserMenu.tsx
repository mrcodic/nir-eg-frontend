"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import LogoutCustomModal from "../modals/LogoutCustomModal";

function NavUserMenu({ profile }) {
  const router = useRouter();
  const pathname = usePathname();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      {showLogoutModal && (
        <LogoutCustomModal setShowLogoutModal={setShowLogoutModal} />
      )}

      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger className="focus-visible:outline-hidden">
          <div>
            <img
              className="mobile:size-12 size-[42px] rounded-full object-cover"
              src={profile?.avatar || "/assets/avatar-user.svg"}
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar-user.svg";
              }}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="relative left-10 z-9999 w-[272px]  mobile:top-1 bg-[#FFFFFF] max-h-[calc(100vh-90px)] overflow-y-auto border rounded-lg border-gray-light">
          {" "}
          <DropdownMenuItem className="flex flex-col w-full gap-4 items-center justify-center">
            <img
              className="size-14  rounded-full"
              src={profile?.avatar || "/assets/avatar-user.svg"}
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar-user.svg";
              }}
            />
            <h3 className="text-[#121212] text-base font-bold">
              {profile?.first_name + " " + profile?.last_name}
            </h3>
            <div className="mb-4 h-px w-full bg-gray-light" />
          </DropdownMenuItem>
          <DropdownMenuItem className="">
            <div className="flex items-center gap-2 mb-3">
              <img className="size-5" src="/assets/phone.svg" />
              <h3 className="text-gray-dark text-[12px] font-bold ">
                رقم الهاتف
              </h3>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="flex  flex-col gap-2 bg-background p-2">
                <h3 className="text-xs text-gray-dark font-bold">
                  رقم الطالب:
                </h3>
                <span className="  text-sm font-bold  tracking-wider">
                  {profile?.phone}
                </span>
              </div>

              <div className="flex flex-col gap-2 bg-background p-2">
                <h3 className="text-xs text-gray-dark font-bold">
                  رقم ولي الأمر:
                </h3>
                <span className="  text-sm font-bold  tracking-wider">
                  {profile?.parent_phone}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
          <div className="mb-4 my-4 h-px w-full bg-gray-light px-4" />
          <MenuItem
            onClick={() => router.push("/profile/accountSettings")}
            icon="/assets/settings.svg"
            text="إعدادات الحساب"
          />
          <MenuItem
            onClick={() => router.push("/orders")}
            icon="/assets/bundles.svg"
            text="الطلبات"
          />
          {(profile?.type === 4 || profile?.type === 5) && (
            <MenuItem
              onClick={() => router.push("/profile/comments")}
              icon="/assets/comments-4.svg"
              text="الأسئلة والاستفسارات"
            />
          )}
          <MenuItem
            onClick={() => setShowLogoutModal(true)}
            icon="/assets/sign-out.svg"
            text="تسجيل خروج"
            textClassName="text-semantics-red"
            className="mt-2 pt-4 border-t border-gray-light rounded-none"
          />
          {profile?.id && profile?.type === 3 && (
            <div className="flex flex-col items-center gap-4 p-5">
              <QRCodeCanvas
                value={String(profile?.id)}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default NavUserMenu;

const MenuItem = ({
  onClick,
  icon,
  text,
  textClassName,
  className,
}: {
  onClick: () => void;
  icon: string;
  text: string;
  textClassName?: string;
  className?: string;
}) => {
  return (
    <DropdownMenuItem>
      <div
        className={cn(
          "cursor-pointer w-full py-2 font-bold flex items-center gap-4 px-0 rounded-lg  text-sm",
          className
        )}
        onClick={() => {
          onClick();
        }}
      >
        <img className="size-5" src={icon} />
        <span className={textClassName}>{text}</span>
      </div>
    </DropdownMenuItem>
  );
};
