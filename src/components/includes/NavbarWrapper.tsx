import { getTenantSummaryServer } from "@/services/tenant.service";
import { IUser } from "@/types";
import { Templates } from "@/types/tenant.types";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import GuestNavBar from "./GuestNavBar";
import SummaryNavbar from "./SummaryNavbar";

const AuthNavBar = dynamic(() => import("./AuthNavBar"));

const NavbarWrapper = async ({
  profile,
  template,
}: {
  profile: IUser | null;
  template: Templates;
}) => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  if (pathname.startsWith("/parent-portal") || pathname.startsWith("/short"))
    return null;

  if (template === Templates.SUMMARY_LANDING) {
    const summary = await getTenantSummaryServer();

    return <SummaryNavbar summaryData={summary?.data} />;
  }

  return !!profile ? (
    <AuthNavBar key={profile?.id} profile={profile} />
  ) : (
    <GuestNavBar key={"guest"} />
  );
};

export default NavbarWrapper;
