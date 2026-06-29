import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { ApiResponse, IRoomDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoomSideContent = dynamic(
  () => import("@/modules/rooms/components/RoomSideContent"),
  { ssr: false },
);

export default function RoomSheet({ open, setOpen }) {
  const { room, classroomId } = useParams();

  const { data, isLoading } = useQuery<ApiResponse<IRoomDetails>>({
    queryKey: [`students/get-lessons/${room}?classroom_id=${classroomId}`],
    queryFn: getClientPrivateData,
    enabled: !!open,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="px-2">
        <SheetTitle className="sr-only" />
        <SheetDescription className="sr-only" />
        <RoomSideContent
          data={data?.body}
          locked={data?.body?.locked_to_pass}
          className="static h-[calc(100vh-20px)] border-none pt-4 max-sm:px-0 lg:h-[calc(100vh-20px)]"
          isLoading={isLoading}
        />
      </SheetContent>
    </Sheet>
  );
}
