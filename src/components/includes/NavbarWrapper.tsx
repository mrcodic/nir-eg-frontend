import { getServerData } from "@/helpers/server-fetch";
import AuthNavBar from "./AuthNavBar";
import GuestNavBar from "./GuestNavBar";

const NavbarWrapper = async () => {
  const data = await getServerData({
    queryKey: ["students/profile"],
    isAuth: true,
  });

  return !!data ? <AuthNavBar /> : <GuestNavBar />;
};

export default NavbarWrapper;
