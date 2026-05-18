import "server-only";
import type { Permission, RoleRecord, SessionUser, TicketRecord } from "@misconnect/shared";
import { STAFF_PORTAL_PERMISSIONS } from "@misconnect/shared";

export function hasPermission(role: RoleRecord, permission: Permission): boolean {
  return role.permissions.includes(permission);
}

export function isStaffRole(role: RoleRecord): boolean {
  return role.scope === "staff" || role.scope === "admin" || STAFF_PORTAL_PERMISSIONS.some((permission) => role.permissions.includes(permission));
}

export function isAdminRole(role: RoleRecord): boolean {
  return role.scope === "admin";
}

export function requireRole(user: SessionUser, scope: RoleRecord["scope"]) {
  if (scope === "customer" && user.role.scope !== "customer") {
    throw new Error("Forbidden");
  }
  if (scope === "staff" && !isStaffRole(user.role)) {
    throw new Error("Forbidden");
  }
  if (scope === "admin" && !isAdminRole(user.role)) {
    throw new Error("Forbidden");
  }
}

export function requirePermission(user: SessionUser, permission: Permission) {
  if (!hasPermission(user.role, permission)) {
    throw new Error("Forbidden");
  }
}

export function requireTicketAccess(user: SessionUser, ticket: TicketRecord) {
  if (user.role.scope === "customer" && ticket.submittedBy !== user.email) {
    throw new Error("Forbidden");
  }
  if (user.role.scope !== "customer" && user.department && ticket.department !== user.department && !isAdminRole(user.role)) {
    throw new Error("Forbidden");
  }
}
