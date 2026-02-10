import { getClientData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";
import { ComponentProps, memo, useMemo } from "react";
import CustomSelect from "./customSelect";

type Props = Omit<ComponentProps<typeof CustomSelect>, "options"> & {
  queryKey: string;
};

function DynamicSelect({ queryKey, ...rest }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: getClientData,
  });

  const modifiedOptions = useMemo(() => {
    return (data as any)?.data
      ?.map((d: any) => ({
        value: String(d.id),
        label: d.name,
      }))
      .sort((a, b) => a.value - b.value);
  }, [data]);

  return (
    <CustomSelect
      {...rest}
      isLoading={isLoading}
      options={modifiedOptions || []}
    />
  );
}

export default memo(DynamicSelect);
