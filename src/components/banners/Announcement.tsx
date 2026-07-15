"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import DownloadFileBtn from "../shared/DownloadFileBtn";
import StackedBanners, { StackedBannerItem } from "./StackedBanners";

export interface IAnnouncementItem {
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
  file?: string;
}

type DismissedAnnouncementsStorage = Record<string, number>;

const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000;

function getValidDismissedAnnouncements(
  storageKey: string,
): DismissedAnnouncementsStorage {
  try {
    const raw = localStorage.getItem(storageKey);

    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      localStorage.removeItem(storageKey);
      return {};
    }

    const now = Date.now();
    const validItems: DismissedAnnouncementsStorage = {};

    Object.entries(parsed as Record<string, unknown>).forEach(
      ([id, expiresAt]) => {
        if (typeof expiresAt === "number" && expiresAt > now) {
          validItems[id] = expiresAt;
        }
      },
    );

    localStorage.setItem(storageKey, JSON.stringify(validItems));

    return validItems;
  } catch {
    localStorage.removeItem(storageKey);
    return {};
  }
}

function AnnouncementBanner({ profile }: { profile: IUser }) {
  const pathname = usePathname();
  const [storageReady, setStorageReady] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const storageKey = useMemo(() => {
    const userId = profile?.id ? String(profile.id) : "guest";
    return `dismissed-announcements:${userId}`;
  }, [profile?.id]);

  const isHidden =
    pathname.startsWith("/parent-portal") || pathname.startsWith("/short");

  // Re-sync from localStorage whenever the storageKey changes (e.g. user switch)
  useEffect(() => {
    if (isHidden) return;
    setStorageReady(false);
    const validDismissed = getValidDismissedAnnouncements(storageKey);
    setDismissedIds(new Set(Object.keys(validDismissed)));
    setStorageReady(true);
  }, [storageKey, isHidden]);

  const { data } = useQuery<{
    status: boolean;
    announcements: IAnnouncementItem[];
  }>({
    queryKey: ["students-announcements", profile?.id],
    queryFn: () =>
      getClientPrivateData({ queryKey: ["/students/announcements"] }),
    enabled: !!profile && profile.type !== 3 && !isHidden,
    staleTime: 1000 * 60 * 30,
  });

  const announcements = useMemo(
    () => data?.announcements ?? [],
    [data?.announcements],
  );

  const handleDismiss = useCallback(
    (id: string | number) => {
      const bannerId = String(id);

      setDismissedIds((prev) => {
        const next = new Set(prev);
        next.add(bannerId);
        return next;
      });

      try {
        const validDismissed = getValidDismissedAnnouncements(storageKey);
        validDismissed[bannerId] = Date.now() + DISMISS_DURATION_MS;
        localStorage.setItem(storageKey, JSON.stringify(validDismissed));
      } catch {
        // Ignore localStorage errors silently
      }
    },
    [storageKey],
  );

  const bannerItems: StackedBannerItem[] = useMemo(() => {
    return !isHidden
      ? announcements
          .filter((a) => !dismissedIds.has(String(a.id)))
          .map((a) => ({
            id: a.id,
            icon: "/assets/announcement.svg",
            animateIcon: true,
            content: (
              <div className="flex w-full flex-wrap items-center justify-between gap-5 max-sm:flex-col">
                <ScrollArea
                  dir="rtl"
                  className="h-full max-h-[45vh] flex-1 overflow-y-auto"
                >
                  <p className="text-base leading-relaxed">{a.desc}</p>
                </ScrollArea>

                {a.file && (
                  <DownloadFileBtn
                    className="ms-auto"
                    attachment={{ name: a.name, url: a.file }}
                  />
                )}
              </div>
            ),
          }))
      : [];
  }, [announcements, dismissedIds, isHidden]);

  if (isHidden || !storageReady || !bannerItems.length) return null;

  return (
    <StackedBanners
      banners={bannerItems}
      onDismiss={handleDismiss}
      containerClassName="wrapper fixed top-20 left-1/2 -translate-x-1/2 z-40"
    />
  );
}

export default memo(AnnouncementBanner);
