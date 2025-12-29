import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getClientPrivateData } from "@/helpers/client-fetch";
import { ApiResponse, IRoomDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import RoomSideContent from "../RoomSideContent";

export default function RoomSheet({ open, setOpen }) {
  const { room } = useParams();

  const { data, isLoading } = useQuery<ApiResponse<IRoomDetails>>({
    queryKey: [`students/get-lessons/${room}`],
    queryFn: getClientPrivateData,
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto px-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <FaSpinner className="animate-spin" />
          </div>
        ) : (
          <RoomSideContent
            data={data?.body}
            locked={data?.body?.locked_to_pass}
            className="static border-none pt-14"
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
