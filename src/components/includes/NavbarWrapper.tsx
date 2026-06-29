import { IUser } from "@/types";
import dynamic from "next/dynamic";
import GuestNavBar from "./GuestNavBar";

const AuthNavBar = dynamic(() => import("./AuthNavBar"));

const NavbarWrapper = async ({ profile }: { profile: IUser | null }) => {
  return !!profile ? (
    <AuthNavBar key={profile?.id} profile={profile} />
  ) : (
    <GuestNavBar key={"guest"} />
  );
};

export default NavbarWrapper;
