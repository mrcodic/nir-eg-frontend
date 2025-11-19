function StudentRankCard() {
  return (
    <div className="border-primary-700 border h-[92px] rounded-[12px] p-1 w-full md:w-[260px]">
      <div className="w-full border border-color-primary bg-white p-2 rounded-[8px]">
        <div className="flex gap-[24px]">
          <img src="/assets/RankColor1.svg" />
          <div>
            <h3 className="text-[20px] text-[#523412]">الترتيب</h3>
            <div className="bg-[url(/assets/Rank-1.svg)] w-[32px] h-[32px]">
              <div className="text-center flex items-center justify-center">
                <span
                  style={{
                    textShadow:
                      "2px 0 #000,-2px 0 #000,0 2px #000,0 -2px #000,1px 1px #000,-1px -1px #000,1px -1px #000,-1px 1px #000",
                  }}
                  className="mt-[2px] inline-block text-white text-[20px]"
                >
                  -
                </span>
                <div className="relative font-bold -top-5 right-6 text-nowrap">
                  {" "}
                  <h3
                    style={{
                      WebkitTextFillColor: "white",
                      WebkitTextStrokeWidth: 1,
                      WebkitTextStrokeColor: "#d9b45c",
                    }}
                    className="textStroke text-[28px] absolute flex items-center -top-[4px]  z-0"
                  >
                    {" "}
                    --
                  </h3>
                  <h3 className="text-color-primary flex items-center absolute z-10 text-[28px]">
                    --
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRankCard;
