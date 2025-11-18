import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

const Empty = ({
  text,
  className,
  isError,
  children,
}: {
  text?: string;
  className?: string;
  isError?: boolean;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 justify-center items-center h-full py-8",
        className
      )}
    >
      <Image
        src={isError ? "/assets/error.svg" : "/assets/box.svg"}
        alt=" "
        width={120}
        height={120}
      />
      <h2 className="text-[24px] text-[#454545]">
        {text || (isError ? "حدث خطأ ما" : "لا يوجد محتوى بعد")}
      </h2>

      {children}
    </div>
  );
};

export default Empty;
