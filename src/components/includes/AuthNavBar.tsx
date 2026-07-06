"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import NavNotifications from "@/modules/norifications/components/NavNotifications";
import UserTenantSwitch from "@/modules/tenant/components/UserTenantSwitch";
import { IUser } from "@/types";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import CustomImage from "../ui/CustomImage";
import LinkStyled from "./LinkStyled";
import MobileDropDown from "./MobileDropDown";
import NavUserMenu from "./NavUserMenu";

const NavCartButton = dynamic(
  () => import("@/modules/store/components/NavCartButton"),
);

const AuthNavBar = ({ profile }: { profile: IUser }) => {
  const { logo, features } = useTenant();

  const pathname = usePathname();

  const hasGradesEnabled = features?.student_gradebook;
  const isOnlineStudent = profile?.type !== 3;

  const studentLinks = useMemo(() => {
    const links = [
      {
        title: "ملف الطالب",
        href: "/profile",
        show: true,
      },
      {
        title: "الاشتراكات",
        href: `/subscriptions`,
        show: isOnlineStudent,
      },
      {
        title: "الباقات",
        href: `/bundles?grade=${profile?.grade}`,
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
      // {
      //   title: "متجر الكتب",
      //   href: "/store",
      //   show: features?.book_store && shouldShowBooks,
      // },
    ];

    return links.filter(
      (link) => link.show,
      // (link) => link.show && (link.href || link.title === "الحصص"),
    );
  }, [profile, isOnlineStudent, hasGradesEnabled]);

  return (
    <>
      <header
        className={cn(
          "border-gray-light bg-background fixed top-0 left-0 z-40 flex h-20 w-full items-center border-b aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!",
          "group-data-[template=landing-v3]/template:h-24 group-data-[template=landing-v3]/template:items-end group-data-[template=landing-v3]/template:border-none group-data-[template=landing-v3]/template:bg-transparent group-data-[template=landing-v3]/template:backdrop-blur-xs lg:group-data-[template=landing-v3]/template:h-28",
        )}
      >
        <div className="wrapper">
          <div
            className={cn(
              "group-data-[template=landing-v3]/template:bg-background group-data-[template=landing-v3]/template:border-gray-light flex items-center justify-between gap-4 group-data-[template=landing-v3]/template:rounded-lg group-data-[template=landing-v3]/template:border group-data-[template=landing-v3]/template:p-4",
            )}
          >
            <Link
              href={
                profile?.has_center
                  ? `/bundles/${profile?.center_id}`
                  : `/bundles?grade=${profile?.grade}`
              }
              className="flex gap-2 self-end"
            >
              <CustomImage
                src={logo || "/logo.svg"}
                fallback="/logo.svg"
                width={110}
                height={48}
                unoptimized
                className="h-12 w-fit object-contain object-right"
                loading="eager"
                fetchPriority="high"
                alt="logo"
                priority
              />
            </Link>

            <nav className="mobile:flex mx-auto hidden list-none items-center gap-6 text-base font-bold text-white">
              {studentLinks.map((link, i) => (
                <LinkStyled key={i} href={link.href} title={link.title} />
              ))}
            </nav>

            <div className="mobile:gap-6 flex items-center gap-2 sm:gap-4">
              <UserTenantSwitch />

              <NavNotifications />

              <NavUserMenu
                profile={profile}
                // shouldShowBooks={!!shouldShowBooks}
              />

              <MobileDropDown studentLinks={studentLinks} />
            </div>
          </div>
        </div>
      </header>

      {pathname.startsWith("/store") && !!features?.book_store && (
        <NavCartButton />
      )}
    </>
  );
};

export default AuthNavBar;
