import { getPublicData } from "@/helpers/client-fetch";
import { getServerPrivateData } from "@/helpers/server-fetch";
import CustomError from "@/lib/customError";
import { IGetDataOptions } from "@/types/helpers.types";
import get from "lodash/get";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ComponentProps, ReactNode } from "react";
import Empty from "./Empty";

type EmptyProps = ComponentProps<typeof Empty>;

const MappingFun = async ({
  queryKey,
  render,
  arraypath,
  errorComponent,
  emptyProps,
  errorProps,
  returnEmptyState = false,
  requireAuth = true,
  endPointOptions,
}: {
  queryKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: (data: any) => ReactNode;
  arraypath: string;
  errorComponent?: ReactNode;
  emptyProps?: EmptyProps;
  errorProps?: EmptyProps;
  returnEmptyState?: boolean;
  requireAuth?: boolean;
  endPointOptions?: Partial<IGetDataOptions>;
}) => {
  try {
    let fetchedData;

    // console.log("🚀 ~ MappingFun ~ queryKey:", queryKey);

    if (requireAuth) {
      fetchedData = await getServerPrivateData({
        queryKey: [queryKey],
        ...endPointOptions,
      });
      // fetchedData = await getData({ queryKey: [queryKey], ...endPointOptions });
    } else {
      fetchedData = await getPublicData({
        queryKey: [queryKey],
        ...endPointOptions,
      });
    }

    // console.log("🚀 ~ MappingFun ~ data:", queryKey, fetchedData);

    const targetArray = get(fetchedData, arraypath, []);

    if (
      !fetchedData ||
      (Array.isArray(targetArray) && !targetArray.length) ||
      !targetArray
    )
      return returnEmptyState
        ? null
        : errorComponent || <Empty {...emptyProps} />;

    return <>{fetchedData && render(fetchedData)}</>;
  } catch (e) {
    if (isRedirectError(e) || isDynamicServerError(e)) throw e;

    console.log("🚀 ~ MappingFun ~ error: ", queryKey, e);

    if (e instanceof CustomError) {
      if (e.statusCode === 404) {
        return returnEmptyState
          ? null
          : errorComponent || <Empty {...emptyProps} />;
      }
    }

    return returnEmptyState
      ? null
      : errorComponent || <Empty {...errorProps} />;
  }
};

export default MappingFun;
