import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function useSendReply() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      data,
      currentTime,
      commentId,
    }: {
      data: any;
      currentTime: number;
      commentId: number | string;
      lessonId: number | string;
    }) => {
      const formData = new FormData();
      formData.append("body", data?.body);
      formData.append("at_second", currentTime + "");

      data?.files?.forEach((item) => {
        const fileType = item.file.type;
        if (fileType.startsWith("image")) {
          formData.append(`images[]`, item.file);
        } else if (fileType.startsWith("application")) {
          formData.append(`documents[]`, item.file);
        }
      });

      for (let i = 0; i < data?.audios.length; i++) {
        formData.append("recordings[]", data?.audios[i]);
      }

      return await axios.post(
        `/api?url=/comments/${commentId}/reply&type=formData`,
        formData,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: async (_data, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: [`comments`, lessonId || ""],
        exact: false,
      });

      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey.includes("all-comments") ||
            query.queryKey.includes("lesson-comments")
          );
        },
      });

      toast({
        description: "تم إرسال الرد بنجاح",
        icon: "success",
      });
    },
    onError: () => {
      toast({
        description: "حدث خطأ أثناء إرسال الرد",
        icon: "error",
      });
    },
  });
}

export default useSendReply;
