import { RoleDashboardEntry } from "@/modules/auth/components/role-dashboard-entry";

type ExaminerDashboardPageProps = {
  searchParams?: Promise<{
    denied?: string;
    from?: string;
  }>;
};

export default async function ExaminerDashboardPage({
  searchParams,
}: ExaminerDashboardPageProps) {
  const params = await searchParams;

  return (
    <RoleDashboardEntry
      role="EXAMINER"
      title="Examiner dashboard access is enforced."
      description="This route is now the protected Examiner landing target for role-aware redirects, with richer entry content arriving in Step 6."
      denied={params?.denied}
      from={params?.from}
      handoff={[
        "Protected route reserved for Examiner-only access",
        "Direct login redirect target for authenticated Examiner users",
        "Step 6 will add the shared Examiner dashboard scaffold",
      ]}
    />
  );
}
