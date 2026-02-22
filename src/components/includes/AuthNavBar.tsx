"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useAuthContext } from "@/context/auth-context";
import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import NavNotifications from "@/modules/norifications/components/NavNotifications";
import CustomImage from "../ui/CustomImage";
import LinkStyled from "./LinkStyled";
import MobileDropDown from "./MobileDropDown";
import NavUserMenu from "./NavUserMenu";
import { useBooksSettings } from "@/hooks/useBooksSettings";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const NavCartButton = dynamic(
  () => import("@/modules/books-store/components/NavCartButton"),
);

const AuthNavBar = () => {
  const { profile, grade } = useAuthContext();
  const { templateNumber, logo, features } = useTenant();
  const { shouldShowBooks, shouldShowCart } = useBooksSettings();
  const pathname = usePathname();

  const hasGradesEnabled = features?.student_gradebook;
  const isOnlineStudent = profile?.type !== 3;
  // const isOfflineStudent = profile?.type === 3;

  const studentLinks = useMemo(() => {
    const links = [
      {
        title: "ملف الطالب",
        href: "/profile",
        show: true,
      },
      {
        title: "الباقات",
        href: `/bundles?grade=${grade?.id}`,
        show: isOnlineStudent,
      },
      {
        title: "الحصص",
        href: profile?.has_center ? `/bundles/${profile?.center_id}` : "",
        show: !isOnlineStudent,
      },
      {
        title: "الدرجات",
        href: "/grades",
        show: hasGradesEnabled,
      },
      {
        title: "متجر الكتب",
        href: "/books",
        show: features?.book_store && shouldShowBooks,
      },
    ];

    return links.filter(
      (link) => link.show && (link.href || link.title === "الحصص"),
    );
  }, [
    profile,
    grade,
    isOnlineStudent,
    hasGradesEnabled,
    features?.book_store,
    shouldShowBooks,
  ]);

  return (
    <div
      className={cn(
        "border-gray-light bg-background fixed top-0 left-0 z-30 flex h-20 w-full items-center border-b aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!",
        {
          "h-28 items-end border-none bg-transparent": templateNumber == 3,
        },
      )}
    >
      <div className="wrapper">
        <div
          className={cn("flex items-center justify-between gap-4", {
            "bg-background border-gray-light rounded-lg border p-4":
              templateNumber == 3,
          })}
        >
          <Link
            href={
              profile?.has_center
                ? `/bundles/${profile?.center_id}`
                : `/bundles?grade=${grade?.id}`
            }
            className="flex gap-2 self-end"
          >
            <CustomImage
              src={logo || "/logo.svg"}
              fallback="/logo.svg"
              width={110}
              height={48}
              unoptimized
              className="h-12 w-[110px] object-contain object-right"
              loading="eager"
              fetchPriority="high"
              alt="logo"
              priority
            />
          </Link>

          <ul className="mobile:flex mx-auto hidden list-none items-center gap-6 text-[16px] font-bold text-[#FFFFFF]">
            {studentLinks.map((link, i) => (
              <LinkStyled key={i} href={link.href} title={link.title} />
            ))}
          </ul>

          <div className="mobile:gap-6 flex items-center gap-4">
            {pathname.startsWith("/books") &&
              features?.book_store &&
              shouldShowCart && <NavCartButton />}

            <NavNotifications />

            <NavUserMenu profile={profile} />

            <MobileDropDown studentLinks={studentLinks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthNavBar;
