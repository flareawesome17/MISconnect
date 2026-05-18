import Link from "next/link";
import type { CSSProperties } from "react";

export default function HomePage() {
  return (
    <main className="shell" style={{ padding: "72px 0" }}>
      <section className="panel" style={{ padding: 36 }}>
        <p style={{ color: "#67e8f9", textTransform: "uppercase", letterSpacing: 2, fontSize: 12 }}>Migration in progress</p>
        <h1 style={{ fontSize: 54, lineHeight: 1.05, margin: "8px 0 12px" }}>MISconnect is moving to a modular Next.js platform.</h1>
        <p style={{ maxWidth: 760, color: "#cbd5e1", fontSize: 18 }}>
          The new app routes requests through secure server APIs, centralizes RBAC, and keeps the old Vite app available during the transition.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Link href="/login" style={ctaPrimary}>Open new login</Link>
          <Link href="/admin" style={ctaGhost}>Open staff workspace</Link>
          <Link href="/customer" style={ctaGhost}>Open customer workspace</Link>
        </div>
      </section>
    </main>
  );
}

const ctaPrimary: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 999,
  background: "linear-gradient(135deg, #2563eb, #0f766e)",
  fontWeight: 700,
};

const ctaGhost: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 999,
  border: "1px solid rgba(148, 163, 184, 0.3)",
  color: "#bfdbfe",
};
