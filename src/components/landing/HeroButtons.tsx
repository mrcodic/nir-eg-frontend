import Image from "next/image";
import Link from "next/link";
import MotionWrapper from "../MotionWrapper";
import { Button } from "../ui/button";

function HeroButtons() {
  return (
    <MotionWrapper
      className="flex justify-center gap-4 mt-8 flex-wrap  relative z-2"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.4, once: true }}
      variants={{
        hidden: { opacity: 0, y: 5 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            delay: 0.2,
          },
        },
      }}
    >
      <Link href="/subscribe?type=demo">
        <Button>احصل على النسخة التجريبية</Button>
      </Link>

      <Link href="/about">
        <Button variant="secondary">
          <Image
            src="/assets/video.svg"
            alt="video"
            className="w-6 h-6"
            width={24}
            height={24}
          />
          شاهد الفيديو التعريفي{" "}
        </Button>
      </Link>
    </MotionWrapper>
  );
}

export default HeroButtons;
