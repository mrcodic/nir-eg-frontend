"use client";

import { useAuthContext } from "@/context/auth-context";

function LogoutCustomModal({
  setShowLogoutModal,
}: {
  setShowLogoutModal: (value: boolean) => void;
}) {
  const { logout, deleteGrade } = useAuthContext();

  return (
    <div className="fixed inset-0 flex justify-center items-center  h-screen w-screen bg-[rgba(18,18,18,0.60)] z-9999!">
      <div className="bg-white p-4 rounded-lg w-[90%] md:w-[446px]">
        <img
          onClick={() => {
            setShowLogoutModal(false);
          }}
          className="w-[16px] cursor-pointer h-[16px] mr-auto"
          src="/assets/Close.svg"
        />

        <div className="mb-[16px] flex flex-col">
          <img className="w-[24px] h-[24px]" src="/assets/SignOut.svg" />

          <div className="my-[12px] h-px w-full bg-gray-light" />

          <h1 className="font-bold mb-[32px]">
            هل أنت متأكد من أنك تريد تسجيل الخروج؟
          </h1>

          <div className="flex gap-[16px]">
            <button
              onClick={() => {
                logout();
                setShowLogoutModal(false);
                // router.push("/login");
                window.location.href = "/login";
                deleteGrade();
              }}
              className="w-[148px] rounded-lg flex items-center justify-center py-1 text-white bg-[#B75050] border border-gray-light"
            >
              تسجيل خروج
            </button>
            <button
              onClick={() => {
                setShowLogoutModal(false);
              }}
              className="w-[148px] border border-[#012D5A] rounded-lg flex items-center justify-center py-1 "
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutCustomModal;
