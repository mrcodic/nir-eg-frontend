import { Button } from "../ui/button";

function HeroSection() {
  return (
    <section className="flex items-center justify-between max-lg:flex-col gap-6 gap-x-12">
      <div>
        <h1 className="text-32  font-bold">
          هذا النص هو مثال لنص يمكن أن يتم استبداله
        </h1>
        <p className="text-lg font-bold mt-6">
          هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا
          النص من مولد النص العربي.
        </p>

        <Button className="mt-14">اشترك معنا</Button>
      </div>

      <div className="max-w-[466px] w-full lg:max-w-1/2 h-[600px] bg-gray-light"></div>
    </section>
  );
}

export default HeroSection;
