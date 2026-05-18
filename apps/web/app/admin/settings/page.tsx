import { getManagedSettings } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { SettingsClient } from "@/components/settings-client";
import { requireSession } from "@/lib/session";

export default async function AdminSettingsPage() {
  const user = await requireSession();
  const settings = await getManagedSettings(user);

  return (
    <DataCard title="Settings">
      <SettingsClient initialSettings={settings} />
    </DataCard>
  );
}
