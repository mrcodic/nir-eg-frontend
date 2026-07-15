import { IUser } from "@/types";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import GuestNavBar from "./GuestNavBar";

const AuthNavBar = dynamic(() => import("./AuthNavBar"));

const NavbarWrapper = async ({ profile }: { profile: IUser | null }) => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  if (pathname.startsWith("/parent-portal") || pathname.startsWith("/short"))
    return null;

  return !!profile ? (
    <AuthNavBar key={profile?.id} profile={profile} />
  ) : (
    <GuestNavBar key={"guest"} />
  );
};

export default NavbarWrapper;
