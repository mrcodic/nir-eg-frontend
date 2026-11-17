import Empty from "@/components/shared/Empty";
import { CenterProgressRoomCard } from "@/features/center-progress/components/CenterProgressRoomCard";
import { CenterProgressTable } from "@/features/center-progress/components/CenterProgressTable";
import { CenterProgressRoom } from "@/types/center-progress.types";

export function CenterProgressRooms({
  rooms,
}: {
  rooms: CenterProgressRoom[];
}) {
  return (
    <section
      aria-labelledby="center-rooms-title"
      className="flex min-w-0 flex-col gap-3"
    >
      <h2 id="center-rooms-title" className="text-lg font-bold">
        تفاصيل الحصص
      </h2>
      {rooms.length === 0 ? (
        <Empty text="لا توجد حصص مسجلة حتى الآن" />
      ) : (
        <>
          <CenterProgressTable rooms={rooms} />
          <div className="flex flex-col gap-3 md:hidden">
            {rooms.map((room) => (
              <CenterProgressRoomCard key={room.room_id} room={room} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
