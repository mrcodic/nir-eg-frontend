import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ReactNode } from "react";

const Empty = ({
  text,
  className,
  isError,
  children,
  iconClassName,
  textClassName,
}: {
  text?: string;
  className?: string;
  isError?: boolean;
  children?: ReactNode;
  iconClassName?: string;
  textClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 justify-center items-center h-full py-8",
        className,
      )}
    >
      <Image
        src={isError ? "/assets/error.svg" : "/assets/search-illustration.svg"}
        alt=" "
        width={200}
        height={100}
        className={cn(
          "sm:w-[400px] w-[200px] aspect-2 object-contain",
          iconClassName,
        )}
      />
      <h2
        className={cn(
          "text-lg md:text-2xl font-bold text-center ",
          isError && "text-red-500",
          textClassName,
        )}
      >
        {text || (isError ? "حدث خطأ ما" : "لا يوجد محتوى بعد")}
      </h2>

      {children}
    </div>
  );
};

export default Empty;
