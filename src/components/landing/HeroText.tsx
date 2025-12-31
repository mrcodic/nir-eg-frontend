import AnimatedText from "../AnimatedText";
import MotionWrapper from "../MotionWrapper";

function HeroText() {
  return (
    <div className="flex flex-col items-center mt-12 relative z-2">
      <MotionWrapper
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0, once: true }}
        variants={{
          hidden: { opacity: 0, y: 5 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.2,
            },
          },
        }}
        className="text-primary-800 font-bold text-xl"
      >
        أهلاً بك في نَيِّر!
      </MotionWrapper>

      <AnimatedText
        as="h1"
        text="منصة واحدة لإدارة الحصص و متابعة أداء الطلاب"
        className="text-[40px] font-bold mt-6"
        stagger={0.05}
      />

      <AnimatedText
        text="احصل على منصة باسمك و اللوجو الخاص بك و ابدأ في متابعة أداء الطلاب و
            تنظيم المواعيد."
        className="font-bold text-xl text-gray-dark mt-2"
        stagger={0.05}
        delay={0.06}
      />
    </div>
  );
}

export default HeroText;
