import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useSendComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      data,
      currentTime,
      lessonId,
    }: {
      data: any;
      currentTime: number;
      lessonId: number | string;
    }) => {
      const formData = new FormData();

      console.log("currentTime : ", currentTime);

      formData.append("body", data?.body);
      formData.append("at_second", currentTime + "");

      data?.files?.forEach((item: File) => {
        const fileType = item.type;
        if (fileType.startsWith("image")) {
          formData.append(`images[]`, item);
        } else if (fileType.startsWith("application")) {
          formData.append(`documents[]`, item);
        }
      });

      for (let i = 0; i < data?.audios.length; i++) {
        formData.append("recordings[]", data?.audios[i]);
      }

      return await mutateClient(`lessons/${lessonId}/comments`, {
        body: formData,
      });
    },
    onSuccess: async (_data, { lessonId }) => {
      queryClient.invalidateQueries({
        queryKey: [`comments`, lessonId || ""],
        exact: false,
      });

      queryClient.invalidateQueries({
        // "lesson-comments"
        predicate: (query) => {
          return (
            query.queryKey.includes("all-comments") ||
            query.queryKey.includes("lesson-comments")
          );
        },
      });

      toast({
        description: "تم إرسال التعليق بنجاح",
        icon: "success",
      });
    },
    onError: () => {
      toast({
        description: "حدث خطأ أثناء إرسال التعليق",
        icon: "error",
      });
    },
  });
}

export default useSendComment;
