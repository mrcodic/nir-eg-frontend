import Image from "next/image";
import StyledText from "../ui/StyledText";
import { Button } from "../ui/button";

function StartWithUsNow() {
  return (
    <section>
      <div className="justify-center items-center flex gap-2">
        <h2 className="flex items-center justify-center text-32 gap-1 flex-wrap">
          ابدأ الآن مع <StyledText text="نير" />{" "}
        </h2>
        <Image
          src="/assets/lightbulb.png"
          width={48}
          height={48}
          alt="light bulbs"
        />
      </div>

      <div className=" mt-8 rounded-lg bg-[url('/assets/bg/bg-vector.png'),radial-gradient(79.17%_79.17%_at_20.83%_69.6%,#20364e_0%,#0d2237_100%)] bg-no-repeat bg-bottom min-h-80 relative p-10 flex gap-6 lg:pe-72">
        <div className="text-white relative z-10  flex justify-center flex-col w-fit h-full gap-10 max-w-[524px]">
          <div className="space-y-2">
            <h4 className="text-32 font-bold">انضم لأكثر من 5000 طالب</h4>
            <p className="text-xl font-bold text-background">
              انضم لعدد كبير من الطلاب، شاهد فيديوهات الحصص و احصل على النقاط من
              خلال الامتحانات و الكويزات
            </p>
          </div>
          <Button variant="secondary" className="w-fit">
            اشترك معنا{" "}
            <Image
              src="/assets/launch-white.svg"
              alt="rocket icon"
              width={24}
              height={24}
            />
          </Button>
        </div>

        <div className="absolute left-0 inset-y-0 h-full w-[200px] lg:w-[400px]">
          <Image
            src="/assets/bg/student-photo.png"
            fill
            className="object-contain w-fit h-full object-bottom-left"
            alt="student photo"
          />
        </div>
      </div>
    </section>
  );
}

export default StartWithUsNow;
