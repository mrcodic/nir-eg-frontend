// src/lib/queryClient.ts
"use client";

import { QueryClient, isServer } from "@tanstack/react-query";
import { isAxiosError } from "axios";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 5000,
        retry: (failureCount, error: any) => {
          if (
            error?.status === 404 ||
            (isAxiosError(error) && error?.response?.status === 404)
          )
            return false;
          return failureCount < 3;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // server: always create a new client
    return makeQueryClient();
  }

  // browser: reuse the same client
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
