import RoomBadge from "@/components/cards/RoomBadge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CenterProgressRoom } from "@/types/center-progress.types";
import {
  getCenterAttendanceClassName,
  getCenterHomeworkClassName,
  getCenterQuizMark,
} from "@/utils/center-progress";

export function CenterProgressTable({
  rooms,
}: {
  rooms: CenterProgressRoom[];
}) {
  return (
    <Card className="hidden overflow-hidden rounded-xl shadow-none md:block">
      <Table className="text-center" aria-label="تفاصيل الحصص">
        <TableHeader className="bg-muted/50">
          <TableRow>
            {[
              "#",
              "الحصة",
              "الحضور",
              "الواجب",
              "درجة الكويز",
              "الملاحظات",
              "التاريخ",
            ].map((label) => (
              <TableHead key={label} scope="col" className="text-center">
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.room_id}>
              <TableCell className="tabular-nums">{room.number}</TableCell>
              <TableCell className="min-w-32 font-bold">{room.title}</TableCell>
              <TableCell>
                <RoomBadge
                  className={cn(
                    "mx-auto w-fit shadow-none",
                    getCenterAttendanceClassName(room.attendance_status),
                  )}
                >
                  {room.attendance_label}
                </RoomBadge>
              </TableCell>
              <TableCell>
                <RoomBadge
                  className={cn(
                    "mx-auto w-fit shadow-none",
                    getCenterHomeworkClassName(room.homework_status),
                  )}
                >
                  {room.homework_label}
                </RoomBadge>
              </TableCell>
              <TableCell className="whitespace-nowrap tabular-nums">
                <bdi>{getCenterQuizMark(room)}</bdi>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-80 min-w-40 text-start leading-6 [overflow-wrap:anywhere]">
                {room.notes || "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap tabular-nums">
                <bdi>{room.date || "—"}</bdi>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
