import { mutateClient } from "@/helpers/post-client";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

      return await mutateClient(`/comments/${commentId}/reply`, {
        body: formData,
      });
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
    onError: (e) => {
      console.log(e);
      toast({
        description: "حدث خطأ أثناء إرسال الرد",
        icon: "error",
      });
    },
  });
}

export default useSendReply;
