"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/context/ModalProvider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import LogoutCustomModal from "../modals/LogoutCustomModal";
import CustomImage from "../ui/CustomImage";
import { useTenant } from "@/context/TenantProvider";

function NavUserMenu({ profile }) {
  const router = useRouter();
  const modal = useModal();
  const { features } = useTenant();

  const hasCommunityEnabled = features?.community_system;

  return (
    <DropdownMenu dir="rtl" modal={false}>
      <DropdownMenuTrigger className="shrink-0 focus-visible:outline-hidden">
        <CustomImage
          src={profile?.avatar}
          className="border-primary-100 size-11 rounded-full border"
          alt="user avatar"
          size={44}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mobile:top-1 border-gray-light relative left-10 z-9999 max-h-[calc(100vh-90px)] w-[272px] overflow-y-auto rounded-lg border bg-[#FFFFFF] py-4">
        {" "}
        <DropdownMenuItem className="flex w-full flex-col items-center justify-center gap-4">
          <CustomImage
            src={profile?.avatar}
            size={56}
            className="size-14 rounded-full"
            alt="user avatar"
          />

          <h3 className="text-base font-bold text-[#121212]">
            {(profile?.first_name || "--") + " " + (profile?.last_name || "--")}
          </h3>

          <div className="bg-gray-light mb-4 h-px w-full" />
        </DropdownMenuItem>
        <DropdownMenuItem className="">
          <div className="mb-3 flex items-center gap-2">
            <Image
              className="size-5"
              src="/assets/phone.svg"
              width={20}
              height={20}
              alt="phone icon"
            />
            <h3 className="text-gray-dark text-[12px] font-bold">رقم الهاتف</h3>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div className="grid w-full grid-cols-2 gap-2">
            <div className="bg-background flex flex-col gap-2 rounded-lg p-2">
              <h3 className="text-gray-dark text-xs font-bold">رقم الطالب:</h3>
              <span className="text-sm font-bold tracking-wider">
                {profile?.phone}
              </span>
            </div>

            <div className="bg-background flex flex-col gap-2 rounded-lg p-2">
              <h3 className="text-gray-dark text-xs font-bold">
                رقم ولي الأمر:
              </h3>
              <span className="text-sm font-bold tracking-wider">
                {profile?.parent_phone}
              </span>
            </div>
          </div>
        </DropdownMenuItem>
        <div className="bg-gray-light my-4 mb-4 h-px w-full px-4" />
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
        {hasCommunityEnabled &&
          (profile?.type === 4 || profile?.type === 5) && (
            <MenuItem
              onClick={() => router.push("/profile/comments")}
              icon="/assets/query.svg"
              text="الأسئلة والاستفسارات"
            />
          )}
        <MenuItem
          onClick={() => {
            modal.setDialogContent(<LogoutCustomModal />);
            modal.openModal();
          }}
          icon="/assets/sign-out.svg"
          text="تسجيل خروج"
          textClassName="text-semantics-red"
          className="border-gray-light mt-2 rounded-none border-t pt-4"
        />
        {profile?.id && profile?.type === 3 && (
          <div className="ms-4 mt-2 flex flex-col items-start">
            <QRCodeCanvas
              value={String(profile?.id)}
              size={96}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
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
          "flex w-full cursor-pointer items-center gap-4 rounded-lg px-0 py-2 text-sm font-bold",
          className,
        )}
        onClick={() => {
          onClick();
        }}
      >
        <Image
          className="size-5"
          src={icon}
          width={20}
          height={20}
          alt="icon"
        />
        <span className={textClassName}>{text}</span>
      </div>
    </DropdownMenuItem>
  );
};
