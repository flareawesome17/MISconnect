import { listAssignableRoles, listManagedUsers } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { UsersAdminClient } from "@/components/users-admin-client";
import { requireSession } from "@/lib/session";

export default async function AdminUsersPage() {
  const user = await requireSession();
  const [users, roles] = await Promise.all([listManagedUsers(user), listAssignableRoles(user)]);

  return (
    <DataCard title="Users">
      <UsersAdminClient initialUsers={users} roles={roles} />
    </DataCard>
  );
}
