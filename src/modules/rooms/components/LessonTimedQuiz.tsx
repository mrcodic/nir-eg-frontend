import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useVideoPlayerStore } from "@/store/videoPlayerStore";
import { ILesson } from "@/types";
import { useEffect, useState } from "react";

export default function LessonTimedQuiz({
  lessonData,
}: {
  lessonData: ILesson;
}) {
  const [open, setOpen] = useState(false);
  const { currentTime, pause } = useVideoPlayerStore();

  const quiz = lessonData?.quiz;

  // pause the video when current time is equal to the quiz time (minutes)
  // and open the dialog

  const currentTimeInMinutes = Math.floor(currentTime);

  useEffect(() => {
    if (currentTimeInMinutes === quiz?.[0]?.time) {
      pause();
      setOpen(true);
    }
  }, [setOpen, currentTimeInMinutes, pause, quiz]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <h1>Quiz</h1>
      </DialogContent>
    </Dialog>
  );
}
