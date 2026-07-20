"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTenant } from "@/context/TenantProvider";
import { mapSummaryNavigation } from "@/helpers/map-summary-landing-content";
import type { LandingPageHeader } from "@/types/tenant.types";
import { Menu, Rocket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import CustomImage from "../ui/CustomImage";

function SummaryNavbar({ header }: { header: LandingPageHeader }) {
  const { logo } = useTenant();
  const navigation = mapSummaryNavigation(header);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-24 items-end backdrop-blur-xs lg:h-28">
      <div className="wrapper">
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 shadow-[0_10px_28px_-22px_rgba(18,48,75,0.75)] backdrop-blur-xl sm:px-5 lg:py-6">
          <Link href="#summary-home" className="shrink-0">
            <CustomImage
              src={logo || "/logo.svg"}
              fallback="/logo.svg"
              width={112}
              height={48}
              alt="شعار المنصة"
              className="h-10 w-auto object-contain object-right"
              loading="eager"
              priority
            />
          </Link>

          <nav
            aria-label="التنقل في الصفحة"
            className="hidden items-center gap-6 lg:flex"
          >
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary-800 focus-visible:text-primary-800 text-sm font-bold text-[#12304b] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild size="sm" className="h-11 rounded-xl px-5">
              <Link href="#summary-booking">
                {header.button_text}
                <Rocket aria-hidden />
              </Link>
            </Button>
          </div>

          <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline-gray"
                size="icon"
                className="size-11 rounded-xl lg:hidden"
                aria-label="فتح قائمة التنقل"
              >
                <Menu aria-hidden />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={12}
              dir="rtl"
              className="w-[min(22rem,calc(100vw-2rem))] origin-top-right rounded-2xl border-slate-100 bg-white/95 p-2 shadow-[0_20px_44px_-20px_rgba(18,48,75,0.45)] backdrop-blur-xl motion-reduce:animate-none lg:hidden"
            >
              <nav aria-label="التنقل في الصفحة" className="grid gap-1">
                {navigation.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:bg-primary-50 hover:text-primary-800 rounded-xl px-4 py-3 text-sm font-bold text-[#12304b] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Button asChild className="mt-2 h-11 w-full rounded-xl">
                <Link
                  href="#summary-booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {header.button_text}
                  <Rocket aria-hidden />
                </Link>
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}

export default SummaryNavbar;
