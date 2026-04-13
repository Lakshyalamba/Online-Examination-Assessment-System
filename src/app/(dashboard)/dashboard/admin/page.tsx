import { RoleDashboardEntry } from "@/modules/auth/components/role-dashboard-entry";

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    denied?: string;
    from?: string;
  }>;
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams;

  return (
    <RoleDashboardEntry
      role="ADMIN"
      title="Admin dashboard access is enforced."
      description="This route now acts as the protected Admin landing target. Operational content and role navigation expand in the next step."
      denied={params?.denied}
      from={params?.from}
      handoff={[
        "Protected route reserved for Admin-only navigation",
        "Role-aware redirect target for authenticated Admin users",
        "Step 6 will replace this with the shared Admin entry scaffold",
      ]}
    />
  );
}
