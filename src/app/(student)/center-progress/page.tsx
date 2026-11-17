import CenterProgress from "@/features/center-progress/components/CenterProgress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الحضور والتقييمات",
  description: "تابع حضور الحصص والواجبات ودرجات الكويز وملاحظات المدرس.",
};

export default function CenterProgressPage() {
  return <CenterProgress />;
}
