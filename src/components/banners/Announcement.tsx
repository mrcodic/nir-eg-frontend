"use client";

import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import DownloadFileBtn from "../DownloadFileBtn";

export interface Announcement {
  id: number;
  name: string;
  desc: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  announcement_id: number | null;
  announcement_type: string | null;
  classroom_id: number | null;
  grade_id: number | null;
  file?: string; // backend later
}

function Announcement() {
  const { profile } = useAuthContext();
  const [dismissed, setDismissed] = useState<number[]>([]);

  const { data } = useQuery<{
    status: boolean;
    announcements: Announcement[];
  }>({
    queryKey: ["/students/announcements"],
    queryFn: getClientPrivateData,
    enabled: !!profile && profile.type !== 3,
  });

  const announcements = useMemo(() => {
    return data?.announcements?.filter((a) => !dismissed.includes(a.id)) ?? [];
  }, [data?.announcements, dismissed]);

  if (!data?.status || !announcements.length) return null;

  return (
    <div className="wrapper pointer-events-none fixed top-22 left-1/2 z-40 -translate-x-1/2 px-3">
      <div className="relative max-h-[calc(100vh-5.5rem)] overflow-visible py-2">
        <AnimatePresence mode="popLayout">
          {announcements.map((announce, index) => (
            <motion.div
              key={announce.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: index * -4,
                scale: 1 - index * 0.02,
              }}
              exit={{
                opacity: 0,
                x: 100,
                scale: 0.9,
                transition: {
                  duration: 0.2,
                },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                zIndex: announcements.length - index,
                position: index === 0 ? "relative" : "absolute",
                top: 0,
                left: 0,
                right: 0,
              }}
              className="border-secondary bg-background pointer-events-auto relative flex flex-wrap items-center justify-between gap-5 rounded-lg border p-4 pe-7 text-sm font-bold text-black shadow-lg"
            >
              {/* Content */}
              <div className="flex flex-wrap items-center gap-6">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/assets/announcement.svg"
                    width={40}
                    height={40}
                    alt="announcement"
                  />
                </motion.div>
                <p className="text-base leading-relaxed">{announce.desc}</p>
              </div>

              {/* File button (kept for later) */}
              {announce?.file && (
                <DownloadFileBtn
                  attachment={{ name: announce?.name, url: announce.file }}
                />
              )}

              {/* Close */}
              <button
                aria-label="Close announcement"
                onClick={() => setDismissed((prev) => [...prev, announce.id])}
                className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1 right-1 cursor-pointer rounded-full p-1 transition"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(Announcement);
