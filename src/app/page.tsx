import TemplateOne from "@/components/guest-templates/TemplateOne";
import TemplateThree from "@/components/guest-templates/TemplateThree";
import TemplateTwo from "@/components/guest-templates/TemplateTwo";
import { getCurrentTemplate } from "@/helpers/template.helpers";

const template = getCurrentTemplate();

const mapTemplate = {
  1: TemplateOne,
  2: TemplateTwo,
  3: TemplateThree,
};

const GuestPage = () => {
  const Template = mapTemplate[template];

  return <Template />;
};
export default GuestPage;
