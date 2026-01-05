// types/tenant-progress.ts
export type StepStatus = "pending" | "running" | "done" | "failed";

export type StepName = "create_db" | "finalize" | "migrate" | "owner";

export type TenantProgress = {
  tenant_id: string;
  exists: boolean;
  status: "building" | "ready" | "failed";
  percent: number;
  steps: Record<
    StepName,
    {
      status: StepStatus;
      started_at?: string;
      finished_at?: string;
      skipped?: boolean;
      reason?: string;
    }
  >;
  last_error: string | null;
  domains?: {
    public: string;
    admin: string;
  };
};
