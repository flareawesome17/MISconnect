import { listManagedPasswords } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { PasswordsAdminClient } from "@/components/passwords-admin-client";
import { requireSession } from "@/lib/session";

export default async function AdminPasswordsPage() {
  const user = await requireSession();
  const passwords = await listManagedPasswords(user);

  return (
    <DataCard title="Password Manager">
      <PasswordsAdminClient initialPasswords={passwords} />
    </DataCard>
  );
}
