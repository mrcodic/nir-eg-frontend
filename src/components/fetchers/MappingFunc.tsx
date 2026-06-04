/* eslint-disable react-hooks/error-boundaries */
import Empty from "@/components/shared/Empty";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import { IGetDataOptions } from "@/types/helpers.types";
import get from "lodash/get";
import { isDynamicServerError } from "next/dist/client/components/hooks-server-context";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ComponentProps, ReactNode } from "react";
import "server-only";

type EmptyProps = ComponentProps<typeof Empty>;

const MappingFun = async ({
  queryKey,
  render,
  arraypath,
  errorComponent,
  emptyComponent,
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
  emptyComponent?: ReactNode;
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
      fetchedData = await getServerData({
        queryKey: [queryKey],
        ...endPointOptions,
      });
      // fetchedData = await getServerData({ queryKey: [queryKey], ...endPointOptions });
    } else {
      fetchedData = await getServerData({
        queryKey: [queryKey],
        ...endPointOptions,
        isAuth: false,
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
        : emptyComponent || <Empty {...emptyProps} />;

    return <>{fetchedData && render(fetchedData)}</>;
  } catch (e) {
    if (isRedirectError(e) || isDynamicServerError(e)) throw e;

    return returnEmptyState
      ? null
      : errorComponent || (
          <Empty
            {...errorProps}
            text={errorProps?.text || "حدث خطاء ما اثناء عرض البيانات "}
          />
        );
  }
};

export default MappingFun;
