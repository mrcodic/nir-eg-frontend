import { INotification } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

    await axios.post(
      `/api?url=students/notifications/${notification.id}/read`,
      {}
    );

    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes("notifications"),
    });
  };

  return (
    <Link
      href={getHref(notification)}
      onClick={markAsRead}
      dir="rtl"
      className={`bg-[#FFFFFF] w-full hover:bg-[#F5F5F5] transition-all not-last:border-b border-gray-light flex flex-col gap-4 text-sm py-4 p-2  shrink-0 ${
        !notification.is_read ? "bg-[#eee]" : ""
      }`}
    >
      <div className="flex flex-col gap-2">
        <p className="text-[#121212] text-sm">{getTitle(notification)}</p>
        {/* <p className="text-[#121212] text-sm">{getTitle(notification)}</p> */}

        {notification?.payload?.reply_excerpt && (
          <p className="text-gray-dark text-[13px] italic">
            "{notification.payload.reply_excerpt}"
          </p>
        )}
      </div>

      <div className="flex gap-[12px] items-center">
        <img src="/assets/time.svg" alt="Time icon" />
        <span className="text-[12px] text-gray-dark">
          {formatTime(notification.created_at)}
        </span>
        {!notification.is_read && (
          <span className="ms-auto size-4 bg-gray-light rounded-full animate-pulse"></span>
        )}
      </div>
    </Link>
  );
};

export default Notification;
