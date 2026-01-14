import { getPublicData } from "@/helpers/client-fetch";
import { useCallback, useEffect, useState } from "react";
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

function CustomCityStateField({
  form,
  isSettings,
}: {
  form: UseFormReturn<any>;
  isSettings?: boolean;
}) {
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const [cities, setCities] = useState([]);

  const [stateValue, setStateValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);

  const watchState = useWatch({
    control: form.control,
    name: "state_id",
  });

  const watchCity = useWatch({
    control: form.control,
    name: "city_id",
  });

  const onSelctCity = useCallback(
    (option) => {
      setCityOpen(false);
      const id = String(option.value);
      setCityValue({ value: id, label: option.label });
      form.setValue("city_id", Number(option.value), {
        shouldValidate: true,
      });
    },
    [form],
  );

  console.log(watchCity);

  const onSelctState = useCallback(
    async (option) => {
      setStateOpen(false);
      const id = String(option.value);
      setStateValue({ value: id, label: option.label });

      form.setValue("state_id", Number(id), {
        shouldValidate: true,
      });

      const response = await getPublicData({
        queryKey: [`states/${id}/cities`],
      });

      const mapped = Array.isArray(response)
        ? response.map((c) => ({ value: String(c.id), label: c.name }))
        : [];
      setCities(mapped);

      // for initial render to populate user data
      if (isSettings && watchCity && !cityValue) {
        const city = mapped.find((c) => String(c.value) == String(watchCity));

        onSelctCity(city);
      } else {
        setCityValue(null);
        form.setValue("city_id", "", { shouldValidate: true });
      }
    },
    [isSettings, watchCity, cityValue, onSelctCity, form],
  );

  // for initial render to populate user data
  useEffect(() => {
    if (!isSettings || stateValue) return;
    if (watchState) {
      const state = stateOptions.find(
        (c) => String(c.value) == String(watchState),
      );
      onSelctState(state);
    }
  }, [watchState, isSettings, onSelctState, stateValue]);

  return (
    <>
      <ComboboxForm
        options={stateOptions}
        open={stateOpen}
        value={stateValue}
        setOpen={setStateOpen}
        onSelect={onSelctState}
        label="المحافظة"
        placeholder={"بحث عن محافظة "}
        error={form.formState.errors.state_id?.message}
      />

      <ComboboxForm
        options={cities}
        open={cityOpen}
        value={cityValue}
        setOpen={setCityOpen}
        onSelect={onSelctCity}
        label="المدينة"
        placeholder="بحث عن مدينة "
        error={form.formState.errors.city_id?.message}
      />
    </>
  );
}

export default CustomCityStateField;
