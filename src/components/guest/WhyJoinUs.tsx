import { TenantLandingResponse } from "@/types/tenant.types";
import SectionTitle from "./Ui/SectionTitle";

const features = [
  {
    title: "شرح مُبسط",
    description: "فيديوهات شرح لكل مواضيع المنهج",
  },
  {
    title: "امتحانات و كويزات",
    description: "امتحانات دورية و كويز كل حصة",
  },
  {
    title: "تقارير لولي الأمر",
    description: "تقارير دورية لولي الأمر خلال التطبيق أو واتساب",
  },
  {
    title: "المتجر و الهدايا",
    description: "اجمع النقاط و استبدلها بهدايا مميزة من المتجر",
  },
  {
    title: "النقاط و الترتيب",
    description: "احصل على النقاط و ارفع ترتيبك بين زملائك",
  },
  {
    title: "مجتمع طلاب",
    description: "انضم لطلابنا من خلال جروب واتساب أو تليجرام",
  },
];

function WhyJoinUs({
  content,
}: {
  content: TenantLandingResponse["data"]["why"];
}) {
  return (
    <section>
      <SectionTitle title={content?.section_title} />
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {content?.items?.map((feature, index) => (
          <div
            key={index}
            className="bg-secondary flex flex-col items-start justify-center rounded-lg px-6 py-8 text-white shadow-sm transition-all hover:scale-[1.02]"
          >
            <h3 className="mb-3 inline-block border-b-2 border-gray-400/50 pb-1 text-xl font-bold">
              {feature.title}
            </h3>
            <p className="text-base leading-relaxed font-medium opacity-95">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyJoinUs;
