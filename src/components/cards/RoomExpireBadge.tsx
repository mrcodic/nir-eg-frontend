import RoomBadge from "./RoomBadge";

function RoomExpireBadge({
  lock_after,
  className,
}: {
  lock_after: number | null;
  className?: string;
}) {
  if (!lock_after) return null;
  return (
    <RoomBadge iconSrc="/assets/lock-fill.svg" className={className}>
      محتويات الحصة متاحة لمدة{" "}
      <span className="text-primary-800">
        {Math.floor(lock_after / 24) > 0 && (
          <> {Math.floor(lock_after / 24)}&nbsp;أيام &nbsp;</>
        )}
        {Math.floor(lock_after % 24)} ساعة{" "}
      </span>
    </RoomBadge>
  );
}

export default RoomExpireBadge;
