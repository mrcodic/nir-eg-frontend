import { cn } from "@/lib/utils";

const RoomHeader = ({
  title,
  icon,
  subText,
  width,
  height,
  className,
  textClassName,
  subTextClassName,
}: {
  title: string;
  icon: string;
  subText?: string;
  width?: string;
  height?: string;
  className?: string;
  textClassName?: string;
  subTextClassName?: string;
}) => {
  return (
    <div className={cn("mb-6 flex items-center gap-3 md:gap-6", className)}>
      <img
        className={` ${width ? width : "md:w-[40px] w-6"} ${
          height ? height : "md:h-[40px] h-6"
        }`}
        src={icon}
      />
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="relative font-bold w-fit text-nowrap">
          {" "}
          <h3
            style={{
              WebkitTextFillColor: "white",
              WebkitTextStrokeWidth: 1,
              WebkitTextStrokeColor: "#d9b45c",
            }}
            className={cn(
              "textStroke text-xl md:text-[28px] absolute flex items-center -top-[2px] -left-px  z-0",
              textClassName
            )}
          >
            {" "}
            {title}
          </h3>
          <h3
            className={cn(
              "text-color-primary relative flex items-center z-10 text-xl md:text-[28px]",
              textClassName
            )}
          >
            {title}
          </h3>
        </div>
        {subText && (
          <h4
            className={cn(
              "text-sm text-[#454545] font-medium",
              subTextClassName
            )}
          >
            {subText}
          </h4>
        )}
      </div>
    </div>
  );
};
export default RoomHeader;
