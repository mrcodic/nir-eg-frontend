import Image from "next/image";

export default function WhatsappFloating() {
  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSPHONE}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group text-md fixed right-4 bottom-9 z-999 mx-auto flex cursor-pointer items-center justify-center gap-4 rounded-full bg-white shadow-lg transition-all md:right-20 md:h-[50px] md:w-fit md:rounded-lg md:px-2"
    >
      <span className="relative flex size-14 items-center justify-center md:size-10 md:gap-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27B43E33]"></span>
        <Image
          src="/assets/Telegram.svg"
          width={40}
          height={40}
          alt=""
          className="relative inline-flex max-md:size-14"
        />
      </span>
      <span className="hidden group-hover:block md:block">
        {" "}
        واجهت مشكلة؟ كلمنا واتساب
      </span>
    </a>
  );
}
