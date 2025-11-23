import { telegramLiks } from "@/constants";
import Image from "next/image";

function SupportBadge({ gradeId }: { gradeId: number }) {
  return (
    <a
      href={telegramLiks[gradeId]}
      className="bg-gray-light text-white p-3 rounded-md w-[155px] h-10 flex items-center gap-3 justify-center outline-solid font-bold outline-1 outline-offset-2"
      target="_blank"
    >
      <Image src="/assets/Telegram.svg" width={20} height={20} alt="" />
      الدعم العلمي
    </a>
  );
}

export default SupportBadge;
