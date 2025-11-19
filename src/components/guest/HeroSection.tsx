import { Button } from "../ui/button";

function HeroSection() {
  return (
    <section className="flex items-center justify-between">
      <div>
        <h1>هذا النص هو مثال لنص يمكن أن يتم استبداله</h1>
        <p>
          هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا
          النص من مولد النص العربي.
        </p>

        <Button>اشترك معنا</Button>
      </div>

      <div className="w-[466px] h-[600px] bg-gray-light"></div>
    </section>
  );
}

export default HeroSection;
