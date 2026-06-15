"use client";

import { useMemo, useRef, useState } from "react";

import { useAuthContext } from "@/context/auth-context";
import {
  buildProfileCompletionDefaults,
  ProfileCompletionValues,
  SUPPORTED_FIELD_TYPES,
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

export function useProfileCompletionFields({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const { profile, token } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState<DynamicProfileField[]>([]);

  const filteredFields = useMemo(
    () => fields.filter((f) => f.enabled && SUPPORTED_FIELD_TYPES.has(f.type)),
    [fields],
  );

  // Prevent re-fetching for the same profile within a session
  const skipForSessionRef = useRef<string | null>(null);

  const loadProfileFields = async (): Promise<LoadResult> => {
    if (
      !profile?.id ||
      !profile?.phone ||
      !token ||
      profile.profile_completed === true
    )
      return null;

    if (skipForSessionRef.current === String(profile.id)) return null;

    setIsLoading(true);

    try {
      const fieldsResponse = await fetchRequiredStudentProfileFields();
      const serverFields = sortDynamicProfileFields(
        fieldsResponse?.data?.fields ?? [],
      );

      console.log("server fields : ", serverFields);

      if (!serverFields.length) {
        skipForSessionRef.current = String(profile.id);
        setFields([]);

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
      onSuccess?.();

      return { fields: serverFields, defaults };
    } catch {
      onError?.();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fields,
    loadProfileFields,
    profile,
    token,
    filteredFields,
  };
}
