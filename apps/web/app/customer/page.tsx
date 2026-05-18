import { requireSession } from "@/lib/session";
import { listVisibleTickets } from "@misconnect/api";
import { DataCard } from "@/components/data-card";
import { TicketsClient } from "@/components/tickets-client";

export default async function CustomerPage() {
  const user = await requireSession();
  const tickets = await listVisibleTickets(user);

  return (
    <DataCard title="Your migrated tickets">
      <p style={{ color: "#cbd5e1" }}>
        {tickets.length} ticket(s) are currently visible through the new API layer for {user.email}.
      </p>
      <TicketsClient initialTickets={tickets} canAccept={false} canReassign={false} isStaffView={false} />
    </DataCard>
  );
}
