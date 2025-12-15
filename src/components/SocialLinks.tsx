import { cn } from "@/lib/utils";

const links = [
  { name: "Facebook", href: "#", src: "/assets/facebook.svg" },
  { name: "snapchat", href: "#", src: "/assets/snapchat.svg" },
  { name: "instagram", href: "#", src: "/assets/instagram.svg" },
  { name: "tiktok", href: "#", src: "/assets/tiktok.svg" },
];

function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-6 flex-wrap", className)}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="
            group
            w-8 h-8 rounded-lg
            bg-white
            hover:bg-primary
            transition-colors duration-300
            flex items-center justify-center
          "
        >
          <span
            className="
              w-5 h-5
              bg-primary
              transition-colors duration-300
              group-hover:bg-white

            "
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
