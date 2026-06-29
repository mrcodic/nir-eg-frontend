"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SuccessFeedbackModalProps = {
  open: boolean;
  message: string;
  onOpenChange: (open: boolean) => void;
  iconSrc?: string;
};

export default function SuccessFeedbackModal({
  open,
  message,
  onOpenChange,
  iconSrc = "/assets/gifs/confetti.gif",
}: SuccessFeedbackModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] py-6">
        <DialogHeader className="items-center gap-4">
          <Image src={iconSrc} alt="" width={56} height={56} />
          <DialogTitle className="text-center text-base font-semibold">
            {message}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
