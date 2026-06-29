import RoomBadge from "./RoomBadge";

function RoomExpireBadge({
  lock_after,
  className,
}: {
  lock_after: number | null;
  className?: string;
}) {
  return (
    <RoomBadge iconSrc="/assets/lock-fill.svg" className={className}>
      محتويات الحصة متاحة لمدة{" "}
      {Math.floor(lock_after / 24) > 0 && (
        <span className="text-primary-800 mr-1">
          {" "}
          &nbsp; {Math.floor(lock_after / 24)}أيام &nbsp;
          {Math.floor(lock_after % 24)} ساعة{" "}
        </span>
      )}
    </RoomBadge>
  );
}

export default RoomExpireBadge;
