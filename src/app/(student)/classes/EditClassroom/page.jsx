const EditClassroom = () => {
  return (
    <>
      <div className="py-4 w-[60%] flex flex-col gap-8 mx-auto">
        <div className="shadow-md rounded-lg p-4">
          <h2 className="text-[#121212] font-bold border-b pb-2">
            الصف الثانى-كيمياء
          </h2>
          <div className="flex border-b pb-4 gap-4 py-4">
            <div className="bg-[#0D2237] w-[48px] rounded-full flex items-center justify-center h-[48px]">
              <img className="h-[32px] w-[32px]" src="/assets/User.svg" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[16px] text-[#121212] font-bold">إسلام</h2>
              <span className="text-[#41474B] font-normal text-sm">
                مدرس كيمياء
              </span>
            </div>
          </div>
          <div className="pr-1 flex gap-4 mt-4">
            <img
              className="w-[24px] h-[24px]"
              src="/assets/date-1.svg"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(68%) sepia(16%) saturate(7077%) hue-rotate(351deg) brightness(99%) contrast(95%)",
              }}
            />
            <span className="text-[16px] font-bold">
              الأحد و الأربعاء - 4:00PM
            </span>
          </div>
          <button className="mt-4 bg-[#2E77AE] rounded-lg justify-center w-[250px] flex gap-4 items-center">
            <img src="/assets/iconCarrier23.svg" />
            <span className="text-[18px] font-bold py-3 text-white rounded-lg">
              تغيير معاد الفصل
            </span>
          </button>
        </div>
      </div>
      <div
        id="changeClassroom-modal"
        className="fixed hidden inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]"
      >
        <div className="bg-white rounded-lg w-[556px] p-4">
          <span className="text-[20px] cursor-pointer text-left w-full inline-block">
            X
          </span>
          <h2 className="text-[20px] text-[#121212] font-bold">
            طلب تغيير معاد الفصل
          </h2>
          <div className="mt-12 font-bold">
            <label>المعاد الحالي</label>
            <div className="bg-background text-[18px] font-bold p-4 mt-2 rounded-lg">
              الأحد
            </div>
          </div>
          <div className="mt-4 font-bold">
            <label>المعاد الجديد</label>
            <div className="border p-2 rounded-lg">
              <select>
                <option>الأحد</option>
                <option>الاثنين</option>
                <option>الثلاثاء</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="w-[508px] flex-1 py-2 rounded-lg text-white font-bold text-[20px] bg-[#2E77AE]">
              تأكيد
            </button>
            <button className="w-[508px] py-2 flex-1 rounded-lg text-[#2E77AE] font-bold text-[20px] bg-background">
              إلغاء
            </button>
          </div>
        </div>
      </div>
      <div
        id="changeClassroom-success"
        className="fixed hidden inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]"
      >
        <div className="bg-white rounded-lg w-[556px] p-4">
          <span className="text-[20px] cursor-pointer text-left w-full inline-block">
            X
          </span>
          <div className="flex font-bold pb-12 flex-col items-center">
            <img className="w-[65px] h-[65px]" src="/assets/Check.svg" />
            <p className="text-[20px] mt-4">تم تغيير ميعاد الفصل بنجاح</p>
          </div>
        </div>
      </div>
      <div className="py-4 w-[60%] flex flex-col gap-8 mx-auto">
        <div className="shadow-md rounded-lg p-4">
          <h2 className="text-[#121212] font-bold border-b pb-2">
            الصف الثانى-كيمياء
          </h2>
          <div className="flex border-b pb-4 gap-4 py-4">
            <div className="bg-[#0D2237] w-[48px] rounded-full flex items-center justify-center h-[48px]">
              <img className="h-[32px] w-[32px]" src="/assets/User.svg" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[16px] text-[#121212] font-bold">إسلام</h2>
              <span className="text-[#41474B] font-normal text-sm">
                مدرس كيمياء
              </span>
            </div>
          </div>
          <div className="pr-1 flex gap-4 mt-4">
            <img
              className="w-[24px] h-[24px]"
              src="/assets/date-1.svg"
              style={{
                filter:
                  " brightness(0) saturate(100%) invert(68%) sepia(16%) saturate(7077%) hue-rotate(351deg) brightness(99%) contrast(95%)",
              }}
            />
            <span className="text-[16px] font-bold">
              الأحد و الأربعاء - 4:00PM
            </span>
          </div>
          <button className="mt-4 bg-[#2E77AE] rounded-lg justify-center w-[250px] flex gap-4 items-center">
            <img src="/assets/iconCarrier23.svg" />
            <span className="text-[18px] font-bold py-3 text-white rounded-lg">
              تغيير معاد الفصل
            </span>
          </button>
        </div>
      </div>
      <div
        id="changeClassroom-modal"
        className="fixed hidden inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]"
      >
        <div className="bg-white rounded-lg w-[556px] p-4">
          <span className="text-[20px] cursor-pointer text-left w-full inline-block">
            X
          </span>
          <h2 className="text-[20px] text-[#121212] font-bold">
            طلب تغيير معاد الفصل
          </h2>
          <div className="mt-12 font-bold">
            <label>المعاد الحالي</label>
            <div className="bg-background text-[18px] font-bold p-4 mt-2 rounded-lg">
              الأحد
            </div>
          </div>
          <div className="mt-4 font-bold">
            <label>المعاد الجديد</label>
            <div className="border p-2 rounded-lg">
              <select>
                <option>الأحد</option>
                <option>الاثنين</option>
                <option>الثلاثاء</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <button className="w-[508px] flex-1 py-2 rounded-lg text-white font-bold text-[20px] bg-[#2E77AE]">
              تأكيد
            </button>
            <button className="w-[508px] py-2 flex-1 rounded-lg text-[#2E77AE] font-bold text-[20px] bg-background">
              إلغاء
            </button>
          </div>
        </div>
      </div>
      <div
        id="changeClassroom-success"
        className="fixed hidden inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]"
      >
        <div className="bg-white rounded-lg w-[556px] p-4">
          <span className="text-[20px] cursor-pointer text-left w-full inline-block">
            X
          </span>
          <div className="flex font-bold pb-12 flex-col items-center">
            <img className="w-[65px] h-[65px]" src="/assets/Check.svg" />
            <p className="text-[20px] mt-4">تم تغيير ميعاد الفصل بنجاح</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditClassroom;
