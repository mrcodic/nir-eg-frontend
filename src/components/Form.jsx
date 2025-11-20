"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
const Form = ({ onSubmit }) => {
  const recaptcha = useRef(null);
  const [capatchaError, setCapatchaError] = useState(false);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90%] md:w-[90%]     mx-auto my-4"
    >
      <Link href={"/"}>
        <img className="mb-16" src="/assets/logo.svg" />
      </Link>

      <h4 class="font-bold text-[18px] sm:text-[24px] lg:text-[28px] mb-4">
        مرحبا بك مرة اخرى
      </h4>
      <span class="text-[#41474B] text-[16px] font-bold lg:text-[18px]">
        قم بإدخال بياناتك لتسجيل الدخول
      </span>

      <div className="flex flex-col gap-8">
        <div className="border-2 mt-2 rounded-md w-full lg:w-[887px] p-2 lg:p-4 border-[#F58E16]">
          <div className="flex gap-2 items-center">
            <div className="bg-[#F58E16] rounded-md w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] lg:w-10 lg:h-10 flex text-white text-sm lg:text-[24px] items-center justify-center">
              !
            </div>
            <h3 className="text-[16px] sm:text-[18px] lg:text-[24px] font-bold">
              خطأ في اسم المستخدم أو كلمة السر
            </h3>
          </div>

          <span className="lg:mr-12 inline-block lg:w-[500px] text-[#41474B] font-bold text-sm lg:text-[18px]">
            قم بالتأكد من بياناتك و أعد تحميل الصفحة ثم حاول مرة أخرى أو تواصل
            مع الدعم الفني
          </span>
        </div>
        <div className="mt-1 flex-1 space-y-2">
          <label
            className={` ${
              errors.userName ? "text-[#DF6060]" : "text-[#41474B]"
            }  text-sm sm:text-[16px] lg:text-[18px] font-bold`}
          >
            اسم المستخدم
          </label>
          <div
            className={`border ${
              errors.userName ? "border-[#DF6060]" : "border-[#D9DADB]"
            } flex gap-4 p-2 w-full  lg:w-[877px] rounded-md `}
          >
            <img src="/assets/iconCarrier.svg" />
            <input
              className={`border-none  w-full text-sm sm:text-[16px] lg:text-[18px] outline-hidden placeholder:p-1  text-[#41474B]`}
              {...register("userName", { required: true })}
              type="text"
              placeholder="قم بادخال اسم المستخدم"
            />
          </div>
        </div>
        <div className="space-y-2 flex-1">
          <label
            className={`${
              errors.password ? "text-[#DF6060]" : "text-[#41474B]"
            }  text-sm sm:text-[16px] lg:text-[18px] flex-1 font-bold`}
          >
            كلمة المرور
          </label>
          <div
            className={`border ${
              errors.password ? "border-[#DF6060]" : "border-[#D9DADB]"
            } relative flex gap-4 p-2 w-full  lg:w-[877px] rounded-md  `}
          >
            <img src={"/assets/Lock.svg"} />
            <input
              className="border-none cursor-pointer w-full text-sm sm:text-[16px] lg:text-[18px]  outline-hidden placeholder:p-1  placeholder:text-[#41474B]"
              type={`${isShowPassowrd ? "text" : "password"}`}
              placeholder="قم بادخال كلمة المرور"
              {...register("password", { required: true })}
            />
            <img
              className="absolute left-4"
              onClick={() => setIsShowPassword(!isShowPassowrd)}
              src={`${isShowPassowrd ? "/assets/Eye.svg" : "/assets/Eye2.png"}`}
            />
          </div>
        </div>
        <div className="flex justify-between w-full  lg:w-[877px]">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-[20px] h-[20px] rounded-full overflow-hidden bg-red-500"
            />

            <label className="text-sm sm:text-[16px] lg:text-[18px]">
              قم بتذكر كلمة السر
            </label>
          </div>
          <Link
            href={"/forgetPassword"}
            className="text-[#2E77AE] underline text-sm lg:text-[18px]"
          >
            هل نسيت كلمة السر؟
          </Link>
        </div>
        {/* <div className="bg-[#fafafa] border rounded-md p-2">
            <div className="flex items-center justify-between">
              <img src="/assets/Frame.png" />
              <div className="flex items-center gap-2">
                <span>I'm not a robot</span>
                <input
                  type="checkbox"
                  className="w-[20px] h-[20px] rounded-full overflow-hidden bg-red-500"
                />
              </div>
            </div>
          </div> */}
        <ReCAPTCHA
          sitekey={"6LeMkqUqAAAAAJ0Dz__JykmYpJbFDcoFkw5QTHAv"}
          ref={recaptcha}
        />
        {capatchaError && (
          <p className="text-[#DF6060] text-[12px]">Please Submit Captcha</p>
        )}
        <button className="text-white flex items-center justify-center text-sm lg:text-[20px] py-3 rounded-md bg-[#2E77AE]  w-full  lg:w-[877px]">
          تسجيل الدخول
        </button>
      </div>
    </form>
  );
};
export default Form;
