import TemplateOne from "@/components/guest-templates/TemplateOne";
import TemplateSummary from "@/components/guest-templates/TemplateSummary";
import TemplateThree from "@/components/guest-templates/TemplateThree";
import TemplateTwo from "@/components/guest-templates/TemplateTwo";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import CustomError from "@/lib/customError";
import {
  getTenantContentServer,
  getTenantSettingsServer,
  getTenantSummaryServer,
} from "@/services/tenant.service";
import type { ApiResponse, IUser } from "@/types";
import {
  LandingSummaryResponse,
  Templates,
  TenantLandingResponse,
} from "@/types/tenant.types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";

export const metadata: Metadata = {
  title: "الرئيسية",
  description:
    "تصفح المنصة التعليمية واستكشف الباقات والدروس والخدمات المتاحة.",
};

type StandardLandingTemplateProps = {
  data: TenantLandingResponse["data"];
};

const standardTemplates: Record<
  Exclude<Templates, Templates.SUMMARY_LANDING>,
  ComponentType<StandardLandingTemplateProps>
> = {
  [Templates.LANDING_V1]: TemplateOne,
  [Templates.LANDING_V2]: TemplateTwo,
  [Templates.LANDING_V3]: TemplateThree,
};

async function LandingPage() {
  // 1) get tenant settings to know if they are using summary landing
  const tenantSettings = await getTenantSettingsServer();

  // 2) get landing data with the profile
  const [content, profile] = await Promise.all([
    tenantSettings.landing_template === Templates.SUMMARY_LANDING
      ? getTenantSummaryServer()
      : getTenantContentServer(),
    getServerData<ApiResponse<IUser | null>>({
      queryKey: ["/students/profile"],
    }),
  ]);

  if (profile?.body) {
    redirect("/profile");
  }

  if (!content) {
    throw new CustomError("Landing content not found", 404, "NOT_FOUND");
  }

  if (tenantSettings.landing_template === Templates.SUMMARY_LANDING) {
    return <TemplateSummary data={(content as LandingSummaryResponse).data} />;
  }

  const landingContent = content as TenantLandingResponse;

  if (landingContent.active_template === Templates.SUMMARY_LANDING) {
    throw new CustomError("Landing template not found", 404, "NOT_FOUND");
  }

  const Template = standardTemplates[landingContent.active_template];

  if (!Template) {
    throw new CustomError("Landing template not found", 404, "NOT_FOUND");
  }

  return <Template data={landingContent.data} />;
}

export default LandingPage;
