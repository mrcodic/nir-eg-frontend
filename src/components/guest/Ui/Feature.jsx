import { motion } from "framer-motion";
import Image from "next/image";
const Feature = ({ feature }) => {
  return (
    <motion.div
      style={{
        "--border-color": feature.borderColor,
      }}
      whileHover="hover"
      initial="initial"
      animate="initial"
      className=" 
        border 
        relative 
        w-full 
        transition-all 
        hover:border-(--border-color)
        duration-300 
        hover:bg-white 
        cursor-pointer 
        border-[#F8DEC5] 
        p-4 
        bg-background 
        rounded-[8px]"
    >
      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1, filter: "blur(4px)" },
        }}
        className="absolute top-[10%]   w-[70px] h-[70px]   left-[10%]"
      >
        <Image src={feature.icon} width={70} height={70} alt="icon" />
      </motion.div>
      <div className="py-2 border-b  border-[#EFEFEF]">
        <Image src={feature.icon} width={40} height={40} alt="icon" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className=" text-[20px] md:text-[24px] font-bold text-[#523412]">
          {feature.title}
        </h2>
        <p className="md:text-[16px] text-[14px] font-bold text-[#454545]">
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
};
export default Feature;
