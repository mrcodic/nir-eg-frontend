import { getCities } from "@/utils/api";
import { useEffect, useState } from "react";
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
  form: any;
  isSettings?: boolean;
}) {
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [stateValue, setStateValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);

  const watchState = form.watch("state_id");
  const watchCity = form.watch("city_id");

  const onSelctState = async (framework) => {
    setStateOpen(false);
    const id = String(framework.value);
    setStateValue({ value: id, label: framework.label });

    form.setValue("state_id", Number(framework.value), {
      shouldValidate: true,
    });

    const response = await getCities({
      queryKey: [`states/${framework.value}/cities`],
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
      form.setValue("city_id", undefined, { shouldValidate: true });
    }
  };

  const onSelctCity = (framework) => {
    setCityOpen(false);
    const id = String(framework.value);
    setCityValue({ value: id, label: framework.label });
    form.setValue("city_id", Number(framework.value), { shouldValidate: true });
  };

  // for initial render to populate user data
  useEffect(() => {
    if (!isSettings || stateValue) return;
    if (watchState) {
      const state = stateOptions.find(
        (c) => String(c.value) == String(watchState)
      );
      onSelctState(state);
    }
  }, [watchState]);

  return (
    <>
      <ComboboxForm
        frameworks={stateOptions}
        name={"state_id"}
        open={stateOpen}
        value={stateValue}
        setOpen={setStateOpen}
        onSelect={onSelctState}
        label="اختر المحافظة"
        placeholder={"بحث عن محافظة "}
        error={form.formState.errors.state_id?.message}
      />

      <ComboboxForm
        frameworks={cities}
        name={"city_id"}
        open={cityOpen}
        value={cityValue}
        setOpen={setCityOpen}
        onSelect={onSelctCity}
        label="اختر المدينة"
        placeholder="بحث عن مدينة "
        error={form.formState.errors.city_id?.message}
      />
    </>
  );
}

export default CustomCityStateField;
