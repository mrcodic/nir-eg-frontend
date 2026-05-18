import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { memo } from "react";
import { useFormState } from "react-hook-form";

const SureModal = ({ open, setOpen, questionsCount }) => {
  const { errors } = useFormState();

  const length =
    (errors?.questions &&
      (errors?.questions?.message || errors?.questions.root
        ? questionsCount
        : Object.keys(errors?.questions).length)) ||
    0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-lg bg-white shadow-lg">
        <DialogTitle className="text-[18px] font-bold text-black">
          هل أنت متأكد من أنك تريد حفظ الإجابات؟
        </DialogTitle>
        <div>
          <p className="mt-8 inline-block font-medium text-black">
            لن تتمكن من تغيير الإجابات مرة أخرى
          </p>

          {length > 0 && (
            <p className="ms-1 inline-block font-medium text-red-500">
              - لم تقم بالإجابة على {length} سؤال{" "}
            </p>
          )}
        </div>

        <DialogFooter className="mt-5 flex w-full flex-col items-center justify-start gap-6">
          <DialogClose
            asChild
            className="flex w-full items-center justify-center"
          >
            <Button
              type="submit"
              className="h-11 w-full rounded-lg font-bold"
              onClick={() => {
                setOpen(true);
              }}
            >
              حفظ الإجابات
            </Button>
          </DialogClose>
          <DialogClose
            asChild
            className="flex w-full items-center justify-center!"
          >
            <Button
              variant="ghost"
              className="border-gray-light h-11 w-full rounded-lg border"
              onClick={() => {
                setOpen(false);
              }}
            >
              إلغاء
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(SureModal);
