import Image from "next/image";
import Link from "next/link";

function AppsLinksSection() {
  return (
    <section className="wrapper w-full ">
      <div className="relative  p-6 overflow-hidden min-h-[500px] rounded-lg max-w-7xl mx-auto flex">
        <div className="absolute bg-blue-gradient -z-2 inset-0" />

        <Image
          src="/bg-vector-2.svg"
          alt="background overlay image"
          fill
          className="object-contain object-bottom absolute -z-1 pointer-events-none select-none"
          priority
        />

        <div className="flex items-center max-md:flex-col justify-between grow gap-6">
          <div className="relative z-10 max-w-xl ">
            <div>
              <h4 className="text-white text-3xl font-bold">
                <span className="text-secondary drop-shadow-text">
                  تطبيق نَيِّر
                </span>{" "}
                للأندرويد و الايفون
              </h4>

              <p className="text-lg font-bold mt-4 text-white">
                استفد من تجربة تعليمية متكاملة على هاتفك الذكي. قم بتحميل
                التطبيق و ابدأ التعلم فورا
              </p>
            </div>

            <div className="mt-18">
              <h5 className="text-lg font-bold text-white">
                يمكنك تحميل التطبيق من هنا:
              </h5>

              <div className="flex gap-6 mt-4 flex-wrap">
                <Link href="">
                  <Image
                    src="/assets/Google Play.svg"
                    alt="google play"
                    width={155}
                    height={48}
                  />
                </Link>

                <Link href="">
                  <Image
                    src="/assets/apple.svg"
                    alt="apple link"
                    width={155}
                    height={48}
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex self-end -mb-6 shrink-0 relative pe-6">
            <Image
              src="/assets/phone-2.svg"
              alt="phone image"
              width={220}
              height={391}
              className="-me-12  lg:w-[220px] w-[150px] "
            />
            <Image
              src="/assets/phone-1.svg"
              alt="phone image 2"
              width={220}
              height={391}
              className=" lg:w-[220px] w-[150px]"
            />
            <Image
              src="/assets/notification-bg.svg"
              alt="background norification icon"
              width={125}
              height={125}
              className="absolute -top-3 right-14 lg:right-24 lg:w-[125px] w-20 "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppsLinksSection;
