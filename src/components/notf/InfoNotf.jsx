import Image from "next/image";
import React from "react";

const InfoNotf = ({ text, bg, children }) => {
  return (
    <div className={`card-notf mt-3   `}>
      <div
        className={`bg-[${bg}] p-1  rounded-md size-[34px] flex items-center justify-center`}
      >
        {children || (
          <Image src={"/icons/info.svg"} alt="photo" width={24} height={24} />
        )}
      </div>

      <p className="text-14  ">{text}</p>
    </div>
  );
};

export default InfoNotf;
