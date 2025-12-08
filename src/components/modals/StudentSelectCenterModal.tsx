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
import CustomLoader from "../custom/Loader";
import { Label } from "../ui/label";

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
    queryKey: [`/guest/centers/${grade}`],
    queryFn: getPublicData,
  });

  console.log("centers : ", centers);

  const onSubmit = async (v) => {
    try {
      const response = await axios.post(
        "/api?url=students/subscribe-center",
        v
      );

      toast({
        description: " تم الاشتراك بنجاح",
        icon: "success",
      });
      modal.closeModal();

      queryClient.invalidateQueries({ queryKey: ["/students/profile"] });

      router.push(`/bundles/${v.center_id}`);
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
      <div className="flex gap-3 items-center border-b border-b-primary-700 pb-3">
        <Image
          src="/assets/LocationColor.svg"
          width={24}
          height={24}
          alt="location icon"
        />

        <h2 className="font-bold text-lg text-[#121212]">اختر السنتر</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <Label className="text-custom-brown font-bold mb-1">السنتر</Label>
          <Popover open={openCombobox} onOpenChange={setOpenCombox}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                className="w-full justify-between border-b border-gray-light! text-custom-brown rounded-none h-10"
                onClick={() => setOpenCombox(true)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/Grade.svg"
                    width={20}
                    height={20}
                    alt="graduation hat"
                  />
                  <span className="truncate">
                    {value
                      ? mappedCenters?.find(
                          (framework) => framework.value == value
                        )?.label || "--"
                      : "أختر السنتر"}
                  </span>
                </div>
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className=" p-0 w-(--radix-popover-trigger-width) max-h-[400px]">
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
                              : "opacity-0"
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
            <p className="text-red-500 text-[12px]">من فضلك اختر السنتر</p>
          )}

          <DialogFooter className="flex max-sm:flex-col flex-row  gap-6 items-center sm:justify-center  w-full mt-8">
            <Button
              className="bg-primary-800 border text-white font-bold border-gray-light h-8 w-36 rounded-lg"
              type="submit"
            >
              {!form.formState.isSubmitting ? "   تأكيد" : <CustomLoader />}
            </Button>

            <DialogClose
              asChild
              className="flex items-center justify-center! w-full"
            >
              <Button
                className=" border bg-white text-black hover:text-white  font-bold  h-8 w-36 rounded-lg"
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
