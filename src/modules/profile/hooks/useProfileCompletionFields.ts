"use client";

import { useRef, useState } from "react";

import { useAuthContext } from "@/context/auth-context";
import {
  buildProfileCompletionDefaults,
  ProfileCompletionValues,
} from "@/helpers/profile-completion.helpers";
import { sortDynamicProfileFields } from "@/helpers/profile-fields-order";
import {
  fetchRequiredStudentProfileFields,
  fetchTenantProfilePrefillByPhone,
} from "@/services/auth.service";
import { DynamicProfileField } from "@/types/auth.types";

type LoadResult = {
  fields: DynamicProfileField[];
  defaults: ProfileCompletionValues;
} | null;

export function useProfileCompletionFields() {
  const { profile, token } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState<DynamicProfileField[]>([]);

  // Prevent re-fetching for the same profile within a session
  const skipForSessionRef = useRef<string | null>(null);

  const load = async (): Promise<LoadResult> => {
    if (!profile?.id || !profile?.phone || !token) return null;
    if (skipForSessionRef.current === String(profile.id)) return null;

    setIsLoading(true);

    try {
      const fieldsResponse = await fetchRequiredStudentProfileFields();
      const serverFields = sortDynamicProfileFields(
        fieldsResponse?.data?.fields ?? [],
      );

      if (!serverFields.length) {
        skipForSessionRef.current = String(profile.id);
        setFields([]);
        setOpen(false);
        return null;
      }

      // Prefill is optional — a failure here shouldn't block the modal
      let prefillStudent: Record<string, unknown> | null = null;
      try {
        const prefillResponse = await fetchTenantProfilePrefillByPhone(
          profile.phone,
        );
        prefillStudent = prefillResponse?.data ?? null;
      } catch {
        // continue without prefill
      }

      const defaults = buildProfileCompletionDefaults(
        serverFields,
        prefillStudent,
      );
      setFields(serverFields);
      setOpen(true);

      return { fields: serverFields, defaults };
    } catch {
      setOpen(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { open, setOpen, isLoading, fields, load, profile, token };
}
