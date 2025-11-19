"use client";

import NewPasswordForm from "@/components/forms/NewPasswordForm";
import ValidateOtp from "@/components/forms/ValidateOtp";
import AuthLayout from "@/layouts/AuthLayout";
import { useState } from "react";

const ResetPassword = () => {
  const [resetForm, setResetForm] = useState(false);

  return (
    <AuthLayout img={"/assets/sign-up.png"}>
      {resetForm ? (
        <NewPasswordForm />
      ) : (
        <ValidateOtp setResetForm={setResetForm} />
      )}
    </AuthLayout>
  );
};
export default ResetPassword;
