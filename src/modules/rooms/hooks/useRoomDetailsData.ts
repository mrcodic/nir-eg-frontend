"use client";

import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { ApiResponse, IRoomDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useRoomDetailsData({
  classroomId,
  roomId,
}: {
  classroomId: string;
  roomId: string;
}) {
  const query = useQuery({
    queryFn: getClientPrivateData as unknown as () => ApiResponse<IRoomDetails>,
    queryKey: [`/students/get-lessons/${roomId}?classroom_id=${classroomId}`],
    enabled: Boolean(classroomId && roomId),
  });

  return {
    roomDetails: query.data?.body,
    isLoadingRoomDetails: query.isLoading,
  };
}
