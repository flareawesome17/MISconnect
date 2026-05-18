import { requireSession } from "@/lib/session";
import { isStaffRole } from "@misconnect/api";
import { getMyPermissions, listVisibleTickets } from "@misconnect/api";
import { redirect } from "next/navigation";
import type { TicketRecord } from "@misconnect/shared";
import { DataCard } from "@/components/data-card";

export default async function AdminPage() {
  const user = await requireSession();
  if (!isStaffRole(user.role)) {
    redirect("/customer");
  }

  const [permissions, tickets] = await Promise.all([getMyPermissions(user), listVisibleTickets(user)]);

  return (
    <>
      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: 16 }}>
        <StatCard label="Visible tickets" value={tickets.length} />
        <StatCard label="Pending" value={tickets.filter((ticket: TicketRecord) => ticket.status === "pending").length} />
        <StatCard label="In progress" value={tickets.filter((ticket: TicketRecord) => ticket.status === "in-progress").length} />
        <StatCard label="Completed" value={tickets.filter((ticket: TicketRecord) => ticket.status === "completed").length} />
      </section>
      <DataCard title="API-first rollout status">
        <p style={{ color: "#cbd5e1" }}>
          This dashboard is resolving session and permissions on the server. The navigation now exposes the first migrated staff views for tickets, users, roles, departments, and notifications.
        </p>
        <p style={{ color: "#94a3b8", marginBottom: 0 }}>
          Active permission set: {permissions.join(", ") || "none"}
        </p>
      </DataCard>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <p style={{ margin: 0, color: "#94a3b8" }}>{label}</p>
      <p style={{ margin: "10px 0 0", fontSize: 36, fontWeight: 800 }}>{value}</p>
    </div>
  );
}
