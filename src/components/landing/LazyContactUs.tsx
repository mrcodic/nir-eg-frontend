"use client";

import dynamic from "next/dynamic";
import LazyOnView from "../LazyOnView";

const ContactUsSection = dynamic(
  () => import("@/components/landing/ContactUsSection"),
  { ssr: false }
);

export default function LazyContactUs() {
  return (
    <LazyOnView>
      <ContactUsSection />
    </LazyOnView>
  );
}
