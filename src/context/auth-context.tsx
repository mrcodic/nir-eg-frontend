"use client";

import { getClientPrivateData } from "@/helpers/client-fetch";
import { IUser } from "@/types";
import { deleteCookie } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { createContext, useCallback, useContext, useState } from "react";

interface AuthContextType {
  token: string;
  logout: () => Promise<void>;
  isLoading: boolean;
  setToken: (token: string) => void;
  profile: IUser | null;
  grade: { id: number; name: string } | undefined;
}

const AuthContext = createContext<AuthContextType>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState<undefined | string | null>(
    () => Cookies.get("nir_token") || undefined,
  );

  const { data: profileData, isLoading } = useQuery({
    queryFn: getClientPrivateData as () => Promise<{ body: IUser }>,
    queryKey: ["/students/profile"],
    staleTime: 1000 * 60 * 20,
  });

  // useEffect(() => {
  //   const savedToken = Cookies.get("nir_token");
  //   setToken(savedToken || null);
  // }, []);

  const logout = useCallback(async () => {
    setToken(null);
    localStorage.removeItem("timer");
    Cookies.remove("guest_token");
    Cookies.remove("nir_token");
    await deleteCookie("nir_token");
  }, []);

  console.log("profile -> ", profileData?.body);

  return (
    <AuthContext.Provider
      value={{
        logout: logout,
        token: token,
        setToken,
        profile: profileData?.body,
        isLoading,
        grade: profileData?.body?.grade && {
          id: profileData?.body?.grade,
          name: profileData?.body?.grade_name,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
