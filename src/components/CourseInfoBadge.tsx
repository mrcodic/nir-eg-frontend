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
    <div className="bg-primary-50 flex items-center p-2 rounded-lg flex-col min-w-16 max-w-26 w-full">
      <div className="flex gap-2 ">
        <img src={icon} className="size-6" />
        <span className="text-base hidden flex-1  text-[#523412] md:inline-block font-bold">
          {text}
        </span>
      </div>

      <span className="text-primary-800 h-11 text-28 font-bold"> {value}</span>
    </div>
  );
}

export default CourseInfoBadge;
