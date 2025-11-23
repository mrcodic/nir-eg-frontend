function RoomProgressBadge({ progress = 0 }: { progress: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center font-bold  gap-2 py-1 px-2 rounded-lg bg-background">
      <img className="w-4 h-4" src="/assets/launch.svg" />
      <p className="text-sm">
        أنهيت <span className="text-primary-800 underline">{progress}%</span> من
        الحصة
      </p>
    </div>
  );
}

export default RoomProgressBadge;
