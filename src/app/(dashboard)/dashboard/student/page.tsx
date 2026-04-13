import { RoleDashboardEntry } from "@/modules/auth/components/role-dashboard-entry";

type StudentDashboardPageProps = {
  searchParams?: Promise<{
    denied?: string;
    from?: string;
  }>;
};

export default async function StudentDashboardPage({
  searchParams,
}: StudentDashboardPageProps) {
  const params = await searchParams;

  return (
    <RoleDashboardEntry
      role="STUDENT"
      title="Student dashboard access is enforced."
      description="This route is now the protected Student landing target for authenticated users, while the real Student dashboard scaffold arrives in Step 6."
      denied={params?.denied}
      from={params?.from}
      handoff={[
        "Protected route reserved for Student-only access",
        "Direct login redirect target for authenticated Student users",
        "Step 6 will add the shared Student dashboard scaffold",
      ]}
    />
  );
}
