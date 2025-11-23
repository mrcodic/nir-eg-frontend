"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
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

        <DropdownMenuContent
          className="relative left-10 z-9999 space-y-2 w-[272px]  mobile:top-1
                  bg-[#FFFFFF] max-h-[calc(100vh-90px)] overflow-y-auto border rounded-lg border-gray-light"
        >
          {" "}
          <DropdownMenuItem className="flex flex-col w-full gap-4 items-center justify-center">
            <img
              className="w-[56px] h-[56px] rounded-full"
              src={profile?.avatar || "/assets/avatar-user.svg"}
              onError={(e) => {
                e.currentTarget.src = "/assets/avatar-user.svg";
              }}
            />
            <h3 className="text-[#121212] text-[16px] font-bold">
              {profile?.first_name + " " + profile?.last_name}
            </h3>
            <div className="mb-[16px] h-px w-full bg-gray-light" />
          </DropdownMenuItem>
          <DropdownMenuItem className="px-8">
            <div className="flex items-center gap-2 mb-[12px]">
              <img className="w-[16px] h-[16px]" src="/assets/Phone.svg" />
              <h3 className="text-gray-dark text-[12px] font-bold ">
                رقم الهاتف
              </h3>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex gap-2">
              <div className="flex  flex-col gap-2">
                <h3 className="text-[12px] text-gray-dark font-bold">
                  رقم الطالب:
                </h3>
                <span className="text-gray-dark  text-[12px] inline-block">
                  {profile?.phone}
                </span>
              </div>
              <div className="w-[2px] h-[40px]  bg-gray-light" />
              <div className="flex flex-col gap-2">
                <h3 className="text-[12px] text-gray-dark font-bold">
                  رقم ولي الأمر:
                </h3>
                <span className="text-gray-dark  text-[12px] inline-block">
                  {profile?.parent_phone}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
          <div className="mb-[16px] my-[16px] h-px w-full bg-gray-light" />
          <DropdownMenuItem>
            <div
              className={cn(
                "text-[#121212] cursor-pointer hover:bg-[#EFEFEF]  w-full p-2 font-bold flex items-center gap-[16px] rounded-lg  text-sm",
                {
                  "bg-[#EFEFEF]": pathname === "/profile/accountSettings",
                }
              )}
              onClick={() => {
                router.push("/profile/accountSettings");
              }}
            >
              <img className="w-[20px] h-[20px]" src="/assets/Settings.svg" />
              <span>إعدادات الحساب</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div
              className={cn(
                "text-[#121212] cursor-pointer my-2d hover:bg-[#EFEFEF]  w-full p-2 font-bold flex items-center gap-[16px] rounded-lg  text-sm",
                {
                  "bg-[#EFEFEF]": pathname === "/orders",
                }
              )}
              onClick={() => {
                router.push("/orders");
              }}
            >
              <img className="w-[20px] h-[20px]" src="/assets/ordericon.svg" />
              <span> الطلبات</span>
            </div>
          </DropdownMenuItem>
          {(profile?.type === 4 || profile?.type === 5) && (
            <DropdownMenuItem>
              <div
                className={cn(
                  "text-[#121212] cursor-pointer my-2d hover:bg-[#EFEFEF]  w-full p-2 font-bold flex items-center gap-[16px] rounded-lg  text-sm",
                  {
                    "bg-[#EFEFEF]": pathname === "/profile/comments",
                  }
                )}
                onClick={() => {
                  router.push("/profile/comments");
                }}
              >
                <Image
                  alt="comments-4"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                  src="/assets/comments-4.svg"
                />
                <span>الأسئلة والاستفسارات</span>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <div
              className="text-[#121212] mt-[16px] cursor-pointer w-full p-2 font-bold flex items-center gap-[16px] rounded-lg  text-sm"
              onClick={() => {
                setShowLogoutModal(true);
              }}
            >
              <img className="w-[20px] h-[20px]" src="/assets/SignOut.svg" />
              <span className="text-[#B75050]">تسجيل خروج</span>
            </div>
          </DropdownMenuItem>
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
