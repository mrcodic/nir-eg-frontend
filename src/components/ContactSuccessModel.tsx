import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";

function ContactSuccessModel({
  isOpen,
  handleOpenChange,
}: {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={true}>
        <VisuallyHidden>
          <DialogTitle>تم الارسال بنجاح</DialogTitle>
        </VisuallyHidden>

        <div className="relative h-full flex flex-col gap-6 items-center">
          <Image
            src="/assets/icons/success.svg"
            alt="success"
            width={56}
            height={56}
          />

          <div className="text-center space-y-4">
            <h4 className="text-xl font-bold">شكرا لتواصلك معنا</h4>

            <p className="text-lg">سنقوم بالتواصل معك في أقرب وقت</p>
          </div>

          <DialogClose>
            <Button variant="outline-gray" className="h-11 font-bold text-base">
              اغلاق
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ContactSuccessModel;
