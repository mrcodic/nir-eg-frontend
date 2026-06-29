"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuizStatus } from "@/types";
import { BookOpen, Clock, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  start: QuizStatus | undefined;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function StartExamDialog({
  open,
  start,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent
        dir="rtl"
        className="max-w-sm gap-6"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-start text-lg font-bold">
            {start?.title ?? "هل أنت مستعد؟"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {start?.questions_count && (
            <div className="flex items-center gap-3 text-sm">
              <BookOpen className="text-primary size-5 shrink-0" />
              <span>
                عدد الأسئلة:{" "}
                <strong className="text-primary">
                  {start.questions_count}
                </strong>
              </span>
            </div>
          )}

          {start?.timer && (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="text-primary size-5 shrink-0" />
              <span>
                مدة الامتحان:{" "}
                <strong className="text-primary">{start.timer} دقيقة</strong>
              </span>
            </div>
          )}

          {start?.timer && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <span>
                سيبدأ العد التنازلي للامتحان فور الضغط على &quot;ابدأ
                الامتحان&quot;.
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row-reverse gap-2 sm:flex-row-reverse">
          <Button type="button" onClick={onConfirm} className="flex-1">
            ابدأ الامتحان
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            رجوع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
