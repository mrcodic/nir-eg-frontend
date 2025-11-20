"use client";

import CustomCityStateField from "@/components/custom/CustomCityStateField";
import CustomInput from "@/components/custom/customInput";
import CustomPhoneInput from "@/components/custom/CustomPhoneInput";
import CustomLoader from "@/components/custom/Loader";
import OtpModal from "@/components/modals/OtpModal";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UploadWithCrop from "@/components/UploadImage";
import { useAuthContext } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { editProfileSchema } from "@/lib/schemas";
import { cn, getPhoneInfoFromCode, isOtpExpired } from "@/lib/utils";
import { getOtp } from "@/utils/api";
import {
  getDataClient,
  mapGradeToText,
  mapTypeToText,
} from "@/utils/clientFun";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Cookies from "js-cookie";

const PageSettings = () => {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [changePassword, setIsChangePassword] = useState(false);
  const { grade } = useAuthContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [openCombobox, setOpenCombox] = useState(false);
  const [value, setValue] = useState("");

  const { data } = useQuery({
    queryKey: ["/students/profile"],
    queryFn: getDataClient,
    staleTime: 0,
  });

  console.log("profile : ", data);

  const phoneInfo = getPhoneInfoFromCode(data?.body?.code_country);

  const defaultData = useMemo(
    () => ({
      first_name: data?.body?.first_name ?? "",
      last_name: data?.body?.last_name ?? "",
      parent_phone: {
        country: phoneInfo?.code || "",
        country_iso: phoneInfo?.isoCode || "",
        phone: data?.body?.parent_phone || "",
      },
      state_id: data?.body?.state_id ?? "",
      center_id: data?.body?.center_id ?? "",
      city_id: data?.body?.city_id ?? "",
      avatar: null,
      old_password: "",
      password: "",
      password_confirmation: "",
    }),
    [data]
  );

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: defaultData,
  });

  const [changeParentNumber, setChangeParentNumber] = useState(false);
  const [changeUserNumber, setChangeUserNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.reset(defaultData);
    }
  }, [data, form.reset, defaultData]);

  const tokenCookie = Cookies.get("auth_token");

  const onSubmit = async (v) => {
    try {
      // check if change password is active and now password fields are entered
      if (changePassword) {
        if (!v.password || !v.password_confirmation || !v.old_password) {
          toast({
            description: "يرجى ادخال كلمة المرور الجديدة",
            icon: "error",
          });
          form.setError("password", {
            type: "manual",
            message: "يرجى ادخال كلمة المرور الجديدة",
          });
          return;
        }
      }

      setIsLoading(true);

      console.log(v);

      const { parent_phone, ...rest } = v;

      const response = await axios.post(
        "/api?url=/students/profile/edit&type=formData",
        {
          ...rest,
          parent_phone: parent_phone.phone,
          country: parent_phone.country,
          country_iso: parent_phone.country_iso,
        },
        {
          headers: {
            "content-type": "multipart/form-data",

            Authorization: `Bearer ${tokenCookie.slice(
              1,
              tokenCookie.length - 1
            )}`,
          },
        }
      );
      setIsLoading(false);

      if (response?.data?.code === 200) {
        toast({
          description: "تم حفظ التغييرات بنجاح",
          icon: "success",
        });

        queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      toast({
        description: err?.response?.data?.error?.message || "   حدث خطأ ما",
        icon: "error",
      });
    }
  };

  const { data: centers } = useQuery({
    queryKey: [`/guest/centers/${grade}`],
    queryFn: getDataClient,
    gcTime: 0,
  });

  const x = centers?.data?.map((d) => {
    return {
      value: d.id,
      label: d.title,
    };
  });

  useEffect(() => {
    if (data?.body?.center_id) {
      setValue(data?.body?.center_id);
      form.setValue("center_id", data?.body?.center_id);
    }
  }, [data?.body?.center_id, form.setValue]);

  return (
    <div className="mt-[120px] mb-[48px] w-[85%] mx-auto">
      <h2 className="text-[#121212] text-[18px]">إعدادات الحساب</h2>
      <div className=" w-full md:w-[50%] mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-[40px] w-full"
          >
            <div className="flex gap-[24px]">
              <UploadWithCrop
                avatar={data?.body?.avatar}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setValue={form.setValue}
              />
            </div>

            <div className="mt-[40px] border border-primary-700 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row gap-[24px] w-full">
                <div className="flex-1">
                  <CustomInput
                    name="first_name"
                    control={form.control}
                    placeholder="الاسم الأول"
                    iconSrc="/assets/user.svg"
                  />
                </div>
                <div className="flex-1">
                  <CustomInput
                    name="last_name"
                    control={form.control}
                    placeholder="الاسم الأخير"
                    iconSrc="/assets/user.svg"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row  gap-[24px] w-full">
                <div className="flex-1  items-center text-gray-dark ">
                  <CustomPhoneInput
                    name="parent_phone.phone"
                    form={form}
                    placeholder="رقم هاتف ولي الأمر"
                    label="رقم هاتف ولي الأمر"
                    iconSrc="/assets/Phone1.svg"
                    countryFieldName="parent_phone.country"
                    countryISOFieldName="parent_phone.country_iso"
                  />
                  {/* <CustomInput
                    name="parent_phone"
                    control={form.control}
                    placeholder="رقم هاتف ولى الأمر"
                    iconSrc="/assets/Phone1.svg"
                    info="يجب أن يكون رقم واتس اب"
                  /> */}

                  {data?.body?.parent_phone_verification === false && (
                    <button
                      onClick={async () => {
                        const { isExpired } = isOtpExpired();
                        if (isExpired) {
                          await getOtp(data?.body?.parent_phone);
                        }
                        setChangeParentNumber(true);
                      }}
                      className="text-[12px] cursor-pointer underline inline-block mt-[8px] font-normal text-[#523412]"
                    >
                      قم بتأكيد رقم ولي الأمر
                    </button>
                  )}
                </div>
              </div>

              <h4 className="text-gray-dark mb-[16px] mt-[32px] text-[12px] font-bold">
                عنوان الطالب
              </h4>

              <div className="flex flex-col md:flex-row items-center  gap-[24px] w-full">
                <CustomCityStateField form={form} isSettings />
              </div>
              <div className="flex flex-col md:flex-row items-center  gap-[24px] w-full">
                <CustomInput
                  control={form.control}
                  name="address"
                  disabled
                  placeholder="المرحله"
                  defaultValue={mapGradeToText(data?.body?.grade)}
                  iconSrc="/assets/user.svg"
                />
                <CustomInput
                  control={form.control}
                  name="address"
                  disabled
                  placeholder="نوع الحساب"
                  defaultValue={mapTypeToText(data?.body?.type)}
                  iconSrc="/assets/user.svg"
                />
              </div>

              {data?.body?.type === 3 && (
                <div className="mt-[24px]">
                  <h2 className="text-[#523412] text-[12px] font-bold">
                    {" "}
                    السنتر
                  </h2>
                  <Popover open={openCombobox} onOpenChange={setOpenCombox}>
                    <PopoverTrigger disabled asChild>
                      <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between border-b border-primary-700! text-custom-brown rounded-none h-10"
                      >
                        {value
                          ? x?.find((framework) => framework.value == value)
                              ?.label
                          : "أختر السنتر"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[780px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="بحث عن السنتر"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>لا يوجد</CommandEmpty>
                          <CommandGroup>
                            {x?.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.label}
                                name={"center_id"}
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
                </div>
              )}

              <div className="flex-1">
                <div className="w-full flex justify-between items-center ">
                  <h4 className="text-gray-dark mb-[16px] mt-[32px] text-[12px] font-bold">
                    كلمة السر
                  </h4>
                  <span className="text-gray-dark mt-[20px] inline-block text-[12px] font-medium">
                    آخر تحديث: {data?.body?.updated_at}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChangePassword((t) => !t)}
                  className="text-[#523412] cursor-pointer text-sm font-medium mt-[8px] underline"
                >
                  {changePassword ? "إلغاء تغيير كلمة السر" : "تغيير كلمة السر"}
                </button>

                {changePassword && (
                  <div className="flex flex-col gap-[10px] justify-between">
                    {
                      <>
                        <CustomInput
                          name="old_password"
                          control={form.control}
                          placeholder="كلمة السر القديمة"
                          iconSrc="/assets/user.svg"
                          type="password"
                        />

                        <Link
                          href="/forgetPassword"
                          className="text-[12px] cursor-pointer underline inline-block mt-[12px] font-normal text-[#523412]"
                        >
                          هل نسيت كلمة السر؟
                        </Link>
                        {/* <span
                          onClick={async () => {
                            const { isExpired } = isOtpExpired();
                            if (isExpired) {
                              await getOtp(data?.body?.phone);
                            }
                            setChangeUserNumber(true);
                          }}
                          className="text-[12px] cursor-pointer underline inline-block mt-[12px] font-normal text-[#523412]"
                        >
                          هل نسيت كلمة السر؟
                        </span> */}
                      </>
                    }

                    <CustomInput
                      name="password"
                      control={form.control}
                      placeholder="كلمة السر الجديدة"
                      iconSrc="/assets/user.svg"
                      type="password"
                    />

                    <CustomInput
                      name="password_confirmation"
                      control={form.control}
                      placeholder="تأكيد كلمة السر"
                      iconSrc="/assets/user.svg"
                      type="password"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-[#012D5A] flex items-center justify-center border border-primary-700 text-white rounded-[10px] py-2 font-bold w-full md:w-[265px] mt-[56px]"
              >
                {isLoading ? <CustomLoader /> : "حفظ التغيرات"}
              </button>

              {Object.values(form.formState.errors).length > 0 && (
                <p className="text-red-500 text-sm">
                  يرجى ملء جميع الحقول المطلوبة
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>

      {(changeUserNumber || changeParentNumber) && (
        <OtpModal
          phone={
            changeUserNumber ? data?.body?.phone : data?.body?.parent_phone
          }
          setOpen={
            changeUserNumber ? setChangeUserNumber : setChangeParentNumber
          }
          open={changeUserNumber || changeParentNumber}
        />
      )}
    </div>
  );
};
export default PageSettings;
