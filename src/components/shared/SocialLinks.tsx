import { cn } from "@/lib/utils";
import { ISocialLink } from "@/types/settings.types";

const linksIconsMap = new Map<ISocialLink["key"], string>([
  ["facebook", "/assets/facebook.svg"],
  ["snapchat", "/assets/snapchat.svg"],
  ["instagram", "/assets/instagram.svg"],
  ["tiktok", "/assets/tiktok.svg"],
]);

function SocialLinks({
  className,
  links,
}: {
  className?: string;
  links: ISocialLink[];
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      {links.map((link) => (
        <a
          key={link.key}
          href={link.url}
          className="group hover:bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white transition-colors duration-300"
        >
          <span
            className="bg-primary h-5 w-5 transition-colors duration-300 group-hover:bg-white"
            style={{
              WebkitMask: `url(${linksIconsMap.get(link?.key)}) no-repeat center / contain`,
              mask: `url(${linksIconsMap.get(link?.key)}) no-repeat center / contain`,
            }}
          />
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
