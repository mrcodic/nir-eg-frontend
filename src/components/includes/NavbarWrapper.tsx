// import AuthNavBar from "./AuthNavBar";
import { IUser } from "@/types";
import dynamic from "next/dynamic";
import GuestNavBar from "./GuestNavBar";
// import ParentPortalNavbar from "./ParentPortalNavbar";

const AuthNavBar = dynamic(() => import("./AuthNavBar"));

const NavbarWrapper = async ({ profile }: { profile: IUser | null }) => {
  // return <ParentPortalNavbar />;

  return !!profile ? (
    <AuthNavBar key={profile?.id} />
  ) : (
    <GuestNavBar key={"guest"} />
  );
};

export default NavbarWrapper;
