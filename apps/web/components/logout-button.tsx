"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      style={{
        borderRadius: 999,
        border: "1px solid rgba(148, 163, 184, 0.28)",
        background: "rgba(15, 23, 42, 0.65)",
        color: "#e2e8f0",
        padding: "10px 14px",
        cursor: "pointer",
      }}
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
