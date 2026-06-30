"use client";

import { getClientPrivateData } from "@/helpers/fetchers/client-fetch";
import { IUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { createContext, useContext, useMemo, useState } from "react";

interface AuthContextType {
  token: string | null | undefined;
  isLoading: boolean;
  setToken: (token: string | null | undefined) => void;
  profile: IUser | null;
  grade: { id: number; name: string } | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
  enableProfileQuery = true,
}: {
  children: React.ReactNode;
  profile: IUser | null;
  enableProfileQuery?: boolean;
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
      return res.body as unknown as IUser;
    },
    enabled: enableProfileQuery,
    staleTime: 1000 * 60 * 10, //10 minutes cache
    initialData: profile,
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
