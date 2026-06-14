import RoomBadge from "./RoomBadge";

function RoomProgressBadge({ progress = 0 }: { progress: number }) {
  return (
    <RoomBadge iconSrc="/assets/launch.svg">
      أنهيت{" "}
      <span className="text-primary-800 font-bold underline">{progress}%</span>{" "}
      من الحصة
    </RoomBadge>
  );
}

export default RoomProgressBadge;
