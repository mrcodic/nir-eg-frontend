"use client";

import CountBubble from "@/components/ui/CountBubble";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { cn } from "@/lib/utils";
import { NotificationsData } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
    queryFn: getDataClient as () => Promise<NotificationsData>,
    queryKey: ["/students/notifications?page=" + page, "notifications"],
    placeholderData: keepPreviousData,
    refetchInterval: 1000 * 60 * 30,
  });

  useNotificationSound(notifications, isLoading);

  if (isLoading || !notifications || !notifications?.data) return null;

  // console.log("notif : ", notifications);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="size-10 relative   focus:outline-hidden stroke-black text-black  rounded-lg bg-white shadow-md flex items-center justify-center">
          {notifications?.meta?.unread_count > 0 && (
            <CountBubble count={notifications?.meta?.unread_count} />
          )}

          <DotLottieReact
            key={notifications?.meta?.unread_count}
            className="size-28 mx-auto"
            src="/Animations/bell-icon.lottie"
            autoplay={notifications?.meta?.unread_count > 0}
            loop
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          "p-2 z-9999! max-w-[min(438px,95vw)] w-screen",
          "bg-white border rounded-lg border-gray-light",
          "flex flex-col overflow-hidden",
          "max-h-[min(80vh,var(--radix-dropdown-menu-content-available-height))]"
        )}
        sideOffset={8}
        collisionPadding={8}
      >
        <div className="flex flex-row-reverse justify-between  w-full shrink-0">
          <h3 className="text-[16px] text-[#121212] font-bold">الإشعارات</h3>

          {notifications?.meta?.unread_count > 0 && (
            <MarkAllAsRead key={notifications?.meta?.unread_count} />
          )}
        </div>

        <div
          className={cn(
            "border-t mt-2 border-gray-light flex-1 overflow-y-auto pr-1 pb-2",
            {
              "animate-pulse opacity-80": isPlaceholderData,
              "border-t-0": notifications?.data?.length === 0,
            }
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
                )
            )
          ) : (
            <div className="flex flex-col  py-6  items-center justify-center">
              <Image
                src="/assets/search-illustration.svg"
                width={300}
                height={200}
                alt="empty notifications icon"
                className="md:w-[300px] md:h-[200px] w-[200px] h-[150px]"
              />
              <p className="text-sm text-[#121212]text-center">
                لا يوجد إشعارات
              </p>
            </div>
          )}
        </div>

        {/* Keep pagination OUTSIDE the scroller */}
        <div className="pt-2 shrink-0 empty:p-0">
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
