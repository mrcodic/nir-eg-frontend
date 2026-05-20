"use client";

import { mutateClient } from "@/helpers/post-client";
import { presistUserPhone } from "@/lib/utils";
import { isAxiosError } from "axios";
import { FieldPath, UseFormReturn } from "react-hook-form";
import {
  RegisterFormValues,
  RegisterStep,
} from "../../../types/register.types";

const STEP_ONE_FIELDS: FieldPath<RegisterFormValues>[] = [
  "first_name",
  "last_name",
  "phones.phone",
  "state_id",
  "city_id",
];

const STEP_TWO_FIELDS: FieldPath<RegisterFormValues>[] = [
  "type",
  "grade_id",
  "password",
  "password_confirmation",
];

type StepperDeps = {
  form: UseFormReturn<RegisterFormValues>;
  setStep: (step: RegisterStep) => void;
  onErrorToast: (message: string) => void;
  onRegistered: (phone: string, countryCode: string) => void;
};

const mapBackendField = (
  key: string,
): FieldPath<RegisterFormValues> | undefined => {
  const map: Record<string, FieldPath<RegisterFormValues>> = {
    phone: "phones.phone",
    parent__phone: "phones.parent__phone",
    first_name: "first_name",
    last_name: "last_name",
    state_id: "state_id",
    city_id: "city_id",
    grade_id: "grade_id",
    type: "type",
    password: "password",
    password_confirmation: "password_confirmation",
  };

  return map[key];
};

const getStepForField = (
  field: FieldPath<RegisterFormValues>,
): RegisterStep => {
  if (STEP_ONE_FIELDS.includes(field)) return 1;
  if (STEP_TWO_FIELDS.includes(field)) return 2;
  return 1;
};

export function useRegisterStepper({
  form,
  setStep,
  onErrorToast,
  onRegistered,
}: StepperDeps) {
  const ensureParentPhone = () => {
    const values = form.getValues();
    if (!values.phones.parent__phone && values.phones.phone) {
      form.setValue("phones.parent__phone", values.phones.phone, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  };

  const validateStepOne = async () => {
    ensureParentPhone();
    const isValid = await form.trigger(STEP_ONE_FIELDS);
    if (!isValid) setStep(1);
    return isValid;
  };

  const validateFirstTwoSteps = async () => {
    const isValid = await form.trigger([
      ...STEP_ONE_FIELDS,
      ...STEP_TWO_FIELDS,
    ]);
    return isValid;
  };

  const submitRegister = async () => {
    ensureParentPhone();
    const isValid = await validateFirstTwoSteps();
    if (!isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0] as
        | FieldPath<RegisterFormValues>
        | undefined;
      if (firstErrorField) {
        setStep(getStepForField(firstErrorField));
      }
      onErrorToast("قم بملء جميع الحقول المطلوبة");
      return false;
    }

    const values = form.getValues();
    const phones = values.phones;

    const payload = {
      ...values,
      ...phones,
      // keep compatibility if endpoint still expects parent phone
      parent__phone: phones.parent__phone || phones.phone,
    };

    try {
      const response = await mutateClient("/auth/register", { body: payload });
      if (response?.status) {
        presistUserPhone(phones.phone, phones.country);
        onRegistered(phones.phone, phones.country);
        return true;
      }
      return false;
    } catch (error) {
      if (isAxiosError(error) && error?.response?.data?.errors) {
        const errors = error.response.data.errors as Record<string, string[]>;
        const firstKey = Object.keys(errors)[0];
        const mappedField = firstKey ? mapBackendField(firstKey) : undefined;
        const firstMessage = firstKey ? errors[firstKey]?.[0] : undefined;

        if (mappedField && firstMessage) {
          form.setError(mappedField, { message: firstMessage });
          setStep(getStepForField(mappedField));
          onErrorToast(firstMessage);
          return false;
        }
      }
      onErrorToast(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          "حدث خطأ ما",
      );
      return false;
    }
  };

  return {
    validateStepOne,
    submitRegister,
  };
}
