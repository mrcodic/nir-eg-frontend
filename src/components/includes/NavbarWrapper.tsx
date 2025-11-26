"use client";

import { useAuthContext } from "@/context/auth-context";
import AuthNavBar from "./AuthNavBar";
import GuestNavBar from "./GuestNavBar";

const NavbarWrapper = () => {
  const { profile } = useAuthContext();

  return !!profile ? <AuthNavBar /> : <GuestNavBar />;
};

export default NavbarWrapper;
