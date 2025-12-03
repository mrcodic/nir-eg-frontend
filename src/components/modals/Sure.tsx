import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export function Sure({ open, setOpen, length }) {
  return (
    <Dialog open={open}>
      <DialogContent className="p-8 max-w-lg bg-white rounded-lg shadow-lg">
        <div className="max-w-[466px] bg-white p-6 rounded-[8px]">
          <p className="text-[18px] font-bold text-[#121212]">
            هل أنت متأكد من أنك تريد حفظ الإجابات؟
          </p>
          <div className="h-[1px] my-[12px] bg-[#D9B45C]" />
          <span className="text-[#121212] inline-block font-medium">
            لن تتمكن من تغيير الإجابات مرة أخرى
          </span>
          {length > 0 && (
            <span className="text-red-500 inline-block font-medium">
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
              className="bg-colorPrimary border text-white font-bold border-[#D9B45C] h-[32px] w-[144px] rounded-[8px]"
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
              type="submit"
              className=" border bg-white text-black hover:text-white  font-bold  h-[32px] w-[144px] rounded-[8px]"
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
