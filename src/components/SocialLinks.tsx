import { cn } from "@/lib/utils";
import { FooterSocials } from "@/types/type";
import Image from "next/image";

const linksData = [
  {
    name: "facebook",
    href: "#",
    src: "/assets/facebook.svg",
  },
  {
    name: "snapchat",
    href: "#",
    src: "/assets/snapchat.svg",
  },
  {
    name: "instagram",
    href: "#",
    src: "/assets/instagram.svg",
  },
  {
    name: "tiktok",
    href: "#",
    src: "/assets/tiktok.svg",
  },
];

function SocialLinks({
  className,
  links,
}: {
  className?: string;
  links?: FooterSocials;
}) {
  const linksWithHref = linksData
    ?.map((link) => ({
      ...link,
      href: links?.[link.name.toLowerCase() as keyof FooterSocials] || "",
    }))
    .filter((link) => link.href !== "");

  if (!linksWithHref?.length) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-6 flex-wrap", className)}>
      {linksWithHref?.map((link) => (
        <a
          href={link.href}
          key={link.name}
          target="_blank"
          className="size-8 group hover:bg-primary-800 transition-colors bg-white rounded-lg p-1"
        >
          <Image
            src={link.src}
            width="24"
            height="24"
            alt={link.name}
            className="group-hover:brightness-0 group-hover:invert"
          />
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
