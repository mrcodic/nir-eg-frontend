import { getServerData } from "@/helpers/server-fetch";
import AuthNavBar from "./AuthNavBar";
import GuestNavBar from "./GuestNavBar";

const NavbarWrapper = async () => {
  const data = await getServerData({
    queryKey: ["/students/profile"],
    isAuth: true,
  });

  return !!data ? (
    <AuthNavBar key={data?.body?.id} />
  ) : (
    <GuestNavBar key={"guest"} />
  );
};

export default NavbarWrapper;
