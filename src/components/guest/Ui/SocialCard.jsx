import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function SocialCard({ card }) {
  return (
    <div className="bg-background border-[1.5px] border-[#F8DEC5] p-3 w-full max-md:max-w-[335px] md:max-w-[368px] h-[96px] md:h-[188px] rounded-[12px]">
      <div className="flex flex-row justify-between md:flex-col">
        <div className="flex items-center border-b pb-4 border-[#EFEFEF] gap-2">
          <motion.div
            animate={{ rotate: 360 * 3 }}
            transition={{
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <Image src={card.icon} width={80} height={80} alt={card.title} />
          </motion.div>
          <div className="text-center font-bold text-[#121212]">
            <h2 className="text-[28px] md:text-[40px]">{card.count}</h2>
            <p className="md:text-[20px] text-[18px]">{card.title}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-[22px] gap-2">
          <h2 className="text-[20px] hidden md:block font-bold">
            تابعنا من هنا
          </h2>
          <Link
            style={{ backgroundColor: card.followIconColor }}
            href={card.link}
            className={`w-[40px] rounded-[40px] flex items-center justify-center border border-primary-700 h-[40px]`}
          >
            <Image
              alt="arrow"
              src="/assets/arrow-left12.svg"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
