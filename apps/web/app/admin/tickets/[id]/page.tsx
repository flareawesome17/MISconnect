import { getMyPermissions, getVisibleTicket } from "@misconnect/api";
import { notFound } from "next/navigation";
import { DataCard } from "@/components/data-card";
import { TicketDetailClient } from "@/components/ticket-detail-client";
import { requireSession } from "@/lib/session";

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSession();
  const { id } = await params;
  const [permissions, ticket] = await Promise.all([getMyPermissions(user), getVisibleTicket(user, id)]);

  if (!ticket) {
    notFound();
  }

  return (
    <DataCard title="Ticket detail">
      <TicketDetailClient
        ticket={ticket}
        isStaffView
        canEdit={permissions.includes("edit_tickets")}
        canAccept={permissions.includes("accept_tickets")}
        canReassign={permissions.includes("reassign_tickets")}
      />
    </DataCard>
  );
}
