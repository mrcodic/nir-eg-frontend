"use client";

import { Button } from "@/components/ui/button";
import { useTenant } from "@/context/TenantProvider";
import { mapSummaryNavigation } from "@/helpers/map-summary-landing-content";
import type { LandingPageHeader } from "@/types/tenant.types";
import { Rocket } from "lucide-react";
import Link from "next/link";

import CustomImage from "../ui/CustomImage";
import SummaryMobileNavigation from "@/components/includes/SummaryMobileNavigation";

function SummaryNavbar({ header }: { header: LandingPageHeader }) {
  const { logo } = useTenant();
  const navigation = mapSummaryNavigation(header);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-24 items-end backdrop-blur-xs lg:h-28">
      <div className="wrapper">
        <div className="relative flex items-center justify-between rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 shadow-[0_10px_28px_-22px_rgba(18,48,75,0.75)] backdrop-blur-xl sm:px-5 lg:py-6">
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
                className="hover:text-primary-800 focus-visible:text-primary-800 text-primary-800 text-sm font-bold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="h-10 rounded-xl px-4 text-xs sm:h-11 sm:px-5 sm:text-sm"
            >
              <Link href="#summary-booking">
                {header.button_text}
                <Rocket aria-hidden />
              </Link>
            </Button>

            <SummaryMobileNavigation
              navigation={navigation}
              bookingLabel={header.button_text}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default SummaryNavbar;
