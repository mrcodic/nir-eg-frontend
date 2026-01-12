import { TenantLandingResponse } from "@/types/tenant.types";
import Image from "next/image";
import { Button } from "../ui/button";

const features = [
  { icon: "/assets/videos-fill.svg", text: "فيديوهات شرح لكل المنهج" },
  { icon: "/assets/exam-fill.svg", text: "امتحانات دورية و كويزات كل حصة" },
  {
    icon: "/assets/stars-fill.svg",
    text: "احصل على النقاط و ارفع ترتيبك بين زملائك",
  },
  {
    icon: "/assets/files-fill.svg",
    text: "تقارير دورية لأولياء الأمور خلال واتساب",
  },
];

function HeroSectionThree({
  content,
}: {
  content: TenantLandingResponse["data"]["main"];
}) {
  return (
    <section className="bg-primary-800 pt-[168px] pb-16">
      <div className="wrapper max-mobile:flex-col flex items-center justify-between gap-x-20 gap-y-20 xl:gap-x-30.5">
        <div>
          <h1 className="text-5xl font-black text-white">{content?.title}</h1>

          <p className="mt-6 text-xl font-bold text-white">
            {content?.description}
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-6">
            <Button
              variant="outline"
              className="hover:text-primary-800 h-auto max-w-full border-white px-12 py-4 text-2xl font-bold text-white hover:border-white hover:bg-white"
            >
              اشترك الان!
            </Button>
          </div>
        </div>

        <div className="mobile:max-w-[466px] bg-gray-light aspect-square w-full rounded-2xl">
          {content?.image && (
            <Image src={content?.image} fill alt="hero image" />
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSectionThree;
