import { useAuthContext } from "@/context/auth-context";
import { useModal } from "@/context/ModalProvider";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StudentSelectCenter } from "../modals/StudentSelectCenter";

function LinkStyled({ href, title }: { href: string; title: string }) {
  const modal = useModal();
  const pathname = usePathname();
  const { profile } = useAuthContext();

  const isActive = href.substring(0, 6) === pathname.substring(0, 6);

  function center(e, x) {
    if (!x) return;
    //  if back returns "false"
    if (x && profile?.has_center == false) {
      modal.setDialogContent(<StudentSelectCenter />);
      modal.openModal();
    }
  }

  console.log(isActive, href, pathname);

  return (
    <Link
      href={href}
      onClick={(e) => center(e, isActive)}
      className={`relative px-3 h-11 flex flex-col items-center justify-center rounded-[10px] font-bold ${
        isActive ? " text-black" : " text-gray-dark"
      }   `}
    >
      {title}

      {isActive && (
        <motion.div
          className=" h-1 bg-secondary  origin-right w-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.5 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </Link>
  );
}

export default LinkStyled;
