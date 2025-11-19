import Badge from "./Badge";
export default function Count({ count, title, icon, bgColor }) {
  return (
    <div className="flex w-full md:w-[180px] border-primary-700 bg-[#FFFDFA] border rounded-[8px] p-2 items-center gap-5">
      {/* <Image width={20} height={20} src={""} alt="icon" /> */}
      <Badge bgColor={bgColor} icon={icon} />
      <div>
        <h2 className="text-[#523412] text-[22px] font-bold">{count} +</h2>
        <span className="text-[14px] font-bold">{title}</span>
      </div>
    </div>
  );
}
