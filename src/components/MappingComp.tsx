"use client";

import { useAuthContext } from "@/context/auth-context";
import { getDataClient, getGuestData } from "@/utils/clientFun";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import Empty from "./Empty";
import LoadingSpinner from "./Loading";

type Props = {
  queryKey: string | QueryKey;
  render: (data: any) => React.ReactNode;
  enable?: boolean;
  showEmpty?: boolean;
  emptyProps?: ComponentProps<typeof Empty>;
};

function MappingCompInner({
  queryKey,
  render,
  enable = true,
  showEmpty = false,
  emptyProps,
}: Props) {
  const { token } = useAuthContext();

  const { data, error } = useQuery({
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, token ? "authenticated" : "guest"]
      : [queryKey, token ? "authenticated" : "guest"],
    queryFn: token ? getDataClient : getGuestData,
    enabled: enable,
  });

  if (error) {
    console.error("Query error:", error);
    return <p>Error loading data</p>;
  }

  if (!data && showEmpty) {
    return <Empty text="لا يوجد محتوى بعد" {...emptyProps} />;
  }

  return <>{data && render(data)}</>;
}

// Outer component with Suspense boundary
const MappingComp = ({
  queryKey,
  render,
  enable = true,
  showEmpty = false,
  emptyProps,
}: Props) => {
  const { token } = useAuthContext();
  const { data, error, isLoading } = useQuery({
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, token ? "authenticated" : "guest"]
      : [queryKey, token ? "authenticated" : "guest"],
    queryFn: token ? getDataClient : getGuestData,
    enabled: enable,
  });

  const authLoading = typeof token === "undefined";

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error("Query error:", error);
    return <p>Error loading data</p>;
  }

  if (!data && showEmpty) {
    return <Empty text="لا يوجد محتوى بعد" {...emptyProps} />;
  }

  return <>{data && render(data)}</>;
};

export default MappingComp;
