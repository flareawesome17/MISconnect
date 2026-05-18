"use client";

import type { CSSProperties } from "react";
import type { PasswordRecord } from "@misconnect/shared";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export function PasswordsAdminClient({ initialPasswords }: { initialPasswords: PasswordRecord[] }) {
  const router = useRouter();
  const [passwords, setPasswords] = useState(initialPasswords);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [createForm, setCreateForm] = useState({
    pwdNo: initialPasswords.length > 0 ? Math.max(...initialPasswords.map((item) => item.pwdNo)) + 1 : 1,
    accountType: "",
    address: "",
    email: "",
    password: "",
    status: "Active" as "Active" | "Inactive",
  });
  const [editForms, setEditForms] = useState<Record<string, Omit<PasswordRecord, "id" | "createdAt" | "updatedAt">>>(
    Object.fromEntries(
      initialPasswords.map((item) => [
        item.id,
        {
          pwdNo: item.pwdNo,
          accountType: item.accountType,
          address: item.address,
          email: item.email,
          password: item.password,
          status: item.status,
        },
      ])
    )
  );

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return passwords;
    }
    const term = search.toLowerCase();
    return passwords.filter(
      (item) =>
        item.email.toLowerCase().includes(term) ||
        item.accountType.toLowerCase().includes(term) ||
        item.address.toLowerCase().includes(term)
    );
  }, [passwords, search]);

  async function refreshPasswords() {
    const response = await fetch("/api/passwords", { cache: "no-store" });
    const payload = (await response.json()) as { passwords?: PasswordRecord[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to refresh passwords");
    }
    const nextPasswords = payload.passwords ?? [];
    setPasswords(nextPasswords);
    setEditForms(
      Object.fromEntries(
        nextPasswords.map((item) => [
          item.id,
          {
            pwdNo: item.pwdNo,
            accountType: item.accountType,
            address: item.address,
            email: item.email,
            password: item.password,
            status: item.status,
          },
        ])
      )
    );
    setCreateForm((current) => ({
      ...current,
      pwdNo: nextPasswords.length > 0 ? Math.max(...nextPasswords.map((item) => item.pwdNo)) + 1 : 1,
    }));
    router.refresh();
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyId("create-password");
    setMessage(null);
    try {
      const response = await fetch("/api/passwords", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create password entry");
      }
      setCreateForm({
        pwdNo: createForm.pwdNo + 1,
        accountType: "",
        address: "",
        email: "",
        password: "",
        status: "Active",
      });
      setMessage("Password entry created.");
      await refreshPasswords();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create password entry");
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpdate(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/passwords/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editForms[id]),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not update password entry");
      }
      setMessage("Password entry updated.");
      await refreshPasswords();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update password entry");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/passwords/${id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not delete password entry");
      }
      setMessage("Password entry deleted.");
      await refreshPasswords();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete password entry");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleCreate} style={panelStyle}>
        <h3 style={{ margin: "0 0 8px" }}>Add password entry</h3>
        <div style={gridStyle}>
          <input value={String(createForm.pwdNo)} onChange={(event) => setCreateForm((current) => ({ ...current, pwdNo: Number(event.target.value) || 0 }))} placeholder="Number" style={inputStyle} required />
          <input value={createForm.accountType} onChange={(event) => setCreateForm((current) => ({ ...current, accountType: event.target.value }))} placeholder="Account type" style={inputStyle} required />
          <input value={createForm.address} onChange={(event) => setCreateForm((current) => ({ ...current, address: event.target.value }))} placeholder="Address" style={inputStyle} />
          <input value={createForm.email} onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email / account" style={inputStyle} required />
          <input value={createForm.password} onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" style={inputStyle} required />
          <select value={createForm.status} onChange={(event) => setCreateForm((current) => ({ ...current, status: event.target.value as "Active" | "Inactive" }))} style={inputStyle}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" disabled={busyId === "create-password"} style={primaryButton}>
          {busyId === "create-password" ? "Creating..." : "Create password entry"}
        </button>
      </form>

      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search passwords by email, type, or address" style={inputStyle} />
      {message ? <p style={{ margin: 0, color: message.endsWith(".") && !message.toLowerCase().includes("could not") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map((item) => {
          const form = editForms[item.id];
          return (
            <article key={item.id} style={panelStyle}>
              <div style={gridStyle}>
                <input value={String(form?.pwdNo ?? "")} onChange={(event) => setEditForms((current) => ({ ...current, [item.id]: { ...current[item.id], pwdNo: Number(event.target.value) || 0 } }))} style={inputStyle} />
                <input value={form?.accountType ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [item.id]: { ...current[item.id], accountType: event.target.value } }))} style={inputStyle} />
                <input value={form?.address ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [item.id]: { ...current[item.id], address: event.target.value } }))} style={inputStyle} />
                <input value={form?.email ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [item.id]: { ...current[item.id], email: event.target.value } }))} style={inputStyle} />
                <input
                  value={showValues[item.id] ? form?.password ?? "" : "••••••••"}
                  onChange={(event) => setEditForms((current) => ({ ...current, [item.id]: { ...current[item.id], password: event.target.value } }))}
                  style={inputStyle}
                  type={showValues[item.id] ? "text" : "password"}
                />
                <select value={form?.status ?? "Active"} onChange={(event) => setEditForms((current) => ({ ...current, [item.id]: { ...current[item.id], status: event.target.value as "Active" | "Inactive" } }))} style={inputStyle}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setShowValues((current) => ({ ...current, [item.id]: !current[item.id] }))} style={secondaryButton}>
                    {showValues[item.id] ? "Hide" : "Show"} password
                  </button>
                  <button type="button" onClick={() => navigator.clipboard.writeText(form?.password ?? "")} style={secondaryButton}>
                    Copy password
                  </button>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => handleUpdate(item.id)} disabled={busyId === item.id} style={secondaryButton}>
                    {busyId === item.id ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} disabled={busyId === item.id} style={dangerButton}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 ? <p style={{ margin: 0, color: "#94a3b8" }}>No password entries found.</p> : null}
      </div>
    </div>
  );
}

const panelStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  borderRadius: 16,
  border: "1px solid rgba(148, 163, 184, 0.16)",
  background: "rgba(15, 23, 42, 0.46)",
  padding: 16,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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
  width: "fit-content",
};

const secondaryButton: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: 10,
  background: "rgba(15, 23, 42, 0.9)",
  color: "#e2e8f0",
  padding: "10px 12px",
  cursor: "pointer",
};

const dangerButton: CSSProperties = {
  border: "1px solid rgba(239, 68, 68, 0.35)",
  borderRadius: 10,
  background: "rgba(127, 29, 29, 0.4)",
  color: "#fecaca",
  padding: "10px 12px",
  cursor: "pointer",
};
