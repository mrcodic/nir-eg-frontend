"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTenant } from "@/context/TenantProvider";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
  className?: string;
  icon?: { src: string; alt: string };
};

function GuestDropdown() {
  const pathName = usePathname();
  const { features } = useTenant();

  const navLinks: NavLink[] = [
    {
      href: "/login",
      label: "تسجيل دخول",
    },
    {
      href: "/register",
      label: "إنشاء حساب",
    },
    {
      href: "/#grades",
      label: "الصفوف الدراسية",
      className: "md:hidden",

      icon: { src: "/assets/books-colored.svg", alt: "books-colored icon" },
    },
    ...(features?.book_store
      ? [
          {
            href: "/store",
            label: "المتجر",
            className: "md:hidden",

            icon: {
              src: "/assets/icons/BookColor.svg",
              alt: "book colored icon",
            },
          } satisfies NavLink,
        ]
      : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mobile:hidden flex size-10 items-center justify-center rounded-lg bg-white px-1 shadow-md">
        <MenuIcon size={24} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={18}
        className={cn(
          "mobile:hidden bg-primary-50 border-b-gray-light rounded-t-none border-b group-data-[template=landing-v3]/template:mt-2 group-data-[template=landing-v3]/template:bg-transparent group-data-[template=landing-v3]/template:px-4 sm:group-data-[template=landing-v3]/template:px-5",
          "group-data-[template=landing-v3]/template:border-transparent",
          // "border-b-gray-light border-b",
        )}
      >
        <div className="wrapper group-data-[template=landing-v3]/template:bg-background flex flex-col gap-2 py-4 group-data-[template=landing-v3]/template:rounded-lg">
          {navLinks.map(({ href, label, className, icon }) => (
            <DropdownMenuItem key={href} asChild>
              <Link
                href={href}
                className={cn(
                  "border-primary-800 text-primary-800 mx-auto flex w-full cursor-pointer items-center justify-center rounded-[10px] border bg-transparent p-2 text-center font-bold outline-offset-1 outline-red-500",
                  className,
                  {
                    "bg-primary-800 text-white": pathName.startsWith(href),
                  },
                )}
              >
                {icon && (
                  <Image
                    width={20}
                    height={20}
                    className="size-5"
                    src={icon.src}
                    alt={icon.alt}
                  />
                )}
                <h3>{label}</h3>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GuestDropdown;
