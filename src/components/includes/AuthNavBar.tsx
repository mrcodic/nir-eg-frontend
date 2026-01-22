"use client";

import Link from "next/link";

import { useAuthContext } from "@/context/auth-context";

import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import NavNotifications from "@/modules/norifications/components/NavNotifications";
import CustomImage from "../ui/CustomImage";
import LinkStyled from "./LinkStyled";
import MobileDropDown from "./MobileDropDown";
import NavUserMenu from "./NavUserMenu";

const AuthNavBar = () => {
  const { profile, grade } = useAuthContext();
  const { templateNumber, logo } = useTenant();

  const STUDENTSONLINELINKS = [
    {
      title: "ملف الطالب",
      href: "/profile",
    },
    {
      title: "الباقات",
      href: `/bundles?grade=${grade?.id}`,
    },

    {
      title: "الدرجات",
      href: "/grades",
    },
    {
      title: "متجر النقاط",
      href: "/store",
    },
  ];

  const STUDENTSOFFLINELINKS = [
    {
      title: "ملف الطالب",
      href: "/profile",
    },
    {
      title: "الحصص",
      href: profile?.has_center ? `/bundles/${profile?.center_id}` : "",
    },

    {
      title: "الدرجات",
      href: "/grades",
    },

    {
      title: "متجر النقاط",
      href: "/store",
    },
  ];

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
              className="h-12 w-[110px] object-contain"
              loading="eager"
              fetchPriority="high"
              alt="logo"
              priority
            />
          </Link>

          <ul className="mobile:flex mx-auto hidden list-none items-center gap-6 text-[16px] font-bold text-[#FFFFFF]">
            {(profile?.type === 3
              ? STUDENTSOFFLINELINKS
              : STUDENTSONLINELINKS
            ).map((studentLink, i) => (
              <LinkStyled
                key={i}
                href={studentLink.href}
                title={studentLink.title}
              />
            ))}
          </ul>

          <div className="mobile:gap-6 flex gap-4">
            <NavNotifications />

            <NavUserMenu profile={profile} />

            <MobileDropDown
              profile={profile}
              STUDENTSONLINELINKS={STUDENTSONLINELINKS}
              STUDENTSOFFLINELINKS={STUDENTSOFFLINELINKS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthNavBar;
