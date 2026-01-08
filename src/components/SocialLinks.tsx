import { cn } from "@/lib/utils";

const links = [
  { name: "Facebook", href: "#", src: "/assets/facebook.svg" },
  { name: "snapchat", href: "#", src: "/assets/snapchat.svg" },
  { name: "instagram", href: "#", src: "/assets/instagram.svg" },
  { name: "tiktok", href: "#", src: "/assets/tiktok.svg" },
];

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="group hover:bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white transition-colors duration-300"
        >
          <span
            className="bg-primary h-5 w-5 transition-colors duration-300 group-hover:bg-white"
            style={{
              WebkitMask: `url(${link.src}) no-repeat center / contain`,
              mask: `url(${link.src}) no-repeat center / contain`,
            }}
          />
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
