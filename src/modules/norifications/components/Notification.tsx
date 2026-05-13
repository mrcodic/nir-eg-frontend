import { mutateClient } from "@/helpers/post-client";
import { INotification } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { formatTime, getHref, getTitle } from "../helpers";

const Notification = ({
  notification,
  closeMenu,
}: {
  notification: INotification;
  closeMenu: () => void;
}) => {
  const queryClient = useQueryClient();

  const markAsRead = async () => {
    closeMenu();

    await mutateClient(`/students/notifications/${notification.id}/read`);

    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("notifications"),
    });
  };

  return (
    <Link
      href={getHref(notification)}
      onClick={markAsRead}
      dir="rtl"
      className={`border-gray-light flex w-full shrink-0 flex-col gap-4 bg-white p-2 py-4 text-sm transition-all not-last:border-b hover:bg-[#F5F5F5] ${
        !notification.is_read ? "bg-[#eee]" : ""
      }`}
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm text-black">{getTitle(notification)}</p>
        {/* <p className="text-black text-sm">{getTitle(notification)}</p> */}

        {notification?.payload?.reply_excerpt && (
          <p className="text-gray-dark text-[13px] italic">
            &quot;{notification.payload.reply_excerpt}&quot;
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Image
          src="/assets/time.svg"
          alt="Time icon"
          className="size-5"
          width={20}
          height={20}
        />
        <span className="text-gray-dark text-[12px]">
          {formatTime(notification.created_at)}
        </span>
        {!notification.is_read && (
          <span className="bg-primary-100 ms-auto size-4 animate-pulse rounded-full"></span>
        )}
      </div>
    </Link>
  );
};

export default Notification;
