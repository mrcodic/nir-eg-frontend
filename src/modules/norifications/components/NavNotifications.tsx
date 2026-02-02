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
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { useNotificationSound } from "../hooks/useNotificationSound";
import MarkAllAsRead from "./MarkAllAsRead";
import Notification from "./Notification";

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

  if (isLoading || !notifications || !notifications?.data) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="border-gray-light group hover:bg-primary-800 relative flex size-10 cursor-pointer items-center justify-center rounded-lg border transition-all focus:outline-hidden">
          {notifications?.meta?.unread_count > 0 && (
            <CountBubble count={notifications?.meta?.unread_count} />
          )}

          {/* <DotLottieReact
            key={notifications?.meta?.unread_count}
            className="mx-auto size-28"
            src="/Animations/bell-icon.lottie"
            autoplay={notifications?.meta?.unread_count > 0}
            loop
          /> */}
          <div
            className="bg-primary-800 size-6 mask-center mask-no-repeat object-contain transition-all group-hover:bg-white"
            style={{
              maskImage: "url(/assets/icons/notification.svg)",
            }}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          "z-50 w-screen max-w-[min(438px,95vw)] p-2",
          "border-gray-light rounded-lg border bg-white",
          "flex flex-col overflow-hidden",
          "max-h-[min(80vh,var(--radix-dropdown-menu-content-available-height))]",
        )}
        sideOffset={8}
        collisionPadding={8}
      >
        <div className="flex w-full shrink-0 flex-row-reverse justify-between">
          <h3 className="text-[16px] font-bold text-[#121212]">الإشعارات</h3>

          {notifications?.meta?.unread_count > 0 && (
            <MarkAllAsRead key={notifications?.meta?.unread_count} />
          )}
        </div>

        <div
          className={cn("mt-2 mb-2 flex-1 overflow-y-auto rounded-xl", {
            "animate-pulse opacity-80": isPlaceholderData,
            "border-t-0": notifications?.data?.length === 0,
          })}
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
                src="/assets/BellColor.svg"
                width={300}
                height={200}
                alt="empty notifications icon"
                className="h-[150px] w-[200px] md:h-[200px] md:w-[300px]"
              />
              <p className="text-[#121212]text-center text-sm">
                لا يوجد إشعارات
              </p>
            </div>
          )}
        </div>

        {/* Keep pagination OUTSIDE the scroller */}
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
