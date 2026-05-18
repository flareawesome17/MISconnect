import type { ReactNode } from "react";
import { getMyPermissions } from "@misconnect/api";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/app-shell";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/tickets", label: "Tickets", permission: "view_tickets" as const },
  { href: "/admin/users", label: "Users", permission: "view_users" as const },
  { href: "/admin/roles", label: "Roles", permission: "manage_roles" as const },
  { href: "/admin/departments", label: "Departments", permission: "view_departments" as const },
  { href: "/admin/reports", label: "Reports", permission: "view_kpm_reports" as const },
  { href: "/admin/passwords", label: "Passwords", permission: "manage_passwords" as const },
  { href: "/admin/settings", label: "Settings", permission: "view_settings" as const },
  { href: "/admin/notifications", label: "Notifications" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireSession();
  const permissions = await getMyPermissions(user);

  return (
    <AppShell title="Staff workspace" subtitle="Server-enforced RBAC console" user={user} permissions={permissions} navItems={adminNav}>
      {children}
    </AppShell>
  );
}
