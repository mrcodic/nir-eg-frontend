import Image from "next/image";

function StudentRankCard() {
  return (
    <div className="border-primary-800 border h-[92px] rounded-[12px] p-2 w-full md:w-[260px]">
      <div className="flex gap-6 items-center h-full">
        <Image
          src="/assets/rank-colored.svg"
          width={32}
          height={32}
          alt="rank"
        />
        <div>
          <h3 className="text-xl ">الترتيب</h3>
          <div className="bg-[url(/assets/Rank-1.svg)] size-8">
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
                <h3 className="text-primary flex items-center absolute z-10 text-[28px]">
                  --
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRankCard;
