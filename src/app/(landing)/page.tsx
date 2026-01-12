import TemplateOne from "@/components/guest-templates/TemplateOne";
import TemplateThree from "@/components/guest-templates/TemplateThree";
import TemplateTwo from "@/components/guest-templates/TemplateTwo";
import { getTenantContentServer } from "@/services/tenantServices";

const mapTemplate = {
  "landing-v1": TemplateOne,
  "landing-v2": TemplateTwo,
  "landing-v3": TemplateThree,
};

const GuestPage = async () => {
  const content = await getTenantContentServer();

  console.log("content : ", content);

  const Template = mapTemplate[content?.active_template] || TemplateOne;

  return <Template data={content.data} />;
};
export default GuestPage;
