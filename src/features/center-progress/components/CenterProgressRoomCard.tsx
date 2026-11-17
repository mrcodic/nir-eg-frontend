import RoomBadge from "@/components/cards/RoomBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CENTER_ATTENDANCE_STATUS,
  CenterProgressRoom,
} from "@/types/center-progress.types";
import {
  getCenterAttendanceClassName,
  getCenterHomeworkClassName,
  getCenterQuizMark,
} from "@/utils/center-progress";

export function CenterProgressRoomCard({ room }: { room: CenterProgressRoom }) {
  return (
    <Card
      className={cn(
        "rounded-xl shadow-none",
        room.attendance_status === CENTER_ATTENDANCE_STATUS.absent &&
          "border-semantics-red/30 bg-semantics-red-50/20",
      )}
    >
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="bg-primary-50 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg font-bold tabular-nums">
            {room.number}
          </span>
          <h3 className="text-sm leading-6 font-bold [overflow-wrap:anywhere]">
            {room.title}
          </h3>
        </div>
        <bdi className="text-muted-foreground text-xs tabular-nums">
          {room.date || "—"}
        </bdi>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-4 pb-4">
        <dl className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col items-center gap-2">
            <dt className="text-muted-foreground">الحضور</dt>
            <dd>
              <RoomBadge
                className={cn(
                  "shadow-none",
                  getCenterAttendanceClassName(room.attendance_status),
                )}
              >
                {room.attendance_label}
              </RoomBadge>
            </dd>
          </div>
          <div className="flex flex-col items-center gap-2">
            <dt className="text-muted-foreground">الواجب</dt>
            <dd>
              <RoomBadge
                className={cn(
                  "shadow-none",
                  getCenterHomeworkClassName(room.homework_status),
                )}
              >
                {room.homework_label}
              </RoomBadge>
            </dd>
          </div>
          <div className="flex flex-col items-center gap-2">
            <dt className="text-muted-foreground">درجة الكويز</dt>
            <dd className="text-primary py-1 text-sm font-bold tabular-nums">
              <bdi>{getCenterQuizMark(room)}</bdi>
            </dd>
          </div>
        </dl>
        {room.notes && (
          <p className="bg-background rounded-lg p-3 text-sm leading-7 [overflow-wrap:anywhere]">
            <span className="font-bold">الملاحظات: </span>
            {room.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
