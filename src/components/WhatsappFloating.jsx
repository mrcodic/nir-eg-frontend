import Image from "next/image";

export default function WhatsappFloating() {
  const whatsappLink = `http://t.me/More_english_support?text=محتاج مساعدة لو سمحت`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="cursor-pointer fixed bottom-9 group right-4 md:right-20 shadow-lg md:rounded-lg  transition-all bg-white md:w-fit rounded-full md:h-[50px] md:px-2 flex items-center justify-center gap-4 mx-auto z-999 text-md"
    >
      <span className="relative flex md:gap-2 size-14 md:size-10 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27B43E33]"></span>
        <Image
          src="/assets/Telegram.svg"
          width={40}
          height={40}
          alt=""
          className="relative inline-flex max-md:size-14"
        />
      </span>
      <span className="hidden md:block group-hover:block ">
        {" "}
        واجهت مشكلة؟ كلمنا تيليجرام
      </span>
    </a>
  );
}
