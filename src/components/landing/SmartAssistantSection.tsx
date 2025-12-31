import Image from "next/image";
import MotionWrapper from "../MotionWrapper";

const aiFeatures = [
  {
    text: "هو مساعد ذكي يدعم الطلاب على مدار الساعة، قادر على فهم اللغة العربية و اللغة الإنجليزية.",
  },
  {
    text: "يجاوب على أسئلة الطلاب و يقدم شرح للمواد التعليمية، يقوم بتكييف الشرح وفق مستوى الطالب و سرعة استيعابه.",
  },
  {
    text: "يتولى الرد على الأسئلة المتكررة مما يتيح للمدرسين التركيز على شرح المادة العلمية",
  },
];

function SmartAssistantSection() {
  return (
    <section className="wrapper md:pt-18">
      <MotionWrapper
        className="section p-6 relative bg-dark-radial rounded-lg  flex gap-6 shadow-xl max-md:flex-col max-sm:overflow-hidden "
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        transition={{ duration: 0.5 }}
      >
        <MotionWrapper
          className="md:absolute max-md:mx-auto relative md:-top-18 left-0 w-[251px] h-[250px] sm:w-[311px] sm:h-[310px] z-2 shrink-0"
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
              opacity: [0, 1, 1],
              scale: [0.8, 1.2, 1],
              transition: {
                duration: 0.4,
                delay: 0.5,
                ease: "easeOut",
                times: [0, 0.7, 1],
              },
            },
          }}
          transition={{
            duration: 0.3,
            delay: 0.5,
            y: {
              duration: 2,
              repeat: Infinity,
              delay: 0.5,
              ease: "easeInOut",
            },
            rotate: {
              duration: 0.3,
              delay: 0,
            },
          }}
          animate={{
            y: [0, -10, 0],
          }}
        >
          <Image
            src="/assets/ai.png"
            alt="ai"
            fill
            className="object-contain"
          />
        </MotionWrapper>

        <div className="flex flex-col gap-10 md:max-w-2/3 relative z-2">
          <h2 className="text-white text-xl sm:text-32 font-bold ">
            ما هو مساعد الطفل الذكي - Samrt AI Teacher؟
          </h2>

          <div className="flex flex-col gap-4">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Image
                  src="/assets/sparkles.svg"
                  alt="sparkles"
                  width={24}
                  height={24}
                />
                <p className="text-white text-base sm:text-lg font-bold">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-0 bottom-0 z-1">
          <Image
            src="/assets/blur-vector-blue-ai.svg"
            alt="blur vector blue ai"
            width={307}
            height={291}
          />
        </div>
      </MotionWrapper>
    </section>
  );
}

export default SmartAssistantSection;
