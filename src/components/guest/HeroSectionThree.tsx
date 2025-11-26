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

function HeroSectionThree() {
  return (
    <section className=" bg-primary-800 pt-[168px] pb-16 ">
      <div className="wrapper flex items-center justify-between xl:gap-x-30.5 gap-x-20 max-mobile:flex-col gap-y-20">
        <div>
          <h1 className="text-5xl font-black text-white">
            هذا النص هو مثال لنص يمكن أن يتم استبداله
          </h1>

          <p className="text-xl text-white font-bold mt-6">
            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا
            النص من مولد النص العربي.
          </p>

          <div className="mt-14 flex items-center gap-6 flex-wrap ">
            <Button
              variant="outline"
              className="border-white text-white hover:border-white hover:text-primary-800 hover:bg-white text-2xl font-bold max-w-full px-12 py-4 h-auto"
            >
              اشترك الان!
            </Button>
          </div>
        </div>

        <div className="mobile:max-w-[466px] rounded-2xl w-full  aspect-square bg-gray-light"></div>
      </div>
    </section>
  );
}

export default HeroSectionThree;
