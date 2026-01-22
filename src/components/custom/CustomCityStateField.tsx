"use client";

import { getPublicData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback, useMemo, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { ComboboxForm } from "./ComboBoxForm";

const stateOptions = [
  { value: "1", label: "القاهرة" },
  { value: "2", label: "الإسكندرية" },
  { value: "3", label: "الجيزة" },
  { value: "4", label: "الدقهلية" },
  { value: "5", label: "البحر الأحمر" },
  { value: "6", label: "البحيرة" },
  { value: "7", label: "الفيوم" },
  { value: "8", label: "الغربية" },
  { value: "9", label: "الإسماعيلية" },
  { value: "10", label: "المنوفية" },
  { value: "11", label: "المنيا" },
  { value: "12", label: "القليوبية" },
  { value: "13", label: "الوادي الجديد" },
  { value: "14", label: "السويس" },
  { value: "15", label: "أسوان" },
  { value: "16", label: "أسيوط" },
  { value: "17", label: "بني سويف" },
  { value: "18", label: "بورسعيد" },
  { value: "19", label: "دمياط" },
  { value: "20", label: "الشرقية" },
  { value: "21", label: "جنوب سيناء" },
  { value: "22", label: "كفر الشيخ" },
  { value: "23", label: "مطروح" },
  { value: "24", label: "الأقصر" },
  { value: "25", label: "قنا" },
  { value: "26", label: "شمال سيناء" },
  { value: "27", label: "سوهاج" },
];

type Option = { value: string; label: string };

function CustomCityStateField({ form }: { form: UseFormReturn<any> }) {
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const watchState = useWatch({
    control: form.control,
    name: "state_id",
  });

  const watchCity = useWatch({
    control: form.control,
    name: "city_id",
  });

  const stateId = watchState ? String(watchState) : null;

  const { data: cities = [], isLoading } = useQuery({
    queryKey: stateId ? [`states/${stateId}/cities`] : [],
    queryFn: getPublicData,
    enabled: !!stateId,
    staleTime: 1000 * 60 * 5,
    select: (response) =>
      Array.isArray(response)
        ? response.map((c) => ({
            value: String(c.id),
            label: c.name,
          }))
        : [],
  });

  const selectedState = useMemo(
    () => stateOptions.find((s) => String(s.value) === String(watchState)),
    [watchState],
  );

  const selectedCity = useMemo(() => {
    return cities.find((c) => String(c.value) === String(watchCity));
  }, [cities, watchCity]);

  const onSelctState = useCallback(
    (option: Option) => {
      setStateOpen(false);

      form.setValue("state_id", Number(option.value), {
        shouldValidate: true,
        shouldDirty: true,
      });

      // reset city when state changes
      form.setValue("city_id", "", { shouldValidate: true });
    },
    [form],
  );

  const onSelctCity = useCallback(
    (option: Option) => {
      setCityOpen(false);

      form.setValue("city_id", Number(option.value), {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [form],
  );

  return (
    <>
      <ComboboxForm
        options={stateOptions}
        open={stateOpen}
        value={selectedState ?? null}
        setOpen={setStateOpen}
        onSelect={onSelctState}
        label="المحافظة"
        placeholder="بحث عن محافظة"
        error={form.formState.errors.state_id?.message}
      />

      <ComboboxForm
        options={cities}
        open={cityOpen}
        value={selectedCity ?? null}
        setOpen={setCityOpen}
        onSelect={onSelctCity}
        label="المدينة"
        placeholder={isLoading ? "جاري تحميل المدن..." : "بحث عن مدينة"}
        error={form.formState.errors.city_id?.message}
      />
    </>
  );
}

export default memo(CustomCityStateField);
