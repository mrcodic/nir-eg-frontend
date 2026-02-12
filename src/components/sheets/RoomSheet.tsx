import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { ApiResponse, IRoomDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import RoomSideContent from "../RoomSideContent";

export default function RoomSheet({ open, setOpen }) {
  const { room, SingleCourse } = useParams();

  const { data, isLoading } = useQuery<ApiResponse<IRoomDetails>>({
    queryKey: [`students/get-lessons/${room}?classroom_id=${SingleCourse}`],
    queryFn: getClientPrivateData,
    enabled: !!open,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="px-2">
        <RoomSideContent
          data={data?.body}
          locked={data?.body?.locked_to_pass}
          className="static max-h-[calc(100vh-20px)] border-none pt-14"
          isLoading={isLoading}
        />
      </SheetContent>
    </Sheet>
  );
}
