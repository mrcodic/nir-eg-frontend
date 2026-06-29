"use client";

import { mutateClient } from "@/helpers/fetchers/post-client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function MarkAllAsRead() {
  const [markedAll, setMarkedAll] = useState(false);
  const queryClient = useQueryClient();

  const markAllAsRead = async () => {
    try {
      setMarkedAll(true);

      await mutateClient(`students/notifications/read-all`);

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes("notifications"),
      });
    } catch (error) {
      console.log(error);
      setMarkedAll(false);
    }
  };

  if (markedAll) return null;

  return (
    <button
      disabled={markedAll}
      className="text-secondary text-xs hover:underline"
      onClick={markAllAsRead}
    >
      تحديد الكل كمقروء
    </button>
  );
}

export default MarkAllAsRead;
