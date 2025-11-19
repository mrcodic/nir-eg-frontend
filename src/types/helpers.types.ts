export type ICache = "force-cache" | "no-store" | "default";

export interface IGetDataOptions {
  queryKey: readonly unknown[];
  // queryKey: string[];
  next?: { tags?: string[]; revalidate?: number | false | undefined };
  cache?: ICache;
}
