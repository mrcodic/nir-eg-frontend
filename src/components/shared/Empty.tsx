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
  isPageError?: boolean;
};

const Empty = ({
  text,
  icon,
  className,
  isError,
  children,
  iconClassName,
  isPageError,
}: EmptyProps) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-2 py-8",
        { "mt-20 min-h-[min(calc(100vh-80px),768px)]": isPageError },
        className,
      )}
    >
      <div className={cn("relative h-[150px] w-[200px]", iconClassName)}>
        <Image
          src={
            icon ||
            (isError
              ? "/assets/error.svg"
              : "/assets/bg/search-illustration.svg")
          }
          alt=" "
          fill
          className={cn("h-full w-full object-contain", iconClassName)}
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
