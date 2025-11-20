import { cn } from "@/lib/utils";
import StyledText from "./ui/StyledText";

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
    <div className={cn("mb-6 flex items-center gap-2", className)}>
      <img
        className={` ${width ? width : "md:w-10 w-6"} ${
          height ? height : "md:h-10 h-6"
        }`}
        src={icon}
      />

      <div className="flex flex-col gap-2 ">
        <StyledText
          text={title}
          className={cn("text-xl md:text-28", textClassName)}
        />
        {subText && (
          <h4
            className={cn(
              "text-sm text-gray-dark font-medium",
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
