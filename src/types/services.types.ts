export type ICache = "force-cache" | "no-store" | "default";

export interface IGetDataOptions {
  queryKey: readonly unknown[];
  next?: { tags?: string[]; revalidate?: number | false | undefined };
  cache?: ICache;
  authenticated?: boolean;
}
