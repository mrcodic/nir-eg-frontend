import TemplateOne from "@/components/guest-templates/TemplateOne";
import TemplateThree from "@/components/guest-templates/TemplateThree";
import TemplateTwo from "@/components/guest-templates/TemplateTwo";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import CustomError from "@/lib/customError";
import { getTenantContentServer } from "@/services/tenant.service";
import { ApiResponse, IUser } from "@/types";
import { redirect } from "next/navigation";

const mapTemplate = {
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

  console.log("content : ", content);

  const Template = mapTemplate[content?.active_template];

  if (!Template) {
    throw new CustomError("tenant template not found", 404);
  }

  return <Template data={content.data} />;
};

export default LandingPage;
