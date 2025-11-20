import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

type EmptyProps = {
  text?: string;
  className?: string;
  isError?: boolean;
  children?: ReactNode;
  icon?: string;
};

const Empty = ({ text, icon, className, isError, children }: EmptyProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 justify-center items-center h-full py-8",
        className
      )}
    >
      <Image
        src={icon || (isError ? "/assets/error.svg" : "/assets/box.svg")}
        alt=" "
        width={120}
        height={120}
      />
      <h2 className="text-[24px] text-gray-dark">
        {text || (isError ? "حدث خطأ ما" : "لا يوجد محتوى بعد")}
      </h2>

      {children}
    </div>
  );
};

export default Empty;
