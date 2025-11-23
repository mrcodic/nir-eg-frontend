import LinkLocked from "@/layouts/LinkLocked";

function RoomFileDownloadLink({
  attachment,
  room,
  subscribe,
  verify,
  lock_after,
  index,
}: {
  attachment: any;
  room: any;
  subscribe: any;
  verify: any;
  lock_after: any;
  index: any;
}) {
  return (
    <div
      key={index}
      className="p-2 border mb-2 justify-between rounded-md bg-background border-gray-light flex"
    >
      <div className="font-bold flex gap-2 items-center">
        <img className="size-7  bg-white " src="/assets/files-fill.svg" />
        <span>{attachment.name}</span>
      </div>

      <LinkLocked
        locked={
          room?.locked_to_pass ||
          room?.latest_room?.locked_to_pass ||
          lock_after == 0
        }
      >
        <a
          onClick={() => {
            window.open(attachment.url, "_blank");
          }}
          download
          className="w-full text-center"
        >
          تنزيل الملف
        </a>
      </LinkLocked>
    </div>
  );
}

export default RoomFileDownloadLink;
