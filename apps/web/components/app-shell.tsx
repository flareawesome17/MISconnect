import Link from "next/link";
import type { ReactNode } from "react";
import type { Permission, SessionUser } from "@misconnect/shared";
import { LogoutButton } from "./logout-button";

interface NavItem {
  href: string;
  label: string;
  permission?: Permission;
}

interface AppShellProps {
  title: string;
  subtitle: string;
  user: SessionUser;
  permissions: Permission[];
  navItems: NavItem[];
  children: ReactNode;
}

export function AppShell({ title, subtitle, user, permissions, navItems, children }: AppShellProps) {
  const visibleItems = navItems.filter((item) => !item.permission || permissions.includes(item.permission));

  return (
    <main className="shell" style={{ padding: "24px 0 72px" }}>
      <section className="panel" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#67e8f9", textTransform: "uppercase", letterSpacing: 1.6, fontSize: 12 }}>
              {title}
            </p>
            <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>{user.displayName}</h1>
            <p style={{ margin: 0, color: "#cbd5e1" }}>
              {subtitle} | {user.role.name} | {user.department ?? "Cross-department"}
            </p>
          </div>
          <LogoutButton />
        </div>
        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(148, 163, 184, 0.22)",
                color: "#bfdbfe",
                background: "rgba(15, 23, 42, 0.4)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </section>
      {children}
    </main>
  );
}
