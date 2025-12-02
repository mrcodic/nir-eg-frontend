import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

type Props = {
  isCompleted: boolean;
  roomId: string | number;
  classroomId: string;
  lessonId: string | number;
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
        className="text-xs flex disabled:opacity-60 items-center gap-1 underline font-bold text-primary-800"
      >
        انتهيت من الدرس؟ {isLoading && <FaSpinner className="animate-spin" />}
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center bg-semantics-green-dark p-2 rounded-lg">
      <span className="text-sm font-bold text-white">تم الانتهاء</span>
      <Check className="size-4 text-white" />
    </div>
  );
}

export default MarkVideoCompleted;
