"use client";

import type { CSSProperties } from "react";
import type { KpmReportRecord } from "@misconnect/shared";
import { useState } from "react";

export function ReportsClient({ initialReport }: { initialReport: KpmReportRecord }) {
  const [report, setReport] = useState(initialReport);
  const [startDate, setStartDate] = useState(initialReport.filters.startDate ?? "");
  const [endDate, setEndDate] = useState(initialReport.filters.endDate ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadReport() {
    setLoading(true);
    setMessage(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const response = await fetch(`/api/reports/kpm?${params.toString()}`, { cache: "no-store" });
      const payload = (await response.json()) as KpmReportRecord & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not load report");
      }
      setReport(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load report");
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    const header = ["Date", "Total Tickets", "Accepted", "Completed", "Avg Resolution Time (hrs)"];
    const rows = report.metrics.map((metric) => [
      metric.date,
      String(metric.totalTickets),
      String(metric.ticketsAccepted),
      String(metric.ticketsCompleted),
      metric.averageResolutionTime.toFixed(2),
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kpm-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={panelStyle}>
        <div style={filterGridStyle}>
          <label style={labelStyle}>
            <span>Start date</span>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            <span>End date</span>
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} style={inputStyle} />
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
            <button type="button" onClick={loadReport} disabled={loading} style={primaryButton}>
              {loading ? "Loading..." : "Apply filters"}
            </button>
            <button type="button" onClick={exportCsv} disabled={report.metrics.length === 0} style={secondaryButton}>
              Export CSV
            </button>
          </div>
        </div>
        {message ? <p style={{ margin: "12px 0 0", color: "#fca5a5" }}>{message}</p> : null}
      </section>

      <section style={summaryGridStyle}>
        <MetricCard label="Total" value={String(report.summary.totalTickets)} />
        <MetricCard label="Accepted" value={String(report.summary.totalAccepted)} />
        <MetricCard label="Completed" value={String(report.summary.totalCompleted)} />
        <MetricCard label="Pending" value={String(report.summary.pendingTickets)} />
        <MetricCard label="Urgent" value={String(report.summary.urgentTickets)} />
        <MetricCard label="Avg Resolution" value={`${report.summary.avgResolutionTime.toFixed(1)}h`} />
      </section>

      <section style={panelStyle}>
        <h3 style={{ marginTop: 0 }}>Daily metrics</h3>
        {report.metrics.length === 0 ? (
          <p style={{ margin: 0, color: "#94a3b8" }}>No data available for the selected range.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date", "Total", "Accepted", "Completed", "Avg Resolution (hrs)"].map((heading) => (
                    <th key={heading} style={tableHeadStyle}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.metrics.map((metric) => (
                  <tr key={metric.date}>
                    <td style={tableCellStyle}>{metric.date}</td>
                    <td style={tableCellStyle}>{metric.totalTickets}</td>
                    <td style={tableCellStyle}>{metric.ticketsAccepted}</td>
                    <td style={tableCellStyle}>{metric.ticketsCompleted}</td>
                    <td style={tableCellStyle}>{metric.averageResolutionTime.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {report.canViewSpamTickets ? (
        <section style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Spam review</h3>
          <p style={{ color: "#cbd5e1" }}>Spam tickets in range: {report.spamSummary.totalSpamTickets}</p>
          {report.spamTickets.length === 0 ? (
            <p style={{ margin: 0, color: "#94a3b8" }}>No spam tickets found for the selected range.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {report.spamTickets.map((ticket) => (
                <article key={ticket.id} style={spamCardStyle}>
                  <div>
                    <h4 style={{ margin: "0 0 4px" }}>{ticket.title}</h4>
                    <p style={{ margin: 0, color: "#94a3b8" }}>
                      #{ticket.ticketNumber} | {ticket.department} | {ticket.priority}
                    </p>
                  </div>
                  <div style={{ color: "#fca5a5" }}>{ticket.status}</div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={metricCardStyle}>
      <p style={{ margin: 0, color: "#94a3b8" }}>{label}</p>
      <p style={{ margin: "10px 0 0", fontSize: 28, fontWeight: 800 }}>{value}</p>
    </div>
  );
}

const panelStyle: CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(148, 163, 184, 0.16)",
  background: "rgba(15, 23, 42, 0.46)",
  padding: 16,
};

const filterGridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
};

const metricCardStyle: CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(148, 163, 184, 0.16)",
  background: "rgba(15, 23, 42, 0.46)",
  padding: 16,
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

const tableHeadStyle: CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  color: "#cbd5e1",
  borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
};

const tableCellStyle: CSSProperties = {
  padding: "10px 12px",
  color: "#e2e8f0",
  borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
};

const spamCardStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  borderRadius: 12,
  border: "1px solid rgba(239, 68, 68, 0.18)",
  background: "rgba(127, 29, 29, 0.18)",
  padding: 14,
};
