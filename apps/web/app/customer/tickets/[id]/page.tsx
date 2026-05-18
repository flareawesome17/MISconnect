import { getVisibleTicket } from "@misconnect/api";
import { notFound } from "next/navigation";
import { DataCard } from "@/components/data-card";
import { TicketDetailClient } from "@/components/ticket-detail-client";
import { requireSession } from "@/lib/session";

export default async function CustomerTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireSession();
  const { id } = await params;
  const ticket = await getVisibleTicket(user, id);

  if (!ticket) {
    notFound();
  }

  return (
    <DataCard title="Ticket detail">
      <TicketDetailClient ticket={ticket} isStaffView={false} canEdit canAccept={false} canReassign={false} />
    </DataCard>
  );
}
