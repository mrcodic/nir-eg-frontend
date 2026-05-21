"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import SmallSpinner from "@/components/custom/SmallSpinner";
import SuccessFeedbackModal from "@/components/modals/SuccessFeedbackModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/context/auth-context";
import { mapApiErrorsToForm } from "@/helpers/form-errors";
import {
  buildProfileCompletionDefaults,
  buildProfileCompletionSchema,
  ProfileCompletionValues,
  SUPPORTED_FIELD_TYPES,
} from "@/helpers/profile-completion.helpers";
import { useToast } from "@/hooks/use-toast";
import {
  completeStudentProfile,
  fetchRequiredStudentProfileFields,
  fetchTenantProfilePrefillByPhone,
} from "@/services/auth.service";
import { DynamicProfileField } from "@/types/auth.types";
import Image from "next/image";
import ProfileCompletionFields from "./ProfileCompletionFields";

export default function ProfileCompletionModal() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile, token } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fields, setFields] = useState<DynamicProfileField[]>([]);

  const skipForSessionRef = useRef<string | null>(null);

  const filteredFields = useMemo(
    () =>
      fields.filter(
        (field) => field.enabled && SUPPORTED_FIELD_TYPES.has(field.type),
      ),
    [fields],
  );

  const dynamicSchema = useMemo(
    () => buildProfileCompletionSchema(filteredFields),
    [filteredFields],
  );

  const form = useForm<ProfileCompletionValues>({
    mode: "onSubmit",
    defaultValues: {},
    resolver: zodResolver(dynamicSchema),
  });

  const loadFields = async () => {
    if (!profile?.id || !profile?.phone || !token) return;
    if (skipForSessionRef.current === String(profile.id)) return;

    setIsLoadingFields(true);
    try {
      const fieldsResponse = await fetchRequiredStudentProfileFields();
      const serverFields = fieldsResponse?.data?.fields ?? [];

      if (!serverFields.length) {
        skipForSessionRef.current = String(profile.id);
        setOpen(false);
        setFields([]);
        return;
      }

      let prefillStudent: Record<string, unknown> | null = null;
      try {
        const prefillResponse = await fetchTenantProfilePrefillByPhone(
          profile.phone,
        );
        prefillStudent = prefillResponse?.data ?? null;
      } catch {
        prefillStudent = null;
      }

      const defaults = buildProfileCompletionDefaults(
        serverFields,
        prefillStudent,
      );
      setFields(serverFields);
      form.reset(defaults);
      setOpen(true);
    } catch {
      setOpen(false);
    } finally {
      setIsLoadingFields(false);
    }
  };

  useEffect(() => {
    if (!profile?.id || !token) return;
    if (profile.profile_completed === true) {
      setOpen(false);
      return;
    }
    void loadFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.profile_completed, token]);

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {};

      filteredFields.forEach((field) => {
        const raw = values[field.key];
        if (raw === "" || raw === null || raw === undefined) return;

        if (field.type === "phone" && typeof raw === "object" && raw !== null) {
          const phoneValue = (raw as { phone?: string }).phone;
          if (phoneValue) payload[field.key] = phoneValue;
          return;
        }

        if (
          field.key === "state_id" ||
          field.key === "city_id" ||
          field.key === "student_type"
        ) {
          payload[field.key] = Number(raw);
          return;
        }

        payload[field.key] = raw;
      });

      await completeStudentProfile(payload);
      setOpen(false);
      setShowSuccessModal(true);
      await queryClient.invalidateQueries({ queryKey: ["/students/profile"] });
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.errors) {
        const fieldMap = Object.fromEntries(
          filteredFields.map((field) =>
            field.type === "phone"
              ? [field.key, `${field.key}.phone`]
              : [field.key, field.key],
          ),
        );
        mapApiErrorsToForm(error.response.data.errors, form.setError, {
          fieldMap,
        });
      }

      toast({
        description:
          (isAxiosError(error) &&
            (error.response?.data?.message ||
              error.response?.data?.error?.message)) ||
          "حدث خطأ أثناء استكمال البيانات",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  if (!token) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={() => undefined}>
        <DialogContent
          hideClose
          className="flex max-h-[90dvh] max-w-3xl flex-col overflow-hidden"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="mb-2 gap-8">
            <div className="relative mx-auto size-16">
              <div className="bg-destructive absolute top-1/2 left-1/2 z-1 size-11 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full" />
              <Image
                src="/assets/icons/red-warn.svg"
                alt="red-warn"
                fill
                className="z-10 rounded-full bg-white"
              />
            </div>
            <DialogTitle className="text-center text-xl">
              يرجى استكمل بيانات ملفك الشخصى للتمكن من استخدام المنصة.
            </DialogTitle>
          </DialogHeader>

          {isLoadingFields ? (
            <div className="flex min-h-40 items-center justify-center">
              <SmallSpinner />
            </div>
          ) : (
            <Form {...form}>
              <form className="flex min-h-0 flex-col gap-6" onSubmit={onSubmit}>
                <ScrollArea
                  dir="rtl"
                  className="w-full pb-2 **:data-radix-scroll-area-viewport:max-h-[min(52dvh,calc(100dvh-320px))] [&:has([data-state=visible])]:pe-2"
                >
                  <ProfileCompletionFields
                    form={form}
                    fields={filteredFields}
                  />
                </ScrollArea>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoadingFields}
                >
                  {isSubmitting ? (
                    <SmallSpinner className="text-white" />
                  ) : (
                    "تأكيد"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      <SuccessFeedbackModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        message="تم تأكيد بياناتك بنجاح"
      />
    </>
  );
}
