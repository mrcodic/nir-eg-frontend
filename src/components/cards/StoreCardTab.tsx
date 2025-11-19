"use client";
import Image from "next/image";
import React from "react";

export default function StoreCardTab({ tab }) {
  return (
    <div
      className="group-data-[state=active]:bg-[#012D5A] group-data-[state=active]:text-white cursor-pointer border flex gap-3 border-yellow-400 p-2 rounded-lg hover:bg-[#012D5A] hover:text-white"
      onClick={() => {}}
    >
      <Image src={tab.icon} alt="" width={25} height={25} />
      <p>{tab.label}</p>
    </div>
  );
}
