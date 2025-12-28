import { getPublicData } from "@/helpers/client-fetch";

import { useEffect, useMemo, useRef, useState } from "react";

import { useAuthContext } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { ComboboxForm } from "./ComboBoxForm";

export default function StudentCenterField({
  onSelect,
}: {
  onSelect: (v: string | { value: string; label: string }) => void;
}) {
  const initCenter = useRef(false);
  const { grade, profile } = useAuthContext();
  const [value, setValue] = useState("");
  const [openCombobox, setOpenCombox] = useState(false);

  const { data: centers } = useQuery({
    queryKey: [`/guest/centers/${grade}`],
    queryFn: getPublicData,
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
    <div className="mt-6">
      <ComboboxForm
        label="السنتر"
        frameworks={mappedCenters}
        value={value}
        onSelect={(v) => {
          setValue(v!);
          onSelect(v!);
        }}
        open={openCombobox}
        setOpen={setOpenCombox}
      />
    </div>
  );
}
