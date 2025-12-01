import Image from "next/image";

function RemainingDuration({
  duration,
  text,
}: {
  duration: number | string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-background px-2 py-1 rounded-lg">
      <Image src="/assets/lock-fill.svg" width={20} height={20} alt="lock" />

      <p className="font-bold text-sm">
        {text} <span className="text-primary-800 ms-1 ">({duration})</span>
      </p>
    </div>
  );
}

export default RemainingDuration;
