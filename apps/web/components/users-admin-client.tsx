"use client";

import type { CSSProperties } from "react";
import type { RoleRecord, UserRecord } from "@misconnect/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UsersAdminClientProps {
  initialUsers: UserRecord[];
  roles: RoleRecord[];
}

export function UsersAdminClient({ initialUsers, roles }: UsersAdminClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    displayName: "",
    roleId: roles[0]?.id ?? "",
    department: "",
  });
  const [editForms, setEditForms] = useState<Record<string, { displayName: string; roleId: string; department: string }>>(
    Object.fromEntries(
      initialUsers.map((user) => [
        user.id,
        {
          displayName: user.displayName,
          roleId: user.roleId,
          department: user.department ?? "",
        },
      ])
    )
  );

  async function refreshUsers() {
    const response = await fetch("/api/users", { cache: "no-store" });
    const payload = (await response.json()) as { users?: UserRecord[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to refresh users");
    }
    const nextUsers = payload.users ?? [];
    setUsers(nextUsers);
    setEditForms(
      Object.fromEntries(
        nextUsers.map((user) => [
          user.id,
          {
            displayName: user.displayName,
            roleId: user.roleId,
            department: user.department ?? "",
          },
        ])
      )
    );
    router.refresh();
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyId("create");
    setMessage(null);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          department: createForm.department || undefined,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create user");
      }
      setCreateForm({
        email: "",
        password: "",
        displayName: "",
        roleId: roles[0]?.id ?? "",
        department: "",
      });
      setMessage("User created.");
      await refreshUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create user");
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpdate(userId: string) {
    setBusyId(userId);
    setMessage(null);
    try {
      const form = editForms[userId];
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName,
          roleId: form.roleId,
          department: form.department || undefined,
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not update user");
      }
      setMessage("User updated.");
      await refreshUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update user");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(userId: string) {
    setBusyId(userId);
    setMessage(null);
    try {
      const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not delete user");
      }
      setMessage("User deleted.");
      await refreshUsers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete user");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleCreate} style={panelStyle}>
        <h3 style={{ margin: "0 0 8px" }}>Create user</h3>
        <div style={gridStyle}>
          <input placeholder="Display name" value={createForm.displayName} onChange={(event) => setCreateForm((current) => ({ ...current, displayName: event.target.value }))} style={inputStyle} required />
          <input placeholder="Email" type="email" value={createForm.email} onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))} style={inputStyle} required />
          <input placeholder="Temporary password" type="password" value={createForm.password} onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))} style={inputStyle} required />
          <input placeholder="Department" value={createForm.department} onChange={(event) => setCreateForm((current) => ({ ...current, department: event.target.value }))} style={inputStyle} />
          <select value={createForm.roleId} onChange={(event) => setCreateForm((current) => ({ ...current, roleId: event.target.value }))} style={inputStyle}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={busyId === "create"} style={primaryButton}>
          {busyId === "create" ? "Creating..." : "Create user"}
        </button>
      </form>

      {message ? <p style={{ margin: 0, color: message.endsWith(".") && !message.toLowerCase().includes("could not") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {users.map((candidate) => {
          const form = editForms[candidate.id];
          return (
            <article key={candidate.id} style={panelStyle}>
              <div style={gridStyle}>
                <input value={form?.displayName ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [candidate.id]: { ...current[candidate.id], displayName: event.target.value } }))} style={inputStyle} />
                <input value={candidate.email} disabled style={{ ...inputStyle, opacity: 0.7 }} />
                <input value={form?.department ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [candidate.id]: { ...current[candidate.id], department: event.target.value } }))} style={inputStyle} placeholder="Department" />
                <select value={form?.roleId ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [candidate.id]: { ...current[candidate.id], roleId: event.target.value } }))} style={inputStyle}>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: 0, color: "#94a3b8" }}>UID: {candidate.uid}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => handleUpdate(candidate.id)} disabled={busyId === candidate.id} style={secondaryButton}>
                    {busyId === candidate.id ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={() => handleDelete(candidate.id)} disabled={busyId === candidate.id} style={dangerButton}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {users.length === 0 ? <p style={{ margin: 0, color: "#94a3b8" }}>No users available.</p> : null}
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
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
