"use client";

import CountBubble from "@/components/ui/CountBubble";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { cn } from "@/lib/utils";
import { NotificationsData } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useNotificationSound } from "../hooks/useNotificationSound";
import MarkAllAsRead from "./MarkAllAsRead";
import Notification from "./Notification";
import { ScrollArea } from "@/components/ui/scroll-area";

function NavNotifications() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: notifications,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryFn: getClientPrivateData as () => Promise<NotificationsData>,
    queryKey: ["/students/notifications?page=" + page, "notifications"],
    placeholderData: keepPreviousData,
    refetchInterval: 1000 * 60 * 30,
  });

  useNotificationSound(notifications, isLoading);

  const unreadCount = notifications?.meta?.unread_count || 0;
  const pathname = usePathname();
  const originalTitleRef = useRef("");

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Small delay to let Next.js set the new route title first
    const timeout = setTimeout(() => {
      // Capture original title only if it doesn't already contain our indicator
      if (!document.title.startsWith("🔴")) {
        originalTitleRef.current = document.title;
      }

      if (unreadCount > 0) {
        document.title = `🔴 (${unreadCount} إشعارات جديدة) | ${originalTitleRef.current}`;
      } else if (originalTitleRef.current) {
        document.title = originalTitleRef.current;
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [unreadCount, pathname]);

  if (isLoading || !notifications || !notifications?.data) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="border-primary-100 group hover:bg-primary-800 relative flex size-10 cursor-pointer items-center justify-center rounded-lg border transition-all focus:outline-hidden">
          {notifications?.meta?.unread_count > 0 && (
            <CountBubble count={notifications?.meta?.unread_count} />
          )}
          <div
            className={cn(
              "bg-primary-800 me-px h-6 w-5 mask-center mask-no-repeat transition-all group-hover:bg-white",
              {
                "animate-bell-ring origin-top":
                  notifications?.meta?.unread_count > 0,
              },
            )}
            style={{
              maskImage: "url(/assets/icons/notification.svg)",
              maskSize: "contain",
            }}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          "z-50 w-screen max-w-[min(438px,95vw)] p-2",
          "border-gray-light rounded-lg border bg-white",
          "flex flex-col",
          // "max-h-[min(80vh,var(--radix-dropdown-menu-content-available-height))]",
        )}
        sideOffset={8}
        collisionPadding={8}
      >
        <div className="flex w-full shrink-0 flex-row-reverse justify-between">
          <h3 className="text-base font-bold text-black">الإشعارات</h3>

          {notifications?.meta?.unread_count > 0 && (
            <MarkAllAsRead key={notifications?.meta?.unread_count} />
          )}
        </div>

        <ScrollArea
          className={cn(
            "mt-2 mb-2 h-[calc(100vh-140px)] max-h-[450px] rounded-xl",
            {
              "animate-pulse opacity-80": isPlaceholderData,
              "border-t-0": notifications?.data?.length === 0,
            },
          )}
        >
          {notifications?.data?.length > 0 ? (
            notifications.data.map(
              (notification, index) =>
                notification.type && (
                  <div key={index} className="border-b last:border-b-0">
                    <Notification
                      notification={notification}
                      closeMenu={() => setOpen(false)}
                    />
                  </div>
                ),
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <Image
                src="/assets/bg/search-illustration.svg"
                width={300}
                height={200}
                alt="empty notifications icon"
                className="h-[150px] w-[200px] md:h-[200px] md:w-[300px]"
              />
              <p className="text-blacktext-center text-sm">لا يوجد إشعارات</p>
            </div>
          )}
        </ScrollArea>

        <div className="shrink-0 pt-2 empty:p-0">
          <SimplePagination
            currentPage={notifications?.meta?.current_page}
            lastPage={notifications?.meta?.last_page}
            onPageChange={setPage}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavNotifications;
