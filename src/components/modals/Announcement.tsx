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
    <div className="pointer-events-auto! fixed top-24 left-1/2 z-50 w-[95%] -translate-x-1/2 py-2 aria-hidden:pointer-events-auto! data-[aria-hidden='true']:pointer-events-auto! md:max-w-[85%]">
      <div className="flex flex-col gap-4">
        {/* {Array.from({ length: 3 }).map((announce, idx) => { */}
        {data?.announcements.map((announce, idx) => (
          <div
            key={announce.id}
            style={{
              boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)",
            }}
            className="bg-background border-gray-light relative flex min-h-[121px] flex-wrap items-center justify-between gap-5 rounded-lg border bg-[url('/assets/announcementBg.svg')] bg-position-[center_left] bg-no-repeat p-4 px-10 text-sm font-bold text-[#523412]"
          >
            <div className="flex flex-wrap items-center gap-6 md:max-w-[70%]">
              <DotLottieReact
                className="h-20 scale-x-[-1]"
                src="/Animations/announcement.lottie"
                autoplay
                loop
              />
              <div>
                <p className="text-base text-wrap">{announce.desc}</p>
              </div>
            </div>

            {announce.file && (
              <a
                href={announce.file}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="h-[3 bg-primary flex h-8 max-w-[170px] items-center gap-3 rounded-lg border border-[#9D8242] p-3 text-xs font-bold text-nowrap text-white md:text-sm"
              >
                <Download />
                نزل الملف من هنا
              </a>
            )}
            <X
              className="absolute top-1 right-1 cursor-pointer rounded-full bg-[#F8DEC5] p-1"
              onClick={() => closeAnnounce(idx)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
