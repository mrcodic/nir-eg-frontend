function CourseInfoBadge({
  value,
  text,
  icon,
}: {
  value: string;
  text: string;
  icon: string;
}) {
  return (
    <div className="bg-[#F8DEC5] flex items-center gap-4 p-[4px] rounded-[12px]  ">
      <div className="flex gap-2  flex-1 text-[20px] rounded-lg bg-white min-w-16 max-w-20">
        <img src={icon} />
        <span className="text-primary-700"> {value}</span>
      </div>
      <span className="text-[16px] hidden flex-1  font-medium text-[#523412] md:inline-block">
        {text}
      </span>
    </div>
  );
}

export default CourseInfoBadge;
