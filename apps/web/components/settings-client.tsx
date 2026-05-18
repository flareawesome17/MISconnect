"use client";

import type { AppSettingsRecord } from "@misconnect/shared";
import type { CSSProperties } from "react";
import { useState } from "react";

export function SettingsClient({ initialSettings }: { initialSettings: AppSettingsRecord }) {
  const [settings, setSettings] = useState(initialSettings);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveSettings() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(settings),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save settings");
      }
      setMessage("Settings saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save settings");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={panelStyle}>
        <div style={gridStyle}>
          <label style={labelStyle}>
            <span>Application name</span>
            <input value={settings.applicationName} onChange={(event) => setSettings((current) => ({ ...current, applicationName: event.target.value }))} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            <span>Support email</span>
            <input value={settings.supportEmail} onChange={(event) => setSettings((current) => ({ ...current, supportEmail: event.target.value }))} style={inputStyle} />
          </label>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#cbd5e1", marginTop: 14 }}>
          <input
            type="checkbox"
            checked={settings.emailNotificationsEnabled}
            onChange={(event) => setSettings((current) => ({ ...current, emailNotificationsEnabled: event.target.checked }))}
          />
          <span>Email notifications enabled</span>
        </label>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <button type="button" onClick={saveSettings} disabled={busy} style={primaryButton}>
            {busy ? "Saving..." : "Save settings"}
          </button>
          <button type="button" onClick={() => setSettings(initialSettings)} disabled={busy} style={secondaryButton}>
            Reset
          </button>
        </div>
      </section>
      {message ? <p style={{ margin: 0, color: message.endsWith(".") && !message.toLowerCase().includes("could not") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}
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
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
