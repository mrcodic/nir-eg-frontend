import Image from "next/image";

function LockedToPassVideoUI({ message }: { message: string }) {
  return (
    <div className="flex-1 space-y-8">
      <div
        className="flex items-center gap-4 rounded-lg bg-[#FBF6F0] p-2"
        style={{ boxShadow: "0px 2px 10px 4px rgba(157,130,66,0.20)" }}
      >
        <img
          src="/assets/icons/WarningColor.svg"
          className="size-6"
          alt="warning icon"
        />
        <div className="flex flex-col gap-2 text-[16px] text-[#121212]">
          <div className="flex gap-2 text-[12px]">
            <span className="text-sm font-medium text-[#121212] md:text-lg">
              {message}
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-[520px] w-full flex-1 items-center justify-center bg-gray-100">
        <Image src="/assets/Locked.png" width={150} height={150} alt="Locked" />
      </div>
    </div>
  );
}

export default LockedToPassVideoUI;
