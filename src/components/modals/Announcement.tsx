"use client";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Download, X } from "lucide-react";
import React, { useEffect } from "react";

export default function Announcement() {
  const [data, setData] = React.useState([]);
  const { profile } = useAuthContext();

  useEffect(() => {
    if (profile && profile.type !== 3) {
      getClientPrivateData({
        queryKey: [`/students/announcements`],
      }).then((res) => {
        setData(res);
      });
    }
  }, [profile]);

  if (!data?.status) return;

  function closeAnnounce(idx) {
    setData((prev) => ({
      ...prev,
      announcements: prev.announcements.filter((_, i) => i !== idx),
    }));
  }

  //   if (!data?.status) return;

  if (!data?.announcements?.length) return null;

  return (
    <div className="fixed  top-24  left-1/2 z-50 -translate-x-1/2 py-2 w-[95%] md:max-w-[85%] pointer-events-auto! aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto!">
      <div className="flex flex-col gap-4 ">
        {/* {Array.from({ length: 3 }).map((announce, idx) => { */}
        {data?.announcements.map((announce, idx) => (
          <div
            key={announce.id}
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
            }}
            className="p-4 bg-[url('/assets/announcementBg.svg')] bg-no-repeat bg-position-[center_left] flex flex-wrap items-center min-h-[121px] justify-between px-10 gap-5 bg-background border  text-sm font-bold text-[#523412] border-gray-light rounded-lg   relative"
          >
            <div className="flex flex-wrap items-center md:max-w-[70%] gap-6">
              <DotLottieReact
                className="h-20 scale-x-[-1] "
                src="/Animations/announcement.lottie"
                autoplay
                loop
              />
              <div>
                <p className="text-base text-wrap  ">{announce.desc}</p>
              </div>
            </div>

            {announce.file && (
              <a
                href={announce.file}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 h-8 flex max-w-[170px] text-nowrap items-center gap-3 rounded-lg h-[3 text-white border border-[#9D8242] bg-primary text-xs md:text-sm font-bold"
              >
                <Download />
                نزل الملف من هنا
              </a>
            )}
            <X
              className="absolute right-1 top-1 bg-[#F8DEC5] p-1 rounded-full cursor-pointer"
              onClick={() => closeAnnounce(idx)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
