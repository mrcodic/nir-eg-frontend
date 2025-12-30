"use client";

import { IPartner, ITestimonial } from "@/types/landing.types";
import dynamic from "next/dynamic";
import LazyOnView from "../LazyOnView";

const PartnersSection = dynamic(
  () => import("@/components/landing/PartnersSection"),
  { ssr: false }
);

const ClientsCarousel = dynamic(
  () => import("@/components/landing/ClientsCarousel"),
  { ssr: false }
);

export default function LazyPartnersAndClients({
  partners,
  testimonials,
}: {
  partners: IPartner[];
  testimonials: ITestimonial[];
}) {
  return (
    <LazyOnView className="min-h-0">
      <>
        {partners.length > 0 && <PartnersSection partners={partners} />}
        {testimonials.length > 0 && (
          <ClientsCarousel testimonials={testimonials} />
        )}
      </>
    </LazyOnView>
  );
}
