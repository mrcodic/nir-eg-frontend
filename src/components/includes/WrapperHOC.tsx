"use client";

import { getClientPrivateData, getClientData } from "@/helpers/client-fetch";
import { useQuery } from "@tanstack/react-query";

type ChildrenArgs = {
  data: any;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
};

type WrapperHOCProps = {
  children: (args: ChildrenArgs) => React.ReactNode;
  queryKey: (string | number)[];
  isAuth?: boolean;
};

export default function WrapperHOC({
  children,
  queryKey,
  isAuth,
}: WrapperHOCProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: isAuth ? getClientPrivateData : getClientData,
  });

  return <>{children({ data, isLoading, error, refetch })}</>;
}
