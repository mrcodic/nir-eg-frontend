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
    <LazyOnView>
      <>
        <PartnersSection partners={partners} />
        <ClientsCarousel testimonials={testimonials} />
      </>
    </LazyOnView>
  );
}
