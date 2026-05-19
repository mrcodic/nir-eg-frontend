import Image from "next/image";

function CourseInfoBadge({
  value,
  text,
  icon,
}: {
  value: string | number;
  text: string;
  icon: string;
}) {
  return (
    <div className="bg-primary-50 group/badge hover:bg-primary-100 flex w-full max-w-26 min-w-16 flex-col items-center rounded-lg p-2 transition-all">
      <div className="flex gap-2">
        <Image
          src={icon}
          className="size-6"
          width={24}
          height={24}
          alt="icon"
        />
        <span className="inline-block flex-1 text-base font-bold text-[#523412]">
          {text}
        </span>
      </div>

      <span className="text-primary-800 text-28 h-11 font-bold"> {value}</span>
    </div>
  );
}

export default CourseInfoBadge;
