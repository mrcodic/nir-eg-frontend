"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getLocalStorage } from "@/utils/clientFun";
import Link from "next/link";
import { useParams } from "next/navigation";
import PaymentForm from "../forms/PaymentForm";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";

export default function NotSubscribed({ open, setOpen }) {
  const { toast } = useToast();
  const { room } = useParams();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-8 max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="flex gap-2">
          <img src="/assets/WarningColor.svg" className="w-[42px] h-[42px]" />
          <div>
            <h3 className="text-[#121212] text-[20px] font-bold">
              انت غير مشترك في هذا الكورس
            </h3>
          </div>
        </div>
        <div className="h-px w-full mt-[16px] bg-primary-700" />

        <PaymentForm grade={getLocalStorage("grade")} />

        <DialogFooter className="flex flex-row! justify-start! gap-5 mt-5 ">
          <Link href={`/bundles/${room}`}>
            <Button className="border border-color-primary rounded-[8px] w-[148px] bg-white hover:bg-white text-[14px] font-bold p-4 text-[#121212]">
              رجوع{" "}
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
