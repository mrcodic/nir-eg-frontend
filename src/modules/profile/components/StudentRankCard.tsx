import Image from "next/image";

function StudentRankCard() {
  return (
    <div className="border-primary-800 h-[92px] w-full rounded-[12px] border p-2 md:w-[260px]">
      <div className="flex h-full items-center gap-6">
        <Image
          src="/assets/rank-colored.svg"
          width={32}
          height={32}
          alt="rank"
        />
        <div>
          <h3 className="text-xl">الترتيب</h3>
          <div className="flex h-9 items-center justify-center text-center">
            <div className="relative min-h-9 w-full font-bold text-nowrap">
              {" "}
              <h3
                style={{
                  WebkitTextFillColor: "white",
                  WebkitTextStrokeWidth: 1,
                  WebkitTextStrokeColor: "#d9b45c",
                }}
                className="textStroke text-28 absolute -top-[4px] z-0 flex items-center"
              >
                {" "}
                --
              </h3>
              <h3 className="text-primary text-28 absolute z-10 flex items-center">
                --
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentRankCard;
