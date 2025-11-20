import Image from "next/image";

export default function DoubledText({ text, icon }) {
  return (
    <div className="flex gap-5 items-center">
      <Image src={icon} width={50} height={50} alt="" />

      <div
        className="relative font-bold text-center  text-nowrap text-xl md:text-[40px]
"
      >
        <h3
          style={{
            WebkitTextFillColor: "white",
            WebkitTextStrokeWidth: 1.8,
            WebkitTextStrokeColor: "#d9b45c",
          }}
          className="textStroke  absolute  -top-[4px]  z-0"
        >
          {text}{" "}
        </h3>
        <h3 className="text-primary  relative z-10 ">{text} </h3>
      </div>
    </div>
  );
}
