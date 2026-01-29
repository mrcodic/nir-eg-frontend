import FAQAccordion from "@/components/FAQAccordion";
import { getPublicData } from "@/config/client-fetch";
import Lottie from "@/lib/LottiesClient";
import { FaqSection } from "@/types/landing.types";
import optimizedLottie from "../../../public/assets/animations/faq.json";

export const metadata = {
  title: "سؤال وجواب",
  description: "سؤال وجواب لمنصة نَيِّر.",
};

async function FaqPage() {
  const faqData = await getPublicData<{ data: FaqSection }>({
    queryKey: ["/settings/home/faq"],
  });

  return (
    <main className="flex w-full flex-col gap-22  wrapper bg-background relative  pt-10 sm:pt-14 pb-16 space-y-6 bg-[url('/assets/backgrounds/bg-vector.png')] ">
      <section className="section">
        <div className="flex items-center justify-between gap-6 sm:gap-12 ">
          <div>
            <h1 className="text-gradient-custom text-xl font-extrabold sm:text-[48px]">
              لديك أي سؤال؟
            </h1>

            <p className="mt-8 text-sm font-bold text-black dark:text-white/70 sm:text-[20px]">
              سعداء بالإجابة على جميع أسئلتك واستفساراتك.
            </p>
          </div>

          <div className="sm:size-52 size-42">
            <Lottie
              animationData={optimizedLottie}
              loop={true}
              autoPlay={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        <div className="sm:mt-20 mt-14">
          <FAQAccordion faqs={faqData?.data?.items || []} />
        </div>
      </section>
    </main>
  );
}

export default FaqPage;
