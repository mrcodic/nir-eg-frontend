import { Animate } from "@/components/shared/Animate";
import PaginationServer from "@/components/shared/PaginationServer";
import { getServerData } from "@/helpers/fetchers/server-fetch";
import { cn } from "@/lib/utils";
import RoomHeader from "@/modules/rooms/components/RoomHeader";
import { Bundle, IUser } from "@/types";
import BundleCard from "./BundleCard";

const ITEMS_PER_PAGE = 1;

const BundlesWrapper = async ({
  profile,
  searchParams,
}: {
  profile: IUser | null;
  searchParams: Promise<{ grade?: string; bundlesPage?: string }>;
}) => {
  const params = await searchParams;

  let api = "";

  if (profile) {
    api = "/students/bundles";
  } else {
    api = `/guest/bundels?grade_id=${params?.grade || 1}`;
  }

  const bundlesData = await getServerData({
    queryKey: [api],
    isAuth: !!profile,
  });

  const bundles = profile
    ? (bundlesData?.body as { budles: Bundle[] })?.budles
    : (bundlesData?.body as Bundle[]);

  if (!bundles?.length) return null;

  const page = Number(params?.bundlesPage) || 1;
  const pageSize = ITEMS_PER_PAGE || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedBundles = bundles?.slice(startIndex, endIndex);

  const isMultiGrid = bundles?.length > 1 && ITEMS_PER_PAGE > 1;

  console.log("bundles data :", bundlesData);

  return (
    <div className="wrapper">
      <RoomHeader
        className="mb-6 items-start"
        title="الباقات"
        icon="/assets/books-colored.svg"
        subText="أحدث الباقات المضافة"
      />

      <Animate
        as="div"
        className={cn("mt-8 grid gap-6", {
          "xl:grid-cols-2 xl:gap-10": isMultiGrid,
        })}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {paginatedBundles?.map((bundle, index) => {
          return (
            <Animate key={bundle.id} isChild preset="slideUp">
              <BundleCard bundle={bundle} isMultiGrid={isMultiGrid} />
            </Animate>
          );
        })}
      </Animate>

      {bundles?.length > ITEMS_PER_PAGE && (
        <PaginationServer
          className="w-full"
          currentPage={params?.bundlesPage ? Number(params?.bundlesPage) : 1}
          total={bundles.length}
          searchParams={params}
          pageSize={ITEMS_PER_PAGE}
          pageKey="bundlesPage"
        />
      )}
    </div>
  );
};

export default BundlesWrapper;
