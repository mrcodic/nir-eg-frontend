import { redirect } from "next/navigation";
import BuildProgress from "./BuildingProgress";

async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{ timestamp?: string; tenant_id?: string }>;
}) {
  const { tenant_id } = await searchParams;

  if (!tenant_id) redirect("/");

  return <BuildProgress tenantId={tenant_id} />;
}

export default ResultPage;
