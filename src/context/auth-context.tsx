"use client";

import { IUser } from "@/types";
import { getDataClient } from "@/utils/clientFun";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string;
  login: (token: string) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  setToken: (token: string) => void;
  profile: IUser | null;
  grade: string;
  storeGrade: (grade: string) => void;
  deleteGrade: () => void;
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
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGrade = localStorage.getItem("grade");
      if (storedGrade) {
        setGrade(storedGrade);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && grade !== "") {
      localStorage.setItem("grade", grade);
    }
  }, [grade]);

  const [token, setToken] = useState<undefined | string | null>(
    Cookies.get("auth_token") || undefined
  );

  const { data: profileData, isLoading } = useQuery({
    queryFn: getDataClient as () => Promise<{ body: IUser }>,
    queryKey: ["/students/profile"],
  });

  useEffect(() => {
    const tokenCookie = Cookies.get("auth_token");
    if (!tokenCookie) {
      setToken(null);
    } else {
      setToken(tokenCookie);
    }
  }, []);

  const login = (token) => {
    setToken(token);
  };

  const logout = async () => {
    setToken(null);
    localStorage.removeItem("timer");
    Cookies.remove("auth_token");
    Cookies.remove("guest_token");
  };

  const storeGrade = (grade) => {
    setGrade(grade);
    localStorage.setItem("grade", grade);
  };

  const deleteGrade = () => {
    localStorage.removeItem("grade");
    setGrade("");
  };

  return (
    <AuthContext.Provider
      value={{
        login: login,
        logout: logout,
        token: token,
        setToken,
        profile: profileData?.body,
        isLoading,
        grade: grade,
        storeGrade: storeGrade,
        deleteGrade: deleteGrade,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
