import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import { getPublicData } from "@/helpers/client-fetch";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { useToast } from "@/hooks/use-toast";
import { roomIdSChema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
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
    queryFn: getPublicData,
  });

  const onSubmit = async (v: any) => {
    try {
      await axios.post("/api?url=students/subscribe-center", v);

      toast({
        description: " تم الاشتراك بنجاح",
        icon: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
      router.push(`/bundles/${v.center_id}`);

      modal.closeModal();
    } catch (error) {
      toast({
        description: " حصل مشكلة  ",
        icon: "error",
      });
    }
  };

  const mappedCenters = (centers as any)?.data?.map((d) => {
    return {
      value: d.id,
      label: d.title,
    };
  });

  return (
    <div className="">
      <div className="border-b-primary-700 flex items-center gap-3 border-b pb-3">
        <Image
          src="/assets/icons/LocationColor.svg"
          width={24}
          height={24}
          alt="location icon"
        />

        <h2 className="text-lg font-bold text-[#121212]">اختر السنتر</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Popover open={openCombobox} onOpenChange={setOpenCombox}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                className="border-gray-light! text-custom-brown h-10 w-full justify-between rounded-none border-b"
                onClick={() => setOpenCombox(true)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/icons/Grade.svg"
                    width={20}
                    height={20}
                    alt="graduation hat"
                  />
                  <span className="truncate">
                    {value
                      ? mappedCenters?.find(
                          (framework) => framework.value == value,
                        )?.label || "--"
                      : "أختر السنتر"}
                  </span>
                </div>
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="max-h-[400px] w-(--radix-popover-trigger-width) p-0">
              <Command>
                <CommandInput placeholder="بحث عن السنتر" className="h-9" />
                <CommandList>
                  <CommandEmpty>لا يوجد</CommandEmpty>
                  <CommandGroup>
                    {mappedCenters?.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.label}
                        onSelect={() => {
                          setValue(framework.value);
                          form.setValue("center_id", framework.value);
                          setOpenCombox(false);
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === framework.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {form.formState.errors.center_id && (
            <p className="text-[12px] text-red-500">من فضلك اختر السنتر</p>
          )}

          <DialogFooter className="mt-8 flex w-full flex-row items-center gap-6 max-sm:flex-col sm:justify-center">
            <Button
              className="bg-primary-800 border-gray-light h-8 w-36 rounded-lg border font-bold text-white"
              type="submit"
            >
              {!form.formState.isSubmitting ? "   تأكيد" : <SmallSpinner />}
            </Button>

            <DialogClose
              asChild
              className="flex w-full items-center justify-center!"
            >
              <Button
                className="h-8 w-36 rounded-lg border bg-white font-bold text-black hover:text-white"
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
