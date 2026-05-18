import type { ReactNode } from "react";

export function DataCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel" style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 22 }}>{title}</h2>
      {children}
    </section>
  );
}
