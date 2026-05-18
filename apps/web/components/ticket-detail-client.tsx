"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { TicketPriority, TicketRecord, TicketStatus } from "@misconnect/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TicketDetailClientProps {
  ticket: TicketRecord;
  isStaffView: boolean;
  canEdit: boolean;
  canAccept: boolean;
  canReassign: boolean;
}

export function TicketDetailClient({ ticket, isStaffView, canEdit, canAccept, canReassign }: TicketDetailClientProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    department: ticket.department,
    category: ticket.category,
    status: ticket.status,
    assignedTo: ticket.assignedTo ?? "",
  });
  const [reassignEmail, setReassignEmail] = useState(ticket.assignedTo ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshPage() {
    router.refresh();
  }

  async function saveChanges() {
    setBusy("save");
    setMessage(null);
    try {
      const payload = isStaffView
        ? form
        : {
            title: form.title,
            description: form.description,
            priority: form.priority,
            category: form.category,
          };

      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Could not update ticket");
      }
      setMessage("Ticket updated.");
      await refreshPage();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update ticket");
    } finally {
      setBusy(null);
    }
  }

  async function acceptTicket() {
    setBusy("accept");
    setMessage(null);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/accept`, { method: "POST" });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Could not accept ticket");
      }
      setMessage("Ticket accepted.");
      await refreshPage();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not accept ticket");
    } finally {
      setBusy(null);
    }
  }

  async function reassignTicket() {
    setBusy("reassign");
    setMessage(null);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/reassign`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ toEmail: reassignEmail }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Could not reassign ticket");
      }
      setMessage("Ticket reassigned.");
      await refreshPage();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not reassign ticket");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, color: "#94a3b8" }}>
            #{ticket.ticketNumber} | Submitted by {ticket.submittedBy}
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: 28 }}>{ticket.title}</h2>
        </div>
        <Link
          href={isStaffView ? "/admin/tickets" : "/customer"}
          style={{
            borderRadius: 999,
            border: "1px solid rgba(148, 163, 184, 0.28)",
            padding: "10px 14px",
            color: "#cbd5e1",
          }}
        >
          Back to tickets
        </Link>
      </div>

      <section style={panelStyle}>
        <div style={gridStyle}>
          <label style={labelStyle}>
            <span>Title</span>
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} style={inputStyle} disabled={!canEdit} />
          </label>
          <label style={labelStyle}>
            <span>Category</span>
            <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} style={inputStyle} disabled={!canEdit} />
          </label>
          <label style={labelStyle}>
            <span>Priority</span>
            <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as TicketPriority }))} style={inputStyle} disabled={!canEdit}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label style={labelStyle}>
            <span>Department</span>
            <input value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} style={inputStyle} disabled={!isStaffView || !canEdit} />
          </label>
          <label style={labelStyle}>
            <span>Status</span>
            <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TicketStatus }))} style={inputStyle} disabled={!isStaffView || !canEdit}>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
              <option value="urgent">Urgent</option>
              <option value="spam">Spam</option>
            </select>
          </label>
          {isStaffView ? (
            <label style={labelStyle}>
              <span>Assigned to</span>
              <input value={form.assignedTo} onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))} style={inputStyle} disabled={!canEdit} />
            </label>
          ) : null}
        </div>
        <label style={{ ...labelStyle, marginTop: 12 }}>
          <span>Description</span>
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={8} style={{ ...inputStyle, resize: "vertical" }} disabled={!canEdit} />
        </label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <button type="button" onClick={saveChanges} disabled={!canEdit || busy === "save"} style={primaryButton}>
            {busy === "save" ? "Saving..." : "Save changes"}
          </button>
          {canAccept && ticket.status === "pending" ? (
            <button type="button" onClick={acceptTicket} disabled={busy === "accept"} style={secondaryButton}>
              {busy === "accept" ? "Accepting..." : "Accept ticket"}
            </button>
          ) : null}
        </div>
      </section>

      {isStaffView && canReassign ? (
        <section style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Reassign ticket</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input value={reassignEmail} onChange={(event) => setReassignEmail(event.target.value)} placeholder="new.owner@example.com" style={{ ...inputStyle, flex: "1 1 280px" }} />
            <button type="button" onClick={reassignTicket} disabled={busy === "reassign"} style={secondaryButton}>
              {busy === "reassign" ? "Updating..." : "Reassign"}
            </button>
          </div>
        </section>
      ) : null}

      {message ? <p style={{ margin: 0, color: message.endsWith(".") && !message.toLowerCase().includes("could not") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}
    </div>
  );
}

const panelStyle: CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(148, 163, 184, 0.16)",
  background: "rgba(15, 23, 42, 0.46)",
  padding: 16,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: 8,
  color: "#cbd5e1",
};

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(15, 23, 42, 0.82)",
  color: "#eff6ff",
  padding: "10px 12px",
};

const primaryButton: CSSProperties = {
  border: 0,
  borderRadius: 10,
  background: "linear-gradient(135deg, #2563eb, #0f766e)",
  color: "white",
  padding: "10px 12px",
  cursor: "pointer",
};

const secondaryButton: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: 10,
  background: "rgba(15, 23, 42, 0.9)",
  color: "#e2e8f0",
  padding: "10px 12px",
  cursor: "pointer",
};
