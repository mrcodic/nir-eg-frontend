import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
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

      await mutateClient(`/students/lesson/store_completed`, {
        body: {
          room_id: Number(roomId),
          lesson_id: Number(lessonId),
          classroom_id: Number(classroomId),
        },
      });
      // await axios.post(
      //   `/api?url=students/lesson/store_completed&paths=/bundles/[classroomId]`,
      //   {
      //     room_id: Number(roomId),
      //     lesson_id: Number(lessonId),
      //     classroom_id: Number(classroomId),
      //   },
      // );

      // invalidate lesson data to refresh completed status

      queryClient.invalidateQueries({
        queryKey: [
          `/students/get-lessons/${roomId}?classroom_id=${classroomId}`,
        ],
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
        className="border-gray-light text-gray-dark hover:bg-primary-800 hover:border-primary-100 ms-auto flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-xs font-bold transition-all hover:text-white disabled:opacity-60"
      >
        انتهيت من الدرس؟{" "}
        {isLoading ? (
          <FaSpinner className="animate-spin" />
        ) : (
          <Check className="size-4" />
        )}
      </button>
    );
  }

  return (
    <div className="bg-semantics-green-dark ms-auto flex items-center gap-2 rounded-lg px-2 py-1">
      <span className="text-xs font-bold text-white">تم الانتهاء</span>
      <Check className="size-4 text-white" />
    </div>
  );
}

export default MarkVideoCompleted;
