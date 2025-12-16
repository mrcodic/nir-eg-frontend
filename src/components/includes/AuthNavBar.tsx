"use client";

import Link from "next/link";

import { useAuthContext } from "@/context/auth-context";

import { getCurrentTemplate } from "@/helpers/template.helpers";
import { cn } from "@/lib/utils";
import NavNotifications from "@/modules/norifications/components/NavNotifications";
import LinkStyled from "./LinkStyled";
import MobileDropDown from "./MobileDropDown";
import NavUserMenu from "./NavUserMenu";

const AuthNavBar = () => {
  const { profile, grade } = useAuthContext();
  const template = getCurrentTemplate();

  const STUDENTSONLINELINKS = [
    {
      title: "ملف الطالب",
      href: "/profile",
    },
    {
      title: "الباقات",
      href: `/bundles?grade=${grade}`,
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
        " h-20 border-b fixed top-0 left-0 w-full z-30 border-gray-light flex items-center  bg-background aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!",
        {
          "bg-transparent  h-28 items-end border-none": template == 3,
        }
      )}
    >
      <div className="wrapper ">
        <div
          className={cn("flex  items-center justify-between gap-4", {
            "bg-background p-4 rounded-lg border border-gray-light":
              template == 3,
          })}
        >
          <Link
            href={
              profile?.has_center
                ? `/bundles/${profile?.center_id}`
                : `/bundles?grade=${grade}`
            }
            className="flex self-end gap-2"
          >
            <img src="/logo.svg" alt="logo" />
          </Link>

          <ul className=" hidden mobile:flex mx-auto list-none text-[#FFFFFF] text-[16px] font-bold items-center gap-6">
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

          <div className="flex gap-4 mobile:gap-6">
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
