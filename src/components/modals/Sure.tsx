import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export function Sure({ open, setOpen, length }) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-lg bg-white rounded-lg shadow-lg">
        <div className="">
          <p className="text-[18px] font-bold text-[#121212]">
            هل أنت متأكد من أنك تريد حفظ الإجابات؟
          </p>
          <p className="text-[#121212] inline-block font-medium mt-8">
            لن تتمكن من تغيير الإجابات مرة أخرى
          </p>

          {length > 0 && (
            <span className="text-red-500 ms-1 inline-block font-medium">
              لم تقم بالإجابة على {length} سؤال{" "}
            </span>
          )}
        </div>

        <DialogFooter className="flex justify-start gap-6 items-center  w-full mt-5">
          <DialogClose
            asChild
            className="flex items-center justify-center w-full"
          >
            <Button
              type="submit"
              className="font-bold  h-11 w-full rounded-lg"
              onClick={() => {
                setOpen(true);
              }}
            >
              حفظ الإجابات
            </Button>
          </DialogClose>
          <DialogClose
            asChild
            className="flex items-center !justify-center w-full"
          >
            <Button
              variant="ghost"
              className="h-11 w-full rounded-lg border border-gray-light"
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
}
