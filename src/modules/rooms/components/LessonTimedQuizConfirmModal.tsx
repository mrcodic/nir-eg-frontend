import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  unansweredCount: number;
  mode: "submit" | "skip";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LessonTimedQuizConfirmModal({
  open,
  unansweredCount,
  mode,
  onCancel,
  onConfirm,
}: Props) {
  const isSkip = mode === "skip";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (!next ? onCancel() : undefined)}
    >
      <DialogContent className="z-[1000003] max-w-lg rounded-lg bg-white shadow-lg">
        <DialogTitle className="text-[18px] font-bold text-black">
          {isSkip
            ? "هل أنت متأكد من تخطي الاختبار؟"
            : "هل أنت متأكد من حفظ الإجابات؟"}
        </DialogTitle>

        {isSkip ? (
          <p className="mt-2 font-medium text-black">
            - سيتم تخطي هذا الاختبار ولن يظهر مرة أخرى .
          </p>
        ) : (
          <>
            <p className="mt-2 font-medium text-black">
              - لن تتمكن من تغيير الإجابات بعد الإرسال
            </p>
            {unansweredCount > 0 && (
              <p className="font-medium text-black">
                - لم تجب على
                <span className="px-1 text-red-600">{unansweredCount}</span>سؤال
              </p>
            )}
          </>
        )}

        <DialogFooter className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
          <Button onClick={onConfirm}>
            {isSkip ? "تأكيد التخطي" : "حفظ الإجابات"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
