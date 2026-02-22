import { getServerData } from "@/helpers/server-fetch";
// import AuthNavBar from "./AuthNavBar";
import GuestNavBar from "./GuestNavBar";
import dynamic from "next/dynamic";
// import ParentPortalNavbar from "./ParentPortalNavbar";

const AuthNavBar = dynamic(() => import("./AuthNavBar"));

const NavbarWrapper = async () => {
  const data = await getServerData({
    queryKey: ["/students/profile"],
    isAuth: true,
  });

  // return <ParentPortalNavbar />;

  return !!data ? (
    <AuthNavBar key={data?.body?.id} />
  ) : (
    <GuestNavBar key={"guest"} />
  );
};

export default NavbarWrapper;
