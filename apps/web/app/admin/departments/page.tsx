import { listManagedDepartments } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { DepartmentsAdminClient } from "@/components/departments-admin-client";
import { requireSession } from "@/lib/session";

export default async function AdminDepartmentsPage() {
  const user = await requireSession();
  const departments = await listManagedDepartments(user);

  return (
    <DataCard title="Departments">
      <DepartmentsAdminClient initialDepartments={departments} />
    </DataCard>
  );
}
