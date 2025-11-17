import Image from "next/image";

const links = [
  {
    name: "Facebook",
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

function SocialLinks() {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      {links.map((link) => (
        <a
          href={link.href}
          key={link.name}
          className="size-8 bg-white rounded-lg p-1"
        >
          <Image src={link.src} width="24" height="24" alt={link.name} />
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
