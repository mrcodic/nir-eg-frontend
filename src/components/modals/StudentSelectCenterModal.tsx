"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import { getClientData } from "@/helpers/fetchers/client-fetch";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";

import { useMemo, useState } from "react";

import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { mutateClient } from "@/helpers/fetchers/post-client";
import { useToast } from "@/hooks/use-toast";
import { roomIdSChema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { ComboboxForm } from "../custom/ComboBoxForm";
import SmallSpinner from "../custom/SmallSpinner";

export function StudentSelectCenterModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const modal = useModal();

  const { grade } = useAuthContext();

  const [value, setValue] = useState("");
  const [openCombobox, setOpenCombox] = useState(false);

  const form = useForm({
    resolver: zodResolver(roomIdSChema),
    defaultValues: {
      center_id: "",
    },
  });

  const { data: centers } = useQuery({
    queryKey: [`/guest/centers/${grade?.id}`],
    queryFn: getClientData,
  });

  const onSubmit = async (v: any) => {
    try {
      await mutateClient("/students/subscribe-center", {
        body: v,
      });

      toast({
        description: " تم الاشتراك بنجاح",
        icon: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
      router.push(`/bundles/${v.center_id}`);

      modal.closeModal();
    } catch (error) {
      toast({
        description: "حصل مشكلة اثناء الاشتراك فى السنتر",
        icon: "error",
      });
    }
  };

  const mappedCenters = useMemo(() => {
    return (centers as any)?.data?.map((d) => {
      return {
        value: d.id,
        label: d.title,
      };
    });
  }, [centers]);

  return (
    <div className="">
      <div className="flex items-center gap-3">
        <Image
          src="/assets/icons/location-fill.svg"
          width={24}
          height={24}
          alt="location icon"
        />

        <h2 className="text-lg font-bold text-black">اختر السنتر</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
          <ComboboxForm
            open={openCombobox}
            setOpen={setOpenCombox}
            value={value}
            label={" السنتر"}
            labelClassName="text-base"
            options={mappedCenters}
            onSelect={(v) => {
              setValue(String(v.value));
              form.setValue("center_id", String(v.value));
            }}
          />

          {form.formState.errors.center_id && (
            <p className="text-xs text-red-500">من فضلك اختر السنتر</p>
          )}

          <DialogFooter className="mt-8 grid w-full grid-cols-2 items-center justify-center gap-x-6 gap-y-2 sm:justify-center">
            <Button
              disabled={
                form.formState.isSubmitting || !form.getValues("center_id")
              }
              type="submit"
              className="h-11"
            >
              {!form.formState.isSubmitting ? (
                "   تأكيد"
              ) : (
                <SmallSpinner className="text-white" />
              )}
            </Button>

            <DialogClose asChild>
              <Button
                variant="outline-gray"
                className="h-11"
                onClick={() => {
                  modal.closeModal();
                }}
              >
                إلغاء
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}
