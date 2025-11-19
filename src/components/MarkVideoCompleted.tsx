import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

type Props = {
  isCompleted: boolean;
  roomId: string;
  classroomId: string;
  lessonId: string;
};

function MarkVideoCompleted({
  isCompleted,
  roomId,
  classroomId,
  lessonId,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  async function handleMarkCompleted(e) {
    e.stopPropagation();

    try {
      setIsLoading(true);
      // Logic to mark the video as completed
      console.log("Marking video as completed...");

      await axios.post(
        `/api?url=students/lesson/store_completed&paths=/bundles/[SingleCourse]`,
        {
          room_id: Number(roomId),
          lesson_id: Number(lessonId),
          classroom_id: Number(classroomId),
        }
      );

      // invalidate lesson data to refresh completed status

      queryClient.invalidateQueries({
        queryKey: [`/students/get-lessons/${roomId}`],
      });
    } catch (err) {
      toast({
        icon: "error",
        description: "تعذر تحديث حالة الدرس. حاول مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isCompleted) {
    return (
      <button
        onClick={handleMarkCompleted}
        disabled={isLoading}
        className="text-xs flex disabled:opacity-60 items-center gap-1 underline font-bold text-[#012D5A]"
      >
        انتهيت من الدرس؟ {isLoading && <FaSpinner className="animate-spin" />}
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Image src="/assets/Done.svg" width={20} height={20} alt="lesson done" />

      <span className="text-xs font-bold text-[#012D5A]">تم الانتهاء</span>
    </div>
  );
}

export default MarkVideoCompleted;
