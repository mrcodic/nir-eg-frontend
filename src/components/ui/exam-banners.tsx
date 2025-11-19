export const ResultBanner = ({ score }) => {
  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
      }}
      className=" gap-4 rounded-lg bg-background  p-2 flex items-center"
    >
      <img src="/assets/Info.svg" />
      <div className="text-[16px] flex flex-col gap-2  text-[#121212]">
        <div className="flex  text-[14px] gap-2">
          <span className="text-[#121212] font-medium">لقد حصلت على </span>
          <span className="text-[#012D5A] font-bold inline-block">
            {score}%
          </span>
          <span className="text-[#121212] font-medium">فى هذا الامتحان</span>
        </div>
      </div>
    </div>
  );
};

export const TargetGradeBanner = ({ score }) => {
  return (
    <div
      style={{
        boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
      }}
      className=" gap-4 rounded-lg bg-background   p-2 flex items-center"
    >
      <img src="/assets/Info.svg" />
      <div className="text-[16px] flex flex-col gap-2  text-[#121212]">
        <div className="flex  text-[12px] gap-2">
          <span className="text-[#121212] whitespace-nowrap font-small md:font-medium">
            يجب أن تحصل على أكثر من
          </span>
          <span className="text-[#012D5A] font-bold inline-block">
            {score}%
          </span>
          <span className="text-[#121212] font-medium">فى هذا الامتحان</span>
        </div>
      </div>
    </div>
  );
};
