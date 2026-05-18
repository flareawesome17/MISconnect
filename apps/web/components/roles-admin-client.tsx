"use client";

import type { CSSProperties } from "react";
import type { Permission, RoleRecord, RoleScope } from "@misconnect/shared";
import { PERMISSIONS } from "@misconnect/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RolesAdminClientProps {
  initialRoles: RoleRecord[];
}

interface RoleFormState {
  name: string;
  description: string;
  scope: RoleScope;
  permissions: Permission[];
}

export function RolesAdminClient({ initialRoles }: RolesAdminClientProps) {
  const router = useRouter();
  const [roles, setRoles] = useState(initialRoles);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<RoleFormState>({
    name: "",
    description: "",
    scope: "staff",
    permissions: ["view_tickets"],
  });
  const [editForms, setEditForms] = useState<Record<string, RoleFormState>>(
    Object.fromEntries(
      initialRoles.map((role) => [
        role.id,
        {
          name: role.name,
          description: role.description,
          scope: role.scope,
          permissions: role.permissions,
        },
      ])
    )
  );

  async function refreshRoles() {
    const response = await fetch("/api/roles", { cache: "no-store" });
    const payload = (await response.json()) as { roles?: RoleRecord[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to refresh roles");
    }
    const nextRoles = payload.roles ?? [];
    setRoles(nextRoles);
    setEditForms(
      Object.fromEntries(
        nextRoles.map((role) => [
          role.id,
          {
            name: role.name,
            description: role.description,
            scope: role.scope,
            permissions: role.permissions,
          },
        ])
      )
    );
    router.refresh();
  }

  function togglePermission(current: Permission[], permission: Permission) {
    return current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission];
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyId("create-role");
    setMessage(null);
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create role");
      }
      setCreateForm({ name: "", description: "", scope: "staff", permissions: ["view_tickets"] });
      setMessage("Role created.");
      await refreshRoles();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create role");
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpdate(roleId: string) {
    setBusyId(roleId);
    setMessage(null);
    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editForms[roleId]),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not update role");
      }
      setMessage("Role updated.");
      await refreshRoles();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update role");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(roleId: string) {
    setBusyId(roleId);
    setMessage(null);
    try {
      const response = await fetch(`/api/roles/${roleId}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not delete role");
      }
      setMessage("Role deleted.");
      await refreshRoles();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete role");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleCreate} style={panelStyle}>
        <h3 style={{ margin: "0 0 8px" }}>Create role</h3>
        <div style={gridStyle}>
          <input placeholder="Role name" value={createForm.name} onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))} style={inputStyle} required />
          <input placeholder="Description" value={createForm.description} onChange={(event) => setCreateForm((current) => ({ ...current, description: event.target.value }))} style={inputStyle} required />
          <select value={createForm.scope} onChange={(event) => setCreateForm((current) => ({ ...current, scope: event.target.value as RoleScope }))} style={inputStyle}>
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <PermissionChecklist permissions={createForm.permissions} onToggle={(permission) => setCreateForm((current) => ({ ...current, permissions: togglePermission(current.permissions, permission) }))} />
        <button type="submit" disabled={busyId === "create-role"} style={primaryButton}>
          {busyId === "create-role" ? "Creating..." : "Create role"}
        </button>
      </form>

      {message ? <p style={{ margin: 0, color: message.endsWith(".") && !message.toLowerCase().includes("could not") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {roles.map((role) => {
          const form = editForms[role.id];
          return (
            <article key={role.id} style={panelStyle}>
              <div style={gridStyle}>
                <input value={form?.name ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [role.id]: { ...current[role.id], name: event.target.value } }))} style={inputStyle} />
                <input value={form?.description ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [role.id]: { ...current[role.id], description: event.target.value } }))} style={inputStyle} />
                <select value={form?.scope ?? "staff"} onChange={(event) => setEditForms((current) => ({ ...current, [role.id]: { ...current[role.id], scope: event.target.value as RoleScope } }))} style={inputStyle} disabled={role.isSystem}>
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <PermissionChecklist
                permissions={form?.permissions ?? []}
                onToggle={(permission) =>
                  setEditForms((current) => ({
                    ...current,
                    [role.id]: { ...current[role.id], permissions: togglePermission(current[role.id].permissions, permission) },
                  }))
                }
                disabled={role.isSystem}
              />
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <p style={{ margin: 0, color: "#94a3b8" }}>{role.isSystem ? "System role" : `${role.permissions.length} permission(s)`}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => handleUpdate(role.id)} disabled={busyId === role.id || role.isSystem} style={secondaryButton}>
                    {busyId === role.id ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={() => handleDelete(role.id)} disabled={busyId === role.id || role.isSystem} style={dangerButton}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PermissionChecklist({
  permissions,
  onToggle,
  disabled,
}: {
  permissions: Permission[];
  onToggle: (permission: Permission) => void;
  disabled?: boolean;
}) {
  return (
    <div style={permissionGridStyle}>
      {PERMISSIONS.map((permission) => (
        <label key={permission} style={{ display: "flex", alignItems: "center", gap: 8, color: "#cbd5e1", fontSize: 14 }}>
          <input type="checkbox" checked={permissions.includes(permission)} onChange={() => onToggle(permission)} disabled={disabled} />
          <span>{permission}</span>
        </label>
      ))}
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

const permissionGridStyle: CSSProperties = {
  display: "grid",
  gap: 8,
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
