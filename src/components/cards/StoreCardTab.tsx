"use client";
import Image from "next/image";

export default function StoreCardTab({ tab }) {
  return (
    <div
      className="group-data-[state=active]:bg-primary-800 group-data-[state=active]:text-white cursor-pointer border flex gap-3 border-yellow-400 p-2 rounded-lg hover:bg-primary-800 hover:text-white"
      onClick={() => {}}
    >
      <Image src={tab.icon} alt="" width={25} height={25} />
      <p>{tab.label}</p>
    </div>
  );
}
