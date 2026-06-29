import SubbedCourses from "@/modules/courses/components/SubbedCourses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الاشتراكات",
  description: "تابع اشتراكاتك الحالية والسابقة وحالة كل اشتراك.",
};

function page() {
  return (
    <div className="mt-[120px] mb-12 grow space-y-[50px] group-data-[template=landing-v3]/template:mt-[140px] md:space-y-[100px]">
      <SubbedCourses />
    </div>
  );
}

export default page;
