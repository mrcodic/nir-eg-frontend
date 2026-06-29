"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import DownloadFileBtn from "../shared/DownloadFileBtn";
import StackedBanners, { StackedBannerItem } from "./StackedBanners";

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

  const { data } = useQuery<{
    status: boolean;
    announcements: Announcement[];
  }>({
    queryKey: ["/students/announcements"],
    queryFn: getClientPrivateData,
    enabled: !!profile && profile.type !== 3,
    staleTime: 1000 * 60 * 30,
  });

  const announcements = useMemo(() => data?.announcements || [], [data]);

  const bannerItems: StackedBannerItem[] = useMemo(() => {
    return !!announcements?.length
      ? announcements.map((a) => ({
          id: a.id,
          icon: "/assets/announcement.svg",
          animateIcon: true,
          content: (
            <div className="flex w-full flex-wrap items-center justify-between gap-5">
              <ScrollArea
                dir="rtl"
                className="h-full max-h-[50vh] flex-1 overflow-y-auto"
              >
                <p className="text-base leading-relaxed">{a.desc}</p>
              </ScrollArea>
              {a.file && (
                <DownloadFileBtn attachment={{ name: a.name, url: a.file }} />
              )}
            </div>
          ),
        }))
      : [];
  }, [announcements]);

  if (!bannerItems.length) return null;

  return (
    <StackedBanners
      banners={bannerItems}
      containerClassName="wrapper fixed top-20 left-1/2 -translate-x-1/2 z-40"
    />
  );
}

export default memo(Announcement);
