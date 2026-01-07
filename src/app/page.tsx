import TemplateOne from "@/components/guest-templates/TemplateOne";
import TemplateThree from "@/components/guest-templates/TemplateThree";
import TemplateTwo from "@/components/guest-templates/TemplateTwo";
import { getTenantSettingsServer } from "@/services/getTenantSettingsServer";

const mapTemplate = {
  "landing-v1": TemplateOne,
  "landing-v2": TemplateTwo,
  "landing-v3": TemplateThree,
};

const GuestPage = async () => {
  const tenantSettings = await getTenantSettingsServer();

  const Template = mapTemplate[tenantSettings?.landing_template] || TemplateOne;

  return <Template />;
};
export default GuestPage;
