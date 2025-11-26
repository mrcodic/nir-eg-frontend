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
      <Image
        src={
          icon ||
          (isError ? "/assets/error.svg" : "/assets/bg/search-illustration.svg")
        }
        alt=" "
        width={200}
        height={200}
        className={iconClassName}
      />
      <h2 className="text-lg font-bold">
        {text || (isError ? "حدث خطأ ما" : "لا يوجد معلومات لعرضها")}
      </h2>

      {children}
    </div>
  );
};

export default Empty;
