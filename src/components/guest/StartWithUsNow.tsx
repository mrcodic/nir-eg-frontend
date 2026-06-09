import { TenantLandingResponse } from "@/types/tenant.types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import CustomImage from "../ui/CustomImage";

function StartWithUsNow({
  content,
}: {
  content: TenantLandingResponse["data"]["start"];
}) {
  return (
    <section>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-32 flex flex-wrap items-center justify-center gap-1">
          {/* ابدأ الآن مع <StyledText text="نير" />{" "} */}
          {content?.section_title}
        </h2>
        <Image
          src={content?.image1 || "/assets/lightbulb.png"}
          width={48}
          height={48}
          alt="light bulbs"
        />
      </div>

      {/* <div className=" mt-8 rounded-lg bg-[url('/assets/bg/bg-vector.png'),radial-gradient(79.17%_79.17%_at_20.83%_69.6%,#20364e_0%,#0d2237_100%)] bg-no-repeat bg-bottom min-h-80 relative p-10 flex gap-6 lg:pe-72"> */}
      <div className="bg-primary-radial relative mt-8 flex min-h-80 gap-6 rounded-lg bg-bottom bg-no-repeat p-10 max-[360px]:pb-20 lg:pe-72">
        <div
          className="bg-primary absolute bottom-0 left-0 h-1/2 w-4/5 bg-bottom bg-no-repeat"
          style={{
            maskImage:
              "url('/assets/bg/bg-vector.png'), linear-gradient(to right, black 0%, black 75%, transparent 90%)",
            WebkitMaskImage:
              "url('/assets/bg/bg-vector.png'), linear-gradient(to right, black 0%, black 75%, transparent 90%)",

            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",

            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",

            maskPosition: "top left",
            WebkitMaskPosition: "top left",

            maskSize: "cover",
            WebkitMaskSize: "cover",
          }}
        />
        <div className="relative z-10 flex h-full w-fit max-w-[524px] flex-col justify-center gap-10 text-white">
          <div className="space-y-2">
            <h4 className="text-32 font-bold">انضم لأكثر من 5000 طالب</h4>
            <p className="text-background text-xl font-bold">
              انضم لعدد كبير من الطلاب، شاهد فيديوهات الحصص و احصل على النقاط من
              خلال الامتحانات و الكويزات
            </p>
          </div>
          <Link href="/register">
            <Button variant="secondary" className="w-fit">
              اشترك معنا{" "}
              <Image
                src="/assets/launch-white.svg"
                alt="rocket icon"
                width={24}
                height={24}
              />
            </Button>
          </Link>
        </div>

        <div className="absolute inset-y-0 left-0 h-full w-[200px] lg:w-[400px]">
          <CustomImage
            src={content?.image2 || "/assets/bg/student-photo.png"}
            fallback="/assets/bg/student-photo.png"
            fill
            className="h-full w-fit object-contain object-bottom-left max-sm:opacity-70 max-sm:brightness-75"
            alt="student photo"
          />
        </div>
      </div>
    </section>
  );
}

export default StartWithUsNow;
