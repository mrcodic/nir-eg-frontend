import Image from "next/image";

const SupportCard = ({ card }) => {
  return (
    <div className=" w-full max-md:max-w-[335px] md:w-[466px] relative p-6 border rounded-[12px] border-[#F6EADE] h-[105px] md:h-[133px]">
      <h2 className="md:text-[24px] text-[18px] font-bold text-[#523412]">
        {" "}
        {card.title}
      </h2>
      <p className="text-[16px] font-bold text-[#121212]"> {card.desc}</p>
      <div className="w-[72px] flex items-center justify-center absolute rounded-full -top-1/4 right-3/4 h-[72px] border border-[#F8DEC5]  bg-background">
        <Image src={card.icon} width={48} height={48} alt="icon" />
      </div>
    </div>
  );
};
export default SupportCard;
