"use client";

import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData, getClientData } from "@/helpers/client-fetch";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import Empty from "./Empty";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  queryKey: string | QueryKey;
  render: (data: any) => React.ReactNode;
  enable?: boolean;
  showEmpty?: boolean;
  emptyProps?: ComponentProps<typeof Empty>;
  errorProps?: ComponentProps<typeof Empty>;
  customLoading?: React.ReactNode;
};

// Outer component with Suspense boundary
const MappingComp = ({
  queryKey,
  render,
  enable = true,
  showEmpty = false,
  emptyProps,
  errorProps,
  customLoading,
}: Props) => {
  const { token, isLoading: authLoading } = useAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, token ? "authenticated" : "guest"]
      : [queryKey, token ? "authenticated" : "guest"],
    queryFn: token ? getClientPrivateData : getClientData,
    enabled: enable,
  });

  // const authLoading = typeof token === "undefined";

  if (authLoading || isLoading) {
    return customLoading || <LoadingSpinner />;
  }

  if (error) {
    console.error("Query error:", error);
    return <Empty isError {...errorProps} />;
  }

  if (!data && showEmpty) {
    return <Empty text="لا يوجد محتوى بعد" {...emptyProps} />;
  }

  return <>{data && render(data)}</>;
};

export default MappingComp;
