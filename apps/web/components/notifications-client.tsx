"use client";

import type { CSSProperties } from "react";
import type { NotificationRecord } from "@misconnect/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NotificationsClient({ initialNotifications }: { initialNotifications: NotificationRecord[] }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshNotifications() {
    const response = await fetch("/api/notifications", { cache: "no-store" });
    const payload = (await response.json()) as { notifications?: NotificationRecord[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to refresh notifications");
    }
    setNotifications(payload.notifications ?? []);
    router.refresh();
  }

  async function markRead(id: string) {
    setBusyId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not mark notification as read");
      }
      setMessage("Notification updated.");
      await refreshNotifications();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not mark notification as read");
    } finally {
      setBusyId(null);
    }
  }

  async function markAllRead() {
    setBusyId("all");
    setMessage(null);
    try {
      const response = await fetch("/api/notifications/read-all", { method: "PATCH" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not mark all notifications as read");
      }
      setMessage("All notifications marked as read.");
      await refreshNotifications();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not mark all notifications as read");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <p style={{ margin: 0, color: "#94a3b8" }}>{notifications.filter((notification) => !notification.read).length} unread</p>
        <button type="button" onClick={markAllRead} disabled={busyId === "all"} style={secondaryButton}>
          {busyId === "all" ? "Updating..." : "Mark all read"}
        </button>
      </div>
      {message ? <p style={{ margin: 0, color: message.endsWith(".") && !message.toLowerCase().includes("could not") ? "#86efac" : "#fca5a5" }}>{message}</p> : null}
      {notifications.map((notification) => (
        <article key={notification.id} style={rowStyle}>
          <div>
            <h3 style={{ margin: "0 0 4px" }}>{notification.title}</h3>
            <p style={{ margin: 0, color: "#cbd5e1" }}>{notification.message}</p>
          </div>
          <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
            <span style={{ color: notification.read ? "#94a3b8" : "#86efac" }}>{notification.read ? "Read" : "Unread"}</span>
            {!notification.read ? (
              <button type="button" onClick={() => markRead(notification.id)} disabled={busyId === notification.id} style={secondaryButton}>
                {busyId === notification.id ? "Updating..." : "Mark read"}
              </button>
            ) : null}
          </div>
        </article>
      ))}
      {notifications.length === 0 ? <p style={{ margin: 0, color: "#94a3b8" }}>No notifications yet.</p> : null}
    </div>
  );
}

const rowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  borderRadius: 16,
  border: "1px solid rgba(148, 163, 184, 0.16)",
  background: "rgba(15, 23, 42, 0.46)",
  padding: 16,
};

const secondaryButton: CSSProperties = {
  border: "1px solid rgba(148, 163, 184, 0.24)",
  borderRadius: 10,
  background: "rgba(15, 23, 42, 0.9)",
  color: "#e2e8f0",
  padding: "10px 12px",
  cursor: "pointer",
};
