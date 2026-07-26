"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const QueryProvider = ({ children }: Props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            staleTime: 1000 * 60,
            retry: (failureCount, error: unknown) => {
              if (
                (typeof error === "object" &&
                  error !== null &&
                  "status" in error &&
                  (error.status === 404 || error.status === 429)) ||
                (isAxiosError(error) &&
                  (error.response?.status === 404 ||
                    error.response?.status === 429))
              )
                return false;
              return failureCount < 3;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
