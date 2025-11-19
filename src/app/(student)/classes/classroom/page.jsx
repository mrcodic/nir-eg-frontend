import Room from "../../../../components/Room";
const ClassroomPage = () => {
  return (
    <div className="w-[50%] mx-auto py-4">
      <Room />
      <Room />
      <Room />
      <Room />

      {/* <div className="border-2 hidden border-[#F58E16] font-bold rounded-lg px-3 py-2">
          <div className="flex gap-4 hidden">
            <img src="/assets/Warning.svg" />
            <p>لم تقم بالإشتراك في حصص هذا الشهر “شهر 9”</p>
          </div>
          <div className="flex hidden items-center gap-4">
            <img src="/assets/Warning.svg" />
            <div>
              <p>
                تغيبت عن حصتين
                <a
                  className="text-[16px] font-bold text-[#2E77AE] underline"
                  href="#"
                >
                  مراجعة الجزء الأول
                </a>
                و
                <a
                  href="#"
                  className="text-[16px] font-bold text-[#2E77AE] underline"
                >
                  مراجعة الجزء الثانى
                </a>
              </p>
              <p>إن تغيبت عن حصة أخرى سيتم إيقافك لهذا الفصل</p>
            </div>
          </div>
        </div>
        <div className="border-2 border-[#DF6060] font-bold rounded-lg px-3 py-2">
          <div className="flex items-center gap-4">
            <img src="/assets/warning-1.svg" />
            <div>
              <p>
                تغيبت عن 3حصص
                <a
                  className="text-[16px] font-bold text-[#2E77AE] underline"
                  href="#"
                >
                  مراجعة الجزء الأول
                </a>
                و
                <a
                  href="#"
                  className="text-[16px] font-bold text-[#2E77AE] underline"
                >
                  مراجعة الجزء الثانى
                </a>
                و
                <a
                  href="#"
                  className="text-[16px] font-bold text-[#2E77AE] underline"
                >
                  مراجعة الجزء الثالث
                </a>
              </p>
              <p>تم إيقافك لهذا الفصل، قم بالتواصل مع الدعم الفني</p>
            </div>
          </div>
        </div>
        <div className="mt-5 p-4 justify-between rounded-lg overflow-hidden shadow-md">
          <div className="flex justify-between border-b border-[#D9DADB] py-3 w-full gap-4">
            <div className="pr-2">
              <div className="text-[#121212] flex items-center gap-2 font-bold text-[18px]">
                <img src="/assets/Rooms2.svg" />
                <h2>حصة رقم 15 - مراجعة ليلة الامتحان - الصف الثاني</h2>
              </div>
              <div className="flex mr-10 mt-4 text-[14px] gap-2">
                <img className="w-[24px] h-[24px]" src="/assets/Time2.svg" />
                <span>تم التنزيل منذ ساعتين</span>
              </div>
            </div>
            <div className="flex justify-between text-center h-full flex-col">
              <div className="flex items-start gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <span className="text-[#41474B] font-normal">80.00 جنيه</span>
                  <img
                    className="w-[24px] h-[24px] cursor-pointer"
                    src="/assets/Lock3.svg"
                  />
                </div>
              </div>
              <div className="w-[88px] mt-4 font-bold py-2 bg-[#F58E16] rounded-lg text-white">
                غائب
              </div>
            </div>
          </div>
          <ul className="list-none flex border-b border-[#D9DADB] pb-4 flex-col gap-6 mt-4">
            <li className="flex items-center gap-4">
              <div className="w-[20px] flex items-center justify-center rounded-md h-[20px] bg-background">
                <img
                  // style="
                  //           filter: brightness(0) saturate(100%)
                  //               invert(53%) sepia(100%) saturate(414%)
                  //               hue-rotate(352deg) brightness(98%)
                  //               contrast(96%);
                  //       "
                  src="/assets/Lesson.svg"
                  className="w-[17.5px] h-[15.62px]"
                />
              </div>
              <h3 className="text-[#41474B] text-[16px] font-bold">
                الصف الثاني - الترم الثاني - حل امتحان 4 (الجزء الأول)
              </h3>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-[20px] flex items-center justify-center rounded-md h-[20px] bg-background">
                <img
                  // style="
                  //           filter: brightness(0) saturate(100%)
                  //               invert(53%) sepia(100%) saturate(414%)
                  //               hue-rotate(352deg) brightness(98%)
                  //               contrast(96%)
                  //       "
                  src="/assets/Lesson.svg"
                  className="w-[17.5px] h-[15.62px]"
                />
              </div>
              <h3 className="text-[#41474B] text-[16px] font-bold">
                الصف الثاني - الترم الثاني - حل امتحان 4 (الجزء الأول)
              </h3>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-[20px] flex items-center justify-center rounded-md h-[20px] bg-background">
                <img
                  // style="
                  //           filter: brightness(0) saturate(100%)
                  //               invert(53%) sepia(100%) saturate(414%)
                  //               hue-rotate(352deg) brightness(98%)
                  //               contrast(96%);
                  //       "
                  src="/assets/Lesson.svg"
                  className="w-[17.5px] h-[15.62px]"
                />
              </div>
              <h3 className="text-[#41474B] text-[16px] font-bold">
                الصف الثاني - الترم الثاني - حل امتحان 4 (الجزء الأول)
              </h3>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-[20px] flex items-center justify-center rounded-md h-[20px] bg-background">
                <img
                  // style="
                  //           filter: brightness(0) saturate(100%)
                  //               invert(53%) sepia(100%) saturate(414%)
                  //               hue-rotate(352deg) brightness(98%)
                  //               contrast(96%);
                  //       "
                  src="/assets/Lesson.svg"
                  className="w-[17.5px] h-[15.62px]"
                />
              </div>
              <h3 className="text-[#41474B] text-[16px] font-bold">
                الصف الثاني - الترم الثاني - حل امتحان 4 (الجزء الأول)
              </h3>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-[20px] flex items-center justify-center rounded-md h-[20px] bg-background">
                <img
                  // style="
                  //           filter: brightness(0) saturate(100%)
                  //               invert(53%) sepia(100%) saturate(414%)
                  //               hue-rotate(352deg) brightness(98%)
                  //               contrast(96%);
                  //       "
                  src="/assets/Lesson.svg"
                  className="w-[17.5px] h-[15.62px]"
                />
              </div>
              <h3 className="text-[#41474B] text-[16px] font-bold">
                الصف الثاني - الترم الثاني - حل امتحان 4 (الجزء الأول)
              </h3>
            </li>
          </ul>
          <div className="mt-4 space-y-3">
            <div className="flex gap-4">
              <img className="w-[24px] h-[24px]" src="/assets/PDF.svg" />
              <span className="text-[#41474B] text-[16px] font-bold">
                الجزء الأول
              </span>
            </div>
            <div className="flex gap-4">
              <img className="w-[24px] h-[24px]" src="/assets/PDF.svg" />
              <span className="text-[#41474B] text-[16px] font-bold">
                الجزء الثانى
              </span>
            </div>
          </div>
        </div>
        <a href="classNameroomDetails.html" className="">
          <div className="mt-5 p-4 justify-between rounded-lg overflow-hidden shadow-md">
            <div className="flex justify-between py-3 w-full gap-4">
              <div className="pr-2">
                <div className="text-[#121212] flex items-center gap-2 font-bold text-[18px]">
                  <img src="/assets/Rooms2.svg" />
                  <h2>حصة رقم 15 - مراجعة ليلة الامتحان - الصف الثاني</h2>
                </div>
                <div className="flex mr-10 mt-4 text-[14px] gap-2">
                  <img
                    className="w-[24px] h-[24px]"
                    src="/assets/Time2.svg"
                  />
                  <span>تم التنزيل منذ ساعتين</span>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <span className="text-[#41474B] font-normal">
                    (3 أيام و 16 ساعة)
                  </span>
                  <img
                    className="w-[24px] cursor-pointer h-[24px]"
                    src="/assets/lock4.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </a>
        <a href="classNameroomDetails.html">
          <div className="mt-5 p-4 justify-between rounded-lg overflow-hidden shadow-md">
            <div className="flex justify-between py-3 w-full gap-4">
              <div className="pr-2">
                <div className="text-[#121212] flex items-center gap-2 font-bold text-[18px]">
                  <img src="/assets/Rooms2.svg" />
                  <h2>حصة رقم 15 - مراجعة ليلة الامتحان - الصف الثاني</h2>
                </div>
                <div className="flex mr-10 mt-4 text-[14px] gap-2">
                  <img
                    className="w-[24px] h-[24px]"
                    src="/assets/Time2.svg"
                  />
                  <span>تم التنزيل منذ ساعتين</span>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <span className="text-[#41474B] font-normal">
                    (3 أيام و 16 ساعة)
                  </span>
                  <img
                    className="w-[24px] cursor-pointer h-[24px]"
                    src="/assets/lock4.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </a>
        <a href="classNameroomDetails.html">
          <div className="mt-5 p-4 justify-between rounded-lg overflow-hidden shadow-md">
            <div className="flex justify-between py-3 w-full gap-4">
              <div className="pr-2">
                <div className="text-[#121212] flex items-center gap-2 font-bold text-[18px]">
                  <img src="/assets/Live.svg" />
                  <h2>حصة رقم 15 - مراجعة ليلة الامتحان - الصف الثاني</h2>
                </div>
                <div className="flex mr-10 mt-4 text-[14px] gap-2">
                  <div className="flex gap-4">
                    <div className="flex gap-2 items-center">
                      <img
                        className="w-[24px] h-[24px]"
                        src="/assets/Time2.svg"
                      />
                      <span className="text-[#41474B] font-normal">
                        3:00 PM
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <img
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(72%) sepia(30%) saturate(6162%)  hue-rotate(351deg) brightness(99%)  contrast(94%);",
                        }}
                        className="w-[24px] h-[24px]"
                        src="/assets/date-1.svg"
                      />
                      <span className="text-[#41474B] font-normal">
                        19/08/2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <span className="text-[#41474B] font-normal">
                    (3 أيام و 16 ساعة)
                  </span>
                  <img
                    className="w-[24px] cursor-pointer h-[24px]"
                    src="/assets/lock4.svg"
                  />
                  <img
                    className="w-[24px] h-[24px]"
                    src="/assets/iconCarrier40.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
      <div className="w-[50%] hidden mx-auto py-4" id="newClassroom">
        <div className="bg-background flex gap-2 text-[#121212] font-bold rounded-lg pr-4 py-4">
          <img src="/assets/Warning-2.svg" />
          <p className="flex gap-2">
            <span> قم بتحميل التطبيق الخاص بنا</span>
            <a
              href="#"
              className="text-[#2E77AE] text-[16px] font-bold underline"
            >
              من هنا
            </a>
            <span>لتتمكن من مشاهدة فيديوهات الدروس</span>
          </p>
        </div>
        <div className="flex mt-8 gap-8">
          <h2 className="text-[18px] font-bold">الصف الثاني - كيمياء</h2>
          <img src="/assets/arrow12.svg" />
          <h2 className="text-[18px] font-bold text-[#2E77AE]">
            حصة رقم 15 - مراجعة ليلة الامتحان - الصف الثاني
          </h2>
        </div>

        <div className="mt-12 overflow-hidden">
          <div className="flex justify-between w-full gap-4">
            <div>
              <div className="text-[#121212] flex items-center gap-2 font-bold text-[18px]">
                <img src="/assets/Rooms2.svg" />
                <h2>حصة رقم 15 - مراجعة ليلة الامتحان - الصف الثاني</h2>
              </div>
              <div className="flex font-normal text-[#41474B] justify-between w-full">
                <div className="flex items-center mr-10 mt-4 text-[14px] gap-2">
                  <img
                    className="w-[24px] h-[24px]"
                    src="/assets/Time2.svg"
                  />
                  <span>5 ساعات و 40 دقيقة</span>
                </div>
                <div className="flex items-center mr-10 mt-4 text-[14px] gap-2">
                  <img className="w-[24px] h-[24px]" src="/assets/" />
                  <span>8 دروس</span>
                </div>
                <div className="flex items-center mr-10 mt-4 text-[14px] gap-2">
                  <img
                    className="w-[24px] h-[24px]"
                    src="/assets/Progress.svg"
                  />
                  <span>تم الانتهاء من 0%</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-2">
              <div className="flex gap-2 items-center">
                <span className="text-[#41474B] font-normal">
                  (3 أيام و 16 ساعة)
                </span>
                <img
                  className="w-[24px] cursor-pointer h-[24px]"
                  src="/assets/lock4.svg"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full pr-2 border-b pb-3 border-[#D9DADB] justify-between items-end gap-4">
            <div className="border flex-1 mt-6 border-[#D9DADB] rounded-lg overflow-hidden">
              <input
                className="text-[18px] placeholder:p-1 p-2 w-full border-none outline-hidden font-normal"
                type="text"
                placeholder="قم بإدخال كود الحصة"
              />
            </div>
            <button className="bg-[#2E77AE] w-1/4 text-center p-3 font-bold rounded-lg text-white">
              إدخال
            </button>
          </div>
          <div className="mt-4 flex gap-2 items-center border-b pb-3 border-[#D9DADB]">
            <img className="w-[32px] h-[32px]" src="/assets/Question4.svg" />
            <h2 className="text-[18px] font-bold text-[#121212]">
              كويز رقم - 1
            </h2>
          </div>
          <div className="mt-4 flex border-b pb-3 border-[#D9DADB] flex-col gap-2">
            <div className="flex text-[#121212] font-bold gap-2">
              <img src="/assets/PDF.svg" />
              <span>الجزء الأول</span>
            </div>
            <div className="flex text-[#121212] font-bold gap-2">
              <img src="/assets/PDF.svg" />
              <span>الجزء الأول</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2 items-center border-b pb-3 border-[#D9DADB]">
            <img src="/assets/Assignment.svg" />
            <h2 className="text-[18px] font-bold text-[#121212]">واجب - 1</h2>
          </div>
          <ul className="list-none mt-3 flex flex-col gap-4">
            <li className="flex items-center font-bold gap-2">
              <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#20364E] text-white rounded-lg">
                01
              </div>
              <div>درس 01 - إجابات الامتحان</div>
            </li>
            <li className="flex items-center font-bold gap-2">
              <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#20364E] text-white rounded-lg">
                01
              </div>
              <div>درس 01 - إجابات الامتحان</div>
            </li>
            <li className="flex items-center font-bold gap-2">
              <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#20364E] text-white rounded-lg">
                01
              </div>
              <div>درس 01 - إجابات الامتحان</div>
            </li>
            <li className="flex items-center font-bold gap-2">
              <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#20364E] text-white rounded-lg">
                01
              </div>
              <div>درس 01 - إجابات الامتحان</div>
            </li>
            <li className="flex items-center font-bold gap-2">
              <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#20364E] text-white rounded-lg">
                01
              </div>
              <div>درس 01 - إجابات الامتحان</div>
            </li>
            <li className="flex items-center font-bold gap-2">
              <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#20364E] text-white rounded-lg">
                01
              </div>
              <div>درس 01 - إجابات الامتحان</div>
            </li>
          </ul>
        </div>
      </div>

      <div
        id="code-modal"
        className="fixed hidden inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center w-screen h-screen"
      >
        <div className="w-[556px] relative bg-white py-4 rounded-lg">
          <div className="w-[90%] mx-auto">
            <span className="text-[20px] cursor-pointer text-left w-full inline-block">
              x
            </span>
            <h2 className="text-[20px] mb-4 font-bold">
              قم بادخال كود حصة رقم 15 - 80.00 جنيه
            </h2>
            <div className="border-2 border-[#F58E16] font-bold rounded-lg px-3 py-2">
              <div className="flex items-center gap-4">
                <img src="/assets/Warning.svg" />
                <div>
                  <p>تأكد من الكود الذي قمت بادخاله و حاول مرة أخرى</p>
                  <p>أو قم بالتواصل مع الدعم الفني</p>
                </div>
              </div>
            </div>
            <div className="flex mt-8 flex-col">
              <label className="text-[18px] mr-4 font-bold text-[#41474B]">
                كود الحصة
              </label>
              <div className="border border-[#D9DADB] rounded-lg overflow-hidden">
                <input
                  className="text-[18px] placeholder:p-1 p-2 w-full border-none outline-hidden font-normal"
                  type="text"
                  placeholder="قم بإدخال كود الحصة"
                />
              </div>
            </div>
            <div className="flex mt-8 gap-4">
              <button className="bg-[#2E77AE] font-bold text-white rounded-lg py-3 w-[242px]">
                إدخال
              </button>
              <button className="bg-[#E2F5FC] font-bold text-[#2E77AE] rounded-lg py-3 w-[242px]">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default ClassroomPage;
