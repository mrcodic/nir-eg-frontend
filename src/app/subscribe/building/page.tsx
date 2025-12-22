import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import buildingAnimation from "../../../../public/assets/animations/waiting.json";

async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ timestamp: string }>;
}) {
  const timestamp = (await searchParams).timestamp;

  if (!timestamp) {
    redirect("/");
  }

  const date = new Date(Number(timestamp));
  // redirect to home page if timestamp is older than 1 hour
  if (date.getTime() < new Date().getTime() - 60 * 60 * 1000) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center mb-20 mt-10">
      <main className="wrapper">
        <div className="flex flex-col items-center justify-center ">
          <div className="sm:size-[428px] max-w-[428px] size-full aspect-square">
            <Lottie animationData={buildingAnimation} loop={true} />
          </div>

          <div className="flex flex-col gap-6 text-center  max-w-[800px] mt-8">
            <h1 className=" font-black text-xl sm:text-32 text-gradient-custom ">
              نحن الآن نعمل على إنشاء موقعك… فقط لحظات وسيكون كل شيء جاهزًا لك.
            </h1>

            <p className="text-base sm:text-2xl font-bold ">
              عند الانتهاء، سنرسل لك رسالة إلى بريدك الإلكتروني تحتوي على جميع
              التفاصيل وخطوات البدء.
            </p>
          </div>

          <Link href="/" className="inline-block mt-10">
            <Button
              variant="outline"
              className="border-gray-light text-gray-dark font-bold hover:bg-gray-dark hover:text-gray-light"
            >
              العودة إلى الرئيسية
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;
