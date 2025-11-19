import Image from "next/image";

export default function Badge({bgColor,icon}) {
    return (
        <div style={{backgroundColor:bgColor}} className={`w-[56px] flex items-center justify-center  h-[56px] rounded-[80px]`}>
            <Image width={40} height={40} src={icon} alt="icon" />
        </div>
    );
}