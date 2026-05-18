import { listManagedRoles } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { RolesAdminClient } from "@/components/roles-admin-client";
import { requireSession } from "@/lib/session";

export default async function AdminRolesPage() {
  const user = await requireSession();
  const roles = await listManagedRoles(user);

  return (
    <DataCard title="Roles">
      <RolesAdminClient initialRoles={roles} />
    </DataCard>
  );
}
