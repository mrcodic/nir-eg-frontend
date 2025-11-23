"use client";

import NewPasswordForm from "@/components/forms/NewPasswordForm";
import ValidateOtp from "@/components/forms/ValidateOtp";
import { useState } from "react";

const ResetPassword = () => {
  const [resetForm, setResetForm] = useState(false);

  return resetForm ? (
    <NewPasswordForm />
  ) : (
    <ValidateOtp setResetForm={setResetForm} />
  );
};
export default ResetPassword;
