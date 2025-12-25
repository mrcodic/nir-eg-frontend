import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

type EmptyProps = {
  text?: string;
  className?: string;
  isError?: boolean;
  children?: ReactNode;
  icon?: string;
  iconClassName?: string;
};

const Empty = ({
  text,
  icon,
  className,
  isError,
  children,
  iconClassName,
}: EmptyProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 justify-center items-center h-full py-8",
        className
      )}
    >
      <div className={cn("w-[200px] h-[150px] relative", iconClassName)}>
        <Image
          src={
            icon ||
            (isError
              ? "/assets/error.svg"
              : "/assets/bg/search-illustration.svg")
          }
          alt=" "
          fill
          className={cn("w-full h-full object-contain", iconClassName)}
        />
      </div>
      <h2 className="text-lg font-bold">
        {text || (isError ? "حدث خطأ ما" : "لا يوجد معلومات لعرضها")}
      </h2>

      {children}
    </div>
  );
};

export default Empty;
