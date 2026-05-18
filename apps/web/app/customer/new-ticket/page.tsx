import { CreateTicketForm } from "@/components/create-ticket-form";
import { DataCard } from "@/components/data-card";

export default function NewTicketPage() {
  return (
    <DataCard title="Create a new ticket">
      <p style={{ color: "#cbd5e1" }}>This request form writes through the new Next.js API layer instead of direct Firestore client CRUD.</p>
      <CreateTicketForm />
    </DataCard>
  );
}
