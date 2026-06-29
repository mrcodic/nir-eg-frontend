import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل الباقة",
  description: "اطلع على تفاصيل الباقة التعليمية ومحتواها وخيارات الاشتراك الخاصة بها.",
};

const BundleDetailsPage = () => {
  return redirect("/bundles");
};

export default BundleDetailsPage;
