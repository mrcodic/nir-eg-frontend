"use client";

import { AUTH_ERROR_CODES } from "@/constants/error-codes";
import { presistUserPhone } from "@/lib/utils";
import { registerStudentAccount } from "@/services/auth.service";
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
];

const STEP_TWO_FIELDS: FieldPath<RegisterFormValues>[] = [
  "grade_id",
  "password",
  "password_confirmation",
];

type StepperDeps = {
  form: UseFormReturn<RegisterFormValues>;
  setStep: (step: RegisterStep) => void;
  onErrorToast: (message: string) => void;
  onRegistered: () => void;
  onAlreadyEnrolled?: () => void;
};

const mapBackendField = (
  key: string,
): FieldPath<RegisterFormValues> | undefined => {
  const map: Record<string, FieldPath<RegisterFormValues>> = {
    phone: "phones.phone",
    first_name: "first_name",
    last_name: "last_name",
    grade_id: "grade_id",
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
  onAlreadyEnrolled,
}: StepperDeps) {
  const validateBothSteps = async () => {
    const isValid = await form.trigger([
      ...STEP_ONE_FIELDS,
      ...STEP_TWO_FIELDS,
    ]);
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
    return true;
  };

  const validateStepOne = async () => {
    const isValid = await form.trigger(STEP_ONE_FIELDS);
    if (!isValid) setStep(1);
    return isValid;
  };

  const validateBeforeOtpStep = validateBothSteps;

  const buildPayload = () => {
    const values = form.getValues();
    const phones = values.phones;
    return {
      payload: {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: phones.phone,
        grade_id: Number(values.grade_id),
        password: values.password,
        password_confirmation: values.password_confirmation,
        ...(values.recaptcha_token
          ? { recaptcha_token: values.recaptcha_token }
          : {}),
      },
      phone: phones.phone,
      country: phones.country,
    };
  };

  const handleFieldErrors = (error: unknown) => {
    if (isAxiosError(error) && error?.response?.data?.errors) {
      const errors = error.response.data.errors as Record<string, string[]>;
      const firstKey = Object.keys(errors)[0];
      const mappedField = firstKey ? mapBackendField(firstKey) : undefined;
      const firstMessage = firstKey ? errors[firstKey]?.[0] : undefined;

      if (mappedField && firstMessage) {
        form.setError(mappedField, { message: firstMessage });
        setStep(getStepForField(mappedField));
        onErrorToast(firstMessage);
        return true;
      }
    }
    return false;
  };

  const submitRegister = async () => {
    const isValid = await validateBothSteps();
    if (!isValid) return false;

    const { payload, phone, country } = buildPayload();

    try {
      const response = await registerStudentAccount(payload);
      if (response?.status) {
        onRegistered();
        return true;
      }
      return false;
    } catch (error) {
      if (handleFieldErrors(error)) return false;

      const code = isAxiosError(error)
        ? error?.response?.data?.code
        : undefined;

      if (code === AUTH_ERROR_CODES.ALREADY_ENROLLED) {
        presistUserPhone(phone, country);
        onErrorToast("لديك حساب بالفعل على هذه المنصة. برجاء تسجيل الدخول.");
        onAlreadyEnrolled?.();
        return false;
      }

      onErrorToast(
        (isAxiosError(error) &&
          (error?.response?.data?.message ||
            error?.response?.data?.error?.message)) ||
          "حدث خطأ ما",
      );
      return false;
    }
  };

  return {
    validateStepOne,
    validateBeforeOtpStep,
    submitRegister,
    buildPayload,
  };
}
