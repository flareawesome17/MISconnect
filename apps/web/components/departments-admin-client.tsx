"use client";

import type { CSSProperties } from "react";
import type { DepartmentRecord } from "@misconnect/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DepartmentsAdminClientProps {
  initialDepartments: DepartmentRecord[];
}

export function DepartmentsAdminClient({ initialDepartments }: DepartmentsAdminClientProps) {
  const router = useRouter();
  const [departments, setDepartments] = useState(initialDepartments);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    manager: "",
    status: "active",
  });
  const [editForms, setEditForms] = useState<Record<string, { name: string; description: string; manager: string; status: "active" | "inactive" }>>(
    Object.fromEntries(
      initialDepartments.map((department) => [
        department.id,
        {
          name: department.name,
          description: department.description ?? "",
          manager: department.manager ?? "",
          status: department.status ?? "active",
        },
      ])
    )
  );

  async function refreshDepartments() {
    const response = await fetch("/api/departments", { cache: "no-store" });
    const payload = (await response.json()) as { departments?: DepartmentRecord[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to refresh departments");
    }
    const nextDepartments = payload.departments ?? [];
    setDepartments(nextDepartments);
    setEditForms(
      Object.fromEntries(
        nextDepartments.map((department) => [
          department.id,
          {
            name: department.name,
            description: department.description ?? "",
            manager: department.manager ?? "",
            status: department.status ?? "active",
          },
        ])
      )
    );
    router.refresh();
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyId("create-department");
    setMessage(null);
    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create department");
      }
      setCreateForm({ name: "", description: "", manager: "", status: "active" });
      setMessage("Department created.");
      await refreshDepartments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create department");
    } finally {
      setBusyId(null);
    }
  }

  async function handleUpdate(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(editForms[id]),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not update department");
      }
      setMessage("Department updated.");
      await refreshDepartments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update department");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/departments/${id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not delete department");
      }
      setMessage("Department deleted.");
      await refreshDepartments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete department");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleCreate} style={panelStyle}>
        <h3 style={{ margin: "0 0 8px" }}>Create department</h3>
        <div style={gridStyle}>
          <input placeholder="Name" value={createForm.name} onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))} style={inputStyle} required />
          <input placeholder="Description" value={createForm.description} onChange={(event) => setCreateForm((current) => ({ ...current, description: event.target.value }))} style={inputStyle} />
          <input placeholder="Manager" value={createForm.manager} onChange={(event) => setCreateForm((current) => ({ ...current, manager: event.target.value }))} style={inputStyle} />
          <select value={createForm.status} onChange={(event) => setCreateForm((current) => ({ ...current, status: event.target.value as "active" | "inactive" }))} style={inputStyle}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" disabled={busyId === "create-department"} style={primaryButton}>
          {busyId === "create-department" ? "Creating..." : "Create department"}
        </button>
      </form>

      {message ? <p style={{ margin: 0, color: message.endsWith(".") && !message.toLowerCase().includes("could not") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {departments.map((department) => {
          const form = editForms[department.id];
          return (
            <article key={department.id} style={panelStyle}>
              <div style={gridStyle}>
                <input value={form?.name ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [department.id]: { ...current[department.id], name: event.target.value } }))} style={inputStyle} />
                <input value={form?.description ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [department.id]: { ...current[department.id], description: event.target.value } }))} style={inputStyle} />
                <input value={form?.manager ?? ""} onChange={(event) => setEditForms((current) => ({ ...current, [department.id]: { ...current[department.id], manager: event.target.value } }))} style={inputStyle} />
                <select value={form?.status ?? "active"} onChange={(event) => setEditForms((current) => ({ ...current, [department.id]: { ...current[department.id], status: event.target.value as "active" | "inactive" } }))} style={inputStyle}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <p style={{ margin: 0, color: "#94a3b8" }}>ID: {department.id}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => handleUpdate(department.id)} disabled={busyId === department.id} style={secondaryButton}>
                    {busyId === department.id ? "Saving..." : "Save"}
                  </button>
                  <button type="button" onClick={() => handleDelete(department.id)} disabled={busyId === department.id} style={dangerButton}>
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
