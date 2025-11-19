"use client";

import AuthContext from "@/context/auth-context";
import { useContext } from "react";
import AuthNavBar from "./AuthNavBar";
import GuestNavBar from "./GuestNavBar";

const NavbarWrapper = () => {
  const { token } = useContext(AuthContext);

  return token ? <AuthNavBar /> : <GuestNavBar />;
};

export default NavbarWrapper;
