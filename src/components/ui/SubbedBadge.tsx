import Image from "next/image";

function SubbedBadge() {
  return (
    <span className="bg-semantics-green-dark flex h-8 items-center gap-2 rounded-lg ps-2 pe-3 text-lg text-white">
      <Image
        src="/assets/success.svg"
        width={24}
        height={24}
        className="brightness-0 invert"
        alt="success icon"
      />
      <span>مشترك</span>
    </span>
  );
}

export default SubbedBadge;
