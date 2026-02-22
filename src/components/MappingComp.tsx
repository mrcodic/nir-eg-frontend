"use client";

import { useAuthContext } from "@/context/auth-context";
import { getClientPrivateData, getClientData } from "@/helpers/client-fetch";
import {
  QueryKey,
  UndefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";
import { ComponentProps } from "react";
import Empty from "./Empty";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  queryKey: string | QueryKey;
  render: (data: any, isPlaceholderData?: boolean) => React.ReactNode;
  enable?: boolean;
  showEmpty?: boolean;
  emptyProps?: ComponentProps<typeof Empty>;
  errorProps?: ComponentProps<typeof Empty>;
  customLoading?: ((data?: any) => React.ReactNode) | React.ReactNode;
  // remove querykey and query function
  queryOptions?: Omit<
    UndefinedInitialDataOptions<any, Error, any, readonly unknown[]>,
    "queryKey" | "queryFn"
  >;
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
  queryOptions,
}: Props) => {
  const { token } = useAuthContext();
  const { data, error, isLoading, isPlaceholderData } = useQuery({
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, token ? "authenticated" : "guest"]
      : [queryKey, token ? "authenticated" : "guest"],
    queryFn: token ? getClientPrivateData : getClientData,
    enabled: enable,
    ...queryOptions,
  });

  const authLoading = typeof token === "undefined";

  if (authLoading || isLoading) {
    return typeof customLoading === "function"
      ? customLoading(data)
      : customLoading || <LoadingSpinner />;
  }

  if (error) {
    console.error("Query error:", error);
    return <Empty isError {...errorProps} />;
  }

  if (!data && showEmpty) {
    return <Empty text="لا يوجد محتوى بعد" {...emptyProps} />;
  }

  return <>{data && render(data, isPlaceholderData)}</>;
};

export default MappingComp;
