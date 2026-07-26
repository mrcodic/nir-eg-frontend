"use client";

import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { createContext, useContext, useMemo, useState } from "react";

interface AuthContextType {
  token: string;
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

export const AuthContextProvider = ({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: IUser | null;
}) => {
  const [token, setToken] = useState<undefined | string | null>(
    () => Cookies.get("nir_token") || undefined,
  );

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/students/profile"],
    queryFn: async () => {
      const res = await getClientPrivateData({
        queryKey: ["/students/profile"],
      });
      // console.log("res profile", res);
      return (res.body || null) as unknown as IUser | null;
    },
    staleTime: 1000 * 60 * 2, //2 minutes cache
    initialData: profile || null,
  });

  const value = useMemo(
    () => ({
      token: token,
      setToken,
      profile: profileData,
      isLoading,
      grade: profileData?.grade && {
        id: profileData?.grade,
        name: profileData?.grade_name,
      },
    }),
    [token, profileData, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
