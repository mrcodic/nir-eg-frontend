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
        src={isError ? "/error-ilustration.png" : "/assets/box.svg"}
        alt=" "
        width={200}
        height={100}
        className="sm:w-[400px] w-[200px] aspect-2 object-contain"
      />
      <h2
        className={cn(
          "text-2xl font-bold text-center ",
          isError && "text-red-500"
        )}
      >
        {text || (isError ? "حدث خطأ ما" : "لا يوجد محتوى بعد")}
      </h2>

      {children}
    </div>
  );
};

export default Empty;
