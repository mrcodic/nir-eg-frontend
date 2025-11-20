function RoomProgressBadge({ progress = 0 }: { progress: number }) {
  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157, 130, 66, 0.20)",
      }}
      className="flex flex-wrap items-center justify-center font-bold text-[#523412]  border border-primary-700 text-[10px]   gap-1 py-2 pr-px pl-2 rounded-lg bg-background"
    >
      <img className="w-[16px] h-[16px]" src="/assets/Star.svg" />
      <span> لقد أنهيت </span>

      <div className="relative ">
        {" "}
        <h3 className="textStroke text-[10px] absolute flex items-center -top-[2px]  z-0">
          {" "}
          <span>%</span>
          <span>{progress}</span>
        </h3>
        <h3 className="text-primary flex items-center relative  z-10 text-[10px]">
          <span>%</span>
          <span>{progress}</span>
        </h3>
      </div>

      <p className="">من الحصة </p>
    </div>
  );
}

export default RoomProgressBadge;
