import type { ReactNode } from "react";
import { getMyPermissions } from "@misconnect/api";
import { requireSession } from "@/lib/session";
import { AppShell } from "@/components/app-shell";

const customerNav = [
  { href: "/customer", label: "Overview" },
  { href: "/customer/new-ticket", label: "New ticket", permission: "create_tickets" as const },
];

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const user = await requireSession();
  const permissions = await getMyPermissions(user);

  return (
    <AppShell title="Customer workspace" subtitle="Your tickets and requests" user={user} permissions={permissions} navItems={customerNav}>
      {children}
    </AppShell>
  );
}
