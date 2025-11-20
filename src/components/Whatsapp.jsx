"use client";

const WhatsAppContact = ({ message, className }) => {
  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSPHONE}?text=${message}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-success`}
    >
      <button
        className={`${className} w-[368px] border text-[10px] md:text-[18px] font-bold  flex items-center justify-center rounded-[10px] border-[#D9B45C)] mx-auto text-white bg-primary h-[40px] `}
      >
        <img
          className=" w-[16px] h-[16px] md:w-[20px] md:h-[20px]"
          src="/assets/Whatsapp.svg"
        />
        <span>تواصل معنا</span>
      </button>
    </a>
  );
};

export default WhatsAppContact;
