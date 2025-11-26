"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthContext } from "@/context/auth-context";

import NavNotifications from "@/modules/norifications/components/NavNotifications";
import { BookLinksSettings } from "@/types/books.types";
import LinkStyled from "./LinkStyled";
import MobileDropDown from "./MobileDropDown";
import NavUserMenu from "./NavUserMenu";
import WrapperHOC from "./WrapperHOC";

const AuthNavBar = () => {
  const pathName = usePathname();
  const { profile, grade } = useAuthContext();

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
    // {
    //   title: "متجر النقاط",
    //   href: "/store",
    // },
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

    // {
    //   title: "متجر النقاط",
    //   href: "/store",
    // },
  ];

  return (
    <div className=" h-20 border-b fixed top-0 left-0 w-full z-30 border-gray-light flex items-center  bg-background aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!">
      <div className="wrapper">
        <div className="flex  items-center justify-between gap-4">
          <Link
            href={
              profile?.has_center
                ? `/bundles/${profile?.center_id}`
                : `/bundles?grade=${grade}`
            }
            className="flex self-end gap-2"
          >
            <img src="/logo.svg" />
          </Link>

          <ul className=" hidden mobile:flex mx-auto list-none text-[#FFFFFF] text-[16px] font-bold items-center gap-8 lg:gap-12">
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

            <WrapperHOC queryKey={["settings/books"]}>
              {({ data }: { data: { data: BookLinksSettings } }) => {
                const booksData = data?.data;
                if (!booksData?.links?.length) return null;

                return (
                  <Link
                    href="/books"
                    className={`border px-3 border-gray-light h-[44px] flex items-center justify-center rounded-[10px] ${
                      pathName === "/books"
                        ? "bg-primary text-white"
                        : "bg-transparent text-[#523412]"
                    }   `}
                  >
                    متجر الكتب
                  </Link>
                );
              }}
            </WrapperHOC>
          </ul>

          <div className="flex gap-4 mobile:gap-6">
            {/* <WrapperHOC queryKey={["settings/books"]}>
              {({ data }: { data: { data: BookLinksSettings } }) => {
                if (data?.data?.hide_books) return;
                return <NavCartButton />;
              }}
            </WrapperHOC> */}

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
