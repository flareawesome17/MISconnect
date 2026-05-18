"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { TicketRecord } from "@misconnect/shared";
import { useState } from "react";

interface TicketsClientProps {
  initialTickets: TicketRecord[];
  canAccept: boolean;
  canReassign: boolean;
  isStaffView: boolean;
}

export function TicketsClient({ initialTickets, canAccept, canReassign, isStaffView }: TicketsClientProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reassignTarget, setReassignTarget] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function refreshTickets() {
    const response = await fetch("/api/tickets", { cache: "no-store" });
    const payload = (await response.json()) as { tickets?: TicketRecord[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to load tickets");
    }
    setTickets(payload.tickets ?? []);
  }

  async function acceptTicket(ticketId: string) {
    setBusyId(ticketId);
    setError(null);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/accept`, { method: "POST" });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Accept failed");
      }
      await refreshTickets();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Accept failed");
    } finally {
      setBusyId(null);
    }
  }

  async function reassignTicket(ticketId: string) {
    const toEmail = reassignTarget[ticketId]?.trim();
    if (!toEmail) {
      setError("Enter an email to reassign.");
      return;
    }

    setBusyId(ticketId);
    setError(null);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/reassign`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ toEmail }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Reassign failed");
      }
      await refreshTickets();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Reassign failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {error ? <p style={{ margin: 0, color: "#fca5a5" }}>{error}</p> : null}
      {tickets.map((ticket) => (
        <article
          key={ticket.id}
          style={{
            borderRadius: 16,
            border: "1px solid rgba(148, 163, 184, 0.16)",
            background: "rgba(15, 23, 42, 0.46)",
            padding: 16,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: "0 0 6px" }}>{ticket.title}</h3>
              <p style={{ margin: "0 0 8px", color: "#94a3b8" }}>
                #{ticket.ticketNumber} | {ticket.department} | {ticket.priority} | {ticket.status}
              </p>
              <p style={{ margin: 0, color: "#cbd5e1" }}>{ticket.description}</p>
              <Link
                href={isStaffView ? `/admin/tickets/${ticket.id}` : `/customer/tickets/${ticket.id}`}
                style={{ display: "inline-block", marginTop: 10, color: "#7dd3fc" }}
              >
                Open details
              </Link>
            </div>
            <div style={{ minWidth: 220 }}>
              <p style={{ margin: "0 0 8px", color: "#cbd5e1" }}>
                Submitted by {ticket.submittedBy}
                {ticket.assignedTo ? ` | Assigned to ${ticket.assignedTo}` : ""}
              </p>
              {isStaffView && canAccept && ticket.status === "pending" ? (
                <button type="button" onClick={() => acceptTicket(ticket.id)} disabled={busyId === ticket.id} style={actionButton}>
                  {busyId === ticket.id ? "Accepting..." : "Accept ticket"}
                </button>
              ) : null}
              {isStaffView && canReassign ? (
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  <input
                    value={reassignTarget[ticket.id] ?? ""}
                    onChange={(event) =>
                      setReassignTarget((current) => ({ ...current, [ticket.id]: event.target.value }))
                    }
                    placeholder="new.owner@example.com"
                    style={inputStyle}
                  />
                  <button type="button" onClick={() => reassignTicket(ticket.id)} disabled={busyId === ticket.id} style={secondaryButton}>
                    {busyId === ticket.id ? "Updating..." : "Reassign"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      ))}
      {tickets.length === 0 ? <p style={{ margin: 0, color: "#94a3b8" }}>No tickets found.</p> : null}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(15, 23, 42, 0.8)",
  color: "#eff6ff",
  padding: "10px 12px",
};

const actionButton: CSSProperties = {
  border: 0,
  borderRadius: 10,
  background: "linear-gradient(135deg, #2563eb, #0f766e)",
  color: "white",
  padding: "10px 12px",
  cursor: "pointer",
  width: "100%",
};

const secondaryButton: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: 10,
  background: "rgba(15, 23, 42, 0.9)",
  color: "#e2e8f0",
  padding: "10px 12px",
  cursor: "pointer",
};
