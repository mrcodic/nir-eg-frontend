import TemplateOne from "@/components/guest-templates/TemplateOne";
import TemplateThree from "@/components/guest-templates/TemplateThree";
import TemplateTwo from "@/components/guest-templates/TemplateTwo";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import CustomError from "@/lib/customError";
import { getTenantContentServer } from "@/services/tenant.service";
import { ApiResponse, IUser } from "@/types";
import { Templates } from "@/types/tenant.types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "الرئيسية",
  description:
    "تصفح المنصة التعليمية واستكشف الباقات والدروس والخدمات المتاحة.",
};

const mapTemplate: Record<Templates, React.FunctionComponent<any>> = {
  "landing-v1": TemplateOne,
  "landing-v2": TemplateTwo,
  "landing-v3": TemplateThree,
};

const LandingPage = async () => {
  const [content, profile] = await Promise.all([
    getTenantContentServer(),
    getServerData<ApiResponse<IUser | null>>({
      queryKey: [`/students/profile`],
    }),
  ]);

  if (profile?.body) redirect("/bundles");

  if (!content) {
    throw new CustomError("Landing content not found", 404, "NOT_FOUND");
  }

  const Template = mapTemplate[content.active_template];

  if (!Template) {
    throw new CustomError("Landing template not found", 404, "NOT_FOUND");
  }

  return <Template data={content.data} />;
};

export default LandingPage;
