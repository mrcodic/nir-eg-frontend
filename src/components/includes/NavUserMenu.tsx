"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/context/ModalProvider";
import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import { IUser } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import LogoutCustomModal from "../modals/LogoutCustomModal";
import UserTenantCode from "../shared/UserTenantCode";
import CustomImage from "../ui/CustomImage";
import { ScrollArea } from "../ui/scroll-area";

function NavUserMenu({
  profile,
  shouldShowBooks,
}: {
  profile: IUser;
  shouldShowBooks: boolean;
}) {
  const modal = useModal();
  const { features } = useTenant();

  const hasCommunityEnabled = features?.community_system;

  return (
    <DropdownMenu dir="rtl" modal={false}>
      <DropdownMenuTrigger className="shrink-0 focus-visible:outline-hidden">
        <CustomImage
          src={profile?.avatar}
          className="border-primary-100 hover:border-primary-800 size-11 rounded-full border"
          alt="user avatar"
          size={44}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mobile:top-1 border-gray-light relative left-10 z-100 flex w-[272px] flex-col rounded-lg border bg-white pt-4 pb-2">
        <ScrollArea
          dir="rtl"
          className={cn(
            "w-full",
            "**:data-radix-scroll-area-viewport:max-h-[min(630px,calc(100dvh-100px))] group-data-[template=landing-v3]/template:**:data-radix-scroll-area-viewport:max-h-[min(630px,calc(100dvh-130px))]",
          )}
        >
          <DropdownMenuItem className="flex w-full flex-col items-center justify-center gap-4">
            <CustomImage
              src={profile?.avatar}
              size={56}
              className="size-14 rounded-full"
              alt="user avatar"
            />

            <h3 className="text-base font-bold text-black">
              {(profile?.first_name || "--") +
                " " +
                (profile?.last_name || "--")}
            </h3>
          </DropdownMenuItem>

          <div className="flex justify-center">
            <UserTenantCode
              tenantCode={profile?.tenant_code}
              className="mt-4"
            />
          </div>

          <div className="bg-gray-light mt-3 mb-4 h-px w-full" />

          <DropdownMenuItem>
            <div className="mb-3 flex items-center gap-2">
              <Image
                className="size-5"
                src="/assets/phone.svg"
                width={20}
                height={20}
                alt="phone icon"
              />
              <h3 className="text-gray-dark text-[12px] font-bold">
                رقم الهاتف
              </h3>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <div className="grid w-full grid-cols-2 gap-2">
              <div className="bg-background flex flex-col gap-2 rounded-lg p-2">
                <h3 className="text-gray-dark text-xs font-bold">
                  رقم الطالب:
                </h3>
                <span className="text-sm font-bold tracking-wider">
                  {profile?.phone || "--"}
                </span>
              </div>
              <div className="bg-background flex flex-col gap-2 rounded-lg p-2">
                <h3 className="text-gray-dark text-xs font-bold">
                  رقم ولي الأمر:
                </h3>
                <span className="text-sm font-bold tracking-wider">
                  {profile?.parent_phone || "--"}
                </span>
              </div>
            </div>
          </DropdownMenuItem>

          <div className="bg-gray-light my-4 mb-4 h-px w-full px-4" />

          <MenuItem
            href="/profile/account-settings"
            icon="/assets/settings.svg"
            text="إعدادات الحساب"
          />

          <MenuItem href="/orders" icon="/assets/bundles.svg" text="الطلبات" />

          {hasCommunityEnabled &&
            (profile?.type === 4 || profile?.type === 5) && (
              <MenuItem
                href="/profile/comments"
                icon="/assets/query.svg"
                text="الأسئلة والاستفسارات"
              />
            )}

          {features?.book_store && shouldShowBooks && (
            <MenuItem
              href="/books"
              icon="/assets/store-outline.svg"
              text="متجر الكتب"
            />
          )}

          <hr className="my-2 bg-gray-300" />

          <MenuItem
            onClick={() => {
              modal.setDialogContent(<LogoutCustomModal />);
              modal.openModal();
            }}
            icon="/assets/sign-out.svg"
            text="تسجيل خروج"
            textClassName="text-semantics-red"
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
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavUserMenu;

const MenuItem = ({
  onClick,
  href,
  icon,
  text,
  textClassName,
  className,
}: {
  onClick?: () => void;
  href?: string;
  icon: string;
  text: string;
  textClassName?: string;
  className?: string;
}) => {
  const content = (
    <>
      <Image className="size-5" src={icon} width={20} height={20} alt="icon" />
      <span className={textClassName}>{text}</span>
    </>
  );

  const baseClassName = cn(
    "flex w-full hover:bg-primary-50 transition-all cursor-pointer items-center gap-4 rounded-xl px-0 py-2 text-sm font-bold",
    className,
  );

  return (
    <DropdownMenuItem asChild>
      {href ? (
        <Link href={href} className={baseClassName}>
          {content}
        </Link>
      ) : (
        <button type="button" className={baseClassName} onClick={onClick}>
          {content}
        </button>
      )}
    </DropdownMenuItem>
  );
};
