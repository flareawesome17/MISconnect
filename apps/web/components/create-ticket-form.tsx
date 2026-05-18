"use client";

import type { CSSProperties, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateTicketForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    department: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create ticket");
      }
      setForm({ title: "", description: "", priority: "medium", department: "", category: "" });
      setMessage("Ticket submitted successfully.");
      router.refresh();
    } catch (submissionError) {
      setMessage(submissionError instanceof Error ? submissionError.message : "Could not create ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
      <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Ticket title" required style={inputStyle} />
      <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Describe the issue" required rows={5} style={{ ...inputStyle, resize: "vertical" }} />
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        <input value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} placeholder="Department" required style={inputStyle} />
        <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Category" required style={inputStyle} />
        <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))} style={inputStyle}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" disabled={loading} style={submitStyle}>
        {loading ? "Submitting..." : "Create ticket"}
      </button>
      {message ? <p style={{ margin: 0, color: message.includes("successfully") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}
    </form>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(15, 23, 42, 0.82)",
  color: "#eff6ff",
  padding: "12px 14px",
};

const submitStyle: CSSProperties = {
  border: 0,
  borderRadius: 12,
  background: "linear-gradient(135deg, #059669, #2563eb)",
  color: "white",
  padding: "12px 14px",
  cursor: "pointer",
  fontWeight: 700,
};
