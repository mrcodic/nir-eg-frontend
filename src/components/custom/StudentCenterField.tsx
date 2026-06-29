import { getClientData } from "@/helpers/fetchers/client-fetch";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAuthContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ComboboxForm } from "./ComboBoxForm";

export default function StudentCenterField({
  onSelect,
  disabled,
  className,
}: {
  onSelect: (v: string | { value: string; label: string }) => void;
  disabled?: boolean;
  className?: string;
}) {
  const initCenter = useRef(false);
  const { grade, profile } = useAuthContext();
  const [value, setValue] = useState("");
  const [openCombobox, setOpenCombox] = useState(false);

  const { data: centers } = useQuery({
    queryKey: [`/guest/centers/${grade?.id}`],
    queryFn: getClientData,
  });

  const mappedCenters: { value: string; label: string }[] = useMemo(() => {
    return (centers as any)?.data?.map((d) => {
      return {
        value: d.id,
        label: d.title,
      };
    });
  }, [centers]);

  useEffect(() => {
    if (
      !initCenter.current &&
      profile?.center_id &&
      mappedCenters?.find((c) => Number(c.value) == profile.center_id)
    ) {
      setValue(String(profile.center_id));
      initCenter.current = true;
    }
  }, [profile, mappedCenters]);

  return (
    <div className={cn(className)}>
      <ComboboxForm
        label="السنتر"
        options={mappedCenters}
        value={value}
        onSelect={(v) => {
          setValue(
            typeof v === "string" || typeof v === "number"
              ? String(v)
              : String(v.value),
          );
          onSelect?.(
            typeof v === "string" || typeof v === "number"
              ? String(v)
              : String(v.value),
          );
        }}
        open={openCombobox}
        setOpen={setOpenCombox}
        disabled={disabled}
      />
    </div>
  );
}
