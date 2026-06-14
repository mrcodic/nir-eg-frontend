"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useMemo } from "react";
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
import StepperHeader from "@/components/ui/stepper-header";
import {
  buildProfileCompletionSchema,
  ProfileCompletionValues,
} from "@/helpers/profile-completion.helpers";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useProfileCompletionFields } from "../hooks/useProfileCompletionFields";
import { useProfileCompletionStepper } from "../hooks/useProfileCompletionStepper";
import { useProfileCompletionSubmit } from "../hooks/useProfileCompletionSubmit";
import ProfileCompletionFields from "./ProfileCompletionFields";

// ── Sub-component ────────────────────────────────────────────────────────────

type FormActionsProps = {
  isStepper: boolean;
  isLastStep: boolean;
  boundedCurrentStep: number;
  isSubmitting: boolean;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
};

function FormActions({
  isStepper,
  isLastStep,
  boundedCurrentStep,
  isSubmitting,
  isLoading,
  onNext,
  onPrev,
}: FormActionsProps) {
  const isDisabled = isSubmitting || isLoading;
  const showPrev = isStepper && boundedCurrentStep > 0;
  const showNext = isStepper && !isLastStep;

  return (
    <div className="flex items-center gap-3 pb-2">
      {showPrev && (
        <Button
          type="button"
          variant="secondary"
          className="w-32"
          onClick={onPrev}
          disabled={isDisabled}
        >
          السابق
        </Button>
      )}

      {showNext ? (
        <Button
          type="button"
          className="w-full"
          onClick={onNext}
          disabled={isDisabled}
        >
          التالي
        </Button>
      ) : (
        <Button type="submit" className="w-full" disabled={isDisabled}>
          {isSubmitting ? <SmallSpinner className="text-white" /> : "تأكيد"}
        </Button>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ProfileCompletionModal() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [open, setOpen] = useState(false);

  const { isLoading, filteredFields, loadProfileFields, profile, token } =
    useProfileCompletionFields({
      onSuccess: () => setOpen(true),
      onError: () => setOpen(false),
    });

  const dynamicSchema = useMemo(
    () => buildProfileCompletionSchema(filteredFields),
    [filteredFields],
  );

  const form = useForm<ProfileCompletionValues>({
    // mode: "onSubmit",
    mode: "onBlur",
    defaultValues: {},
    resolver: zodResolver(dynamicSchema),
  });

  const {
    boundedCurrentStep,
    resetStep,
    isStepper,
    fieldSteps,
    currentStepFields,
    isLastStep,
    goNextStep,
    goPrevStep,
    moveToStepByField,
    goToStep,
  } = useProfileCompletionStepper({ form, fields: filteredFields });

  const { isSubmitting, submit } = useProfileCompletionSubmit();

  // ── Effects ────────────────────────────────────────────────
  useEffect(() => {
    if (!profile?.id || !token) return;
    if (profile.profile_completed === true) {
      setOpen(false);
      return;
    }

    void loadProfileFields().then((result) => {
      if (!result) return;
      resetStep();
      form.reset(result.defaults);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.profile_completed, token]);

  // ── Handlers ───────────────────────────────────────────────
  const onSubmit = form.handleSubmit(async (values) => {
    await submit({
      values,
      fields: filteredFields,
      form,
      onServerFieldError: moveToStepByField,
      onSuccess: () => {
        setOpen(false);
        setShowSuccessModal(true);
      },
    });
  });

  if (!profile) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={() => undefined}>
        <DialogContent
          hideClose
          className="flex max-w-3xl flex-col pb-4"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="mb-2 gap-8">
            <div className="relative mx-auto size-16">
              <div className="bg-destructive absolute top-1/2 left-1/2 z-1 size-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full" />
              <Image
                src="/assets/icons/red-warn.svg"
                alt="red warn"
                fill
                className="z-10"
              />
            </div>
            <DialogTitle className="text-center text-xl">
              يرجى استكمال بيانات ملفك الشخصي
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <SmallSpinner />
            </div>
          ) : (
            <Form {...form}>
              <form
                className="flex min-h-0 flex-col gap-6"
                onSubmit={isLastStep || !isStepper ? onSubmit : undefined}
              >
                {isStepper && (
                  <StepperHeader
                    currentStep={boundedCurrentStep}
                    totalSteps={fieldSteps.length}
                    onStepClick={(stepIndex) => {
                      void goToStep(stepIndex);
                    }}
                  />
                )}

                <ScrollArea
                  dir="rtl"
                  className={cn(
                    "min-h-[150px] w-full overflow-y-auto",
                    // isStepper
                    //   ? "mt-6 **:data-radix-scroll-area-viewport:max-h-[min(48dvh,calc(100dvh-430px))]"
                    //   : "**:data-radix-scroll-area-viewport:max-h-[min(52dvh,calc(100dvh-330px))]",
                  )}
                >
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 max-md:[&_>_div]:col-span-2">
                    <ProfileCompletionFields
                      form={form}
                      fields={isStepper ? currentStepFields : filteredFields}
                    />
                  </div>
                </ScrollArea>

                <FormActions
                  isStepper={isStepper}
                  isLastStep={isLastStep}
                  boundedCurrentStep={boundedCurrentStep}
                  isSubmitting={isSubmitting}
                  isLoading={isLoading}
                  onNext={() => void goNextStep()}
                  onPrev={goPrevStep}
                />
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {showSuccessModal && (
        <SuccessFeedbackModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          message="تم تأكيد بياناتك بنجاح"
        />
      )}
    </>
  );
}
