import { listMyNotifications } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { NotificationsClient } from "@/components/notifications-client";
import { requireSession } from "@/lib/session";

export default async function AdminNotificationsPage() {
  const user = await requireSession();
  const notifications = await listMyNotifications(user);

  return (
    <DataCard title="Notifications">
      <NotificationsClient initialNotifications={notifications} />
    </DataCard>
  );
}
