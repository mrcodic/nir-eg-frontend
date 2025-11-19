"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const SUBLINKS = [
  {
    title: "الحصص",
    href: "/classes/classroom",
  },
  {
    title: "الامتحانات",
    href: "/classes/exam",
  },
  {
    title: "نشاطاتي",
    href: "/classes/activity",
  },
  {
    title: "ترتيب الطلاب ",
    href: "/classes/studentsRank",
  },
  {
    title: "بنك الأسئلة",
    href: "/classes/QB",
  },
  {
    title: "اعدادات الفصل",
    href: "/classes/EditClassroom",
  },
];
const ClassesTopbar = () => {
  const pathName = usePathname();
  return (
    <div className="flex justify-between mt-4 items-center">
      <h2 className="text-[#FFFFFF] text-[20px] font-bold">
        الصف الثاني - كيمياء
      </h2>
      <ul className="list-none flex gap-8 text-[16px] font-bold text-white">
        {SUBLINKS.map((sublink) => (
          <li
            className={` ${
              pathName.includes(sublink.href) && "active-category"
            }  p-2 rounded-lg`}
          >
            <Link href={sublink.href}>{sublink.title}</Link>
          </li>
        ))}
      </ul>
      <img
        // style="
        //       filter: brightness(0) saturate(100%) invert(11%)
        //           sepia(19%) saturate(2075%) hue-rotate(168deg)
        //           brightness(94%) contrast(96%);
        //   "
        src="../assets/Chimestry.svg"
      />
    </div>
  );
};

export default ClassesTopbar;
