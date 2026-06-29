import { NotificationsData } from "@/types";
import { useEffect, useRef } from "react";

export function useNotificationSound(
  notifications: NotificationsData | undefined,
  isLoading: boolean
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevNotificationsRef = useRef<NotificationsData | null>(null);

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/ping.mp3"); // Adjust path to your sound file
      audioRef.current.preload = "auto";
    }

    // Skip if still loading or no notifications data
    if (isLoading || !notifications || !notifications.meta) {
      return;
    }

    const prevNotifications = prevNotificationsRef.current;

    // First fetch: play sound if there are unread notifications
    if (!prevNotifications && notifications.meta.unread_count > 0) {
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }

    // Subsequent fetches: compare with previous state
    if (prevNotifications && notifications.meta.unread_count > 0) {
      const prevUnreadCount = prevNotifications.meta.unread_count;
      const currentUnreadCount = notifications.meta.unread_count;

      // Check if unread count increased
      const unreadCountIncreased = currentUnreadCount > prevUnreadCount;

      // Check if the last notification is new and unread
      const lastNotification = notifications.data[0];
      const prevLastNotification = prevNotifications.data[0];
      const isNewUnreadNotification =
        lastNotification &&
        !lastNotification.is_read &&
        (!prevLastNotification ||
          lastNotification.id !== prevLastNotification.id);

      // Play sound if either condition is met
      if (unreadCountIncreased || isNewUnreadNotification) {
        audioRef.current
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
    }

    // Update previous notifications state
    prevNotificationsRef.current = notifications;
  }, [notifications, isLoading]);
}
