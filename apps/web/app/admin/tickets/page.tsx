import { getMyPermissions, listVisibleTickets } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { TicketsClient } from "@/components/tickets-client";
import { requireSession } from "@/lib/session";

export default async function AdminTicketsPage() {
  const user = await requireSession();
  const [permissions, tickets] = await Promise.all([getMyPermissions(user), listVisibleTickets(user)]);

  return (
    <DataCard title="Tickets">
      <p style={{ color: "#cbd5e1" }}>Tickets are filtered on the server before they reach this view.</p>
      <TicketsClient
        initialTickets={tickets}
        canAccept={permissions.includes("accept_tickets")}
        canReassign={permissions.includes("reassign_tickets")}
        isStaffView
      />
    </DataCard>
  );
}
