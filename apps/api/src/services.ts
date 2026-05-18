import "server-only";
import type { AppSettingsRecord, DepartmentRecord, KpmDailyMetric, KpmReportRecord, NotificationRecord, PasswordRecord, RoleRecord, SessionUser, TicketRecord, UserRecord } from "@misconnect/shared";
import { adminAuth } from "./firebase-admin";
import { requirePermission, requireRole, requireTicketAccess } from "./rbac";
import {
  createDepartment,
  createNotification,
  createPassword,
  createRole,
  createTicket,
  createUserProfile,
  deletePassword,
  deleteDepartment,
  deleteRole,
  deleteUserProfile,
  getAppSettings,
  getDepartmentById,
  getNextTicketNumber,
  getPasswordById,
  getRoleById,
  getTicketById,
  getUserById,
  getUserByUid,
  listPasswords,
  listDepartments,
  listNotificationsForUser,
  listRoles,
  listTickets,
  listUsers,
  markAllNotificationsRead,
  updateAppSettings,
  updateDepartment,
  updateNotification,
  updatePassword,
  updateRole,
  updateTicket,
  updateUserProfile,
} from "./repositories";

export async function getCurrentUserOrThrow(user: SessionUser | null) {
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (!user.emailVerified) {
    throw new Error("Email verification required");
  }
  return user;
}

export async function listVisibleTickets(user: SessionUser | null): Promise<TicketRecord[]> {
  const currentUser = await getCurrentUserOrThrow(user);
  const tickets = await listTickets();

  if (currentUser.role.scope === "customer") {
    return tickets.filter((ticket) => ticket.submittedBy === currentUser.email);
  }

  requirePermission(currentUser, "view_tickets");

  if (currentUser.role.scope === "admin" || !currentUser.department) {
    return tickets;
  }

  return tickets.filter((ticket) => ticket.department === currentUser.department);
}

export async function getVisibleTicket(user: SessionUser | null, ticketId: string): Promise<TicketRecord | null> {
  const currentUser = await getCurrentUserOrThrow(user);
  const ticket = await getTicketById(ticketId);
  if (!ticket) {
    return null;
  }
  requireTicketAccess(currentUser, ticket);
  if (currentUser.role.scope !== "customer") {
    requirePermission(currentUser, "view_tickets");
  }
  return ticket;
}

export async function createTicketForUser(user: SessionUser | null, input: Omit<TicketRecord, "id" | "ticketNumber" | "submittedBy" | "status">): Promise<TicketRecord> {
  const currentUser = await getCurrentUserOrThrow(user);
  const ticketNumber = await getNextTicketNumber();
  if (currentUser.role.scope === "customer") {
    requirePermission(currentUser, "create_tickets");
  }
  const created = await createTicket({
    ...input,
    ticketNumber,
    submittedBy: currentUser.email,
    status: "pending",
  });

  const staffUsers = await listUsers();
  const roles = await listRoles();
  const staffRoleIds = new Set(
    roles
      .filter((role) => role.scope !== "customer" && role.permissions.includes("accept_tickets"))
      .map((role) => role.id)
  );

  const staffMatches = staffUsers.filter((candidate) => staffRoleIds.has(candidate.roleId));
  await Promise.all(
    staffMatches.map((candidate) =>
      createNotification({
        userId: candidate.uid,
        type: "ticket_available",
        title: "New Available Ticket",
        message: `New ticket #${created.ticketNumber} from ${created.department}: ${created.title}`,
        ticketId: created.id,
        ticketNumber: created.ticketNumber,
        read: false,
      })
    )
  );

  return created;
}

export async function updateTicketForUser(user: SessionUser | null, ticketId: string, updates: Partial<TicketRecord>) {
  const currentUser = await getCurrentUserOrThrow(user);
  const ticket = await getTicketById(ticketId);
  if (!ticket) {
    return null;
  }

  requireTicketAccess(currentUser, ticket);

  if (currentUser.role.scope === "customer") {
    if (Object.keys(updates).some((field) => field !== "title" && field !== "description" && field !== "priority" && field !== "category")) {
      throw new Error("Forbidden");
    }
  } else {
    requirePermission(currentUser, "edit_tickets");
  }

  const updated = await updateTicket(ticketId, updates);

  if (updated && currentUser.role.scope !== "customer" && updates.status && updates.status !== ticket.status) {
    const notificationType =
      updates.status === "urgent"
        ? "ticket_urgent"
        : updates.status === "completed"
        ? "ticket_completed"
        : "ticket_accepted";

    await createNotification({
      userId: ticket.submittedBy,
      type: notificationType,
      title:
        updates.status === "urgent"
          ? "Ticket Marked Urgent"
          : updates.status === "completed"
          ? "Ticket Completed"
          : "Ticket Updated",
      message: `Your ticket #${ticket.ticketNumber} is now ${updates.status}.`,
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      read: false,
    });
  }

  return updated;
}

export async function acceptTicketForUser(user: SessionUser | null, ticketId: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requireRole(currentUser, "staff");
  requirePermission(currentUser, "accept_tickets");

  const ticket = await getVisibleTicket(currentUser, ticketId);
  if (!ticket) {
    return null;
  }

  const updated = await updateTicket(ticketId, {
    assignedTo: currentUser.email,
    acceptedBy: currentUser.email,
    status: "in-progress",
  });

  await createNotification({
    userId: ticket.submittedBy,
    type: "ticket_accepted",
    title: "Ticket Accepted",
    message: `Your ticket #${ticket.ticketNumber} has been accepted by ${currentUser.email}.`,
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    read: false,
  });

  return updated;
}

export async function reassignTicketForUser(user: SessionUser | null, ticketId: string, toEmail: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requireRole(currentUser, "staff");
  requirePermission(currentUser, "reassign_tickets");

  const ticket = await getVisibleTicket(currentUser, ticketId);
  if (!ticket) {
    return null;
  }

  const updated = await updateTicket(ticketId, {
    assignedTo: toEmail,
  });

  await createNotification({
    userId: ticket.submittedBy,
    type: "ticket_reassigned",
    title: "Ticket Reassigned",
    message: `Your ticket #${ticket.ticketNumber} has been reassigned to ${toEmail}`,
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    read: false,
  });

  return updated;
}

export async function listManagedUsers(user: SessionUser | null): Promise<UserRecord[]> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "view_users");
  const users = await listUsers();
  if (currentUser.role.scope === "admin" || !currentUser.department) {
    return users;
  }
  return users.filter((candidate) => candidate.department === currentUser.department);
}

export async function createManagedUser(user: SessionUser | null, input: { email: string; password: string; displayName: string; roleId: string; department?: string }) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "create_users");

  const role = await getRoleById(input.roleId);
  if (!role) {
    throw new Error("Role not found");
  }

  const authUser = await adminAuth().createUser({
    email: input.email,
    password: input.password,
    displayName: input.displayName,
    emailVerified: false,
  });

  return createUserProfile({
    uid: authUser.uid,
    email: input.email,
    displayName: input.displayName,
    roleId: role.id,
    department: input.department,
  });
}

export async function updateManagedUser(user: SessionUser | null, id: string, updates: Partial<UserRecord>) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "edit_users");
  return updateUserProfile(id, updates);
}

export async function getManagedUser(user: SessionUser | null, id: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "view_users");
  const target = await getUserById(id);
  if (!target) {
    return null;
  }
  if (currentUser.role.scope !== "admin" && currentUser.department && target.department !== currentUser.department) {
    throw new Error("Forbidden");
  }
  return target;
}

export async function deleteManagedUser(user: SessionUser | null, id: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "delete_users");

  const profile = await getUserById(id);
  if (!profile) {
    return;
  }

  await adminAuth().deleteUser(profile.uid);
  await deleteUserProfile(id);
}

export async function listManagedRoles(user: SessionUser | null): Promise<RoleRecord[]> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_roles");
  return listRoles();
}

export async function listAssignableRoles(user: SessionUser | null): Promise<RoleRecord[]> {
  const currentUser = await getCurrentUserOrThrow(user);
  const allowed = ["view_users", "create_users", "edit_users", "manage_roles"].some((permission) =>
    currentUser.role.permissions.includes(permission as RoleRecord["permissions"][number])
  );
  if (!allowed) {
    throw new Error("Forbidden");
  }
  return listRoles();
}

export async function getManagedRole(user: SessionUser | null, id: string): Promise<RoleRecord | null> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_roles");
  return getRoleById(id);
}

export async function createManagedRole(user: SessionUser | null, input: Omit<RoleRecord, "id">) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_roles");
  return createRole(input);
}

export async function updateManagedRole(user: SessionUser | null, id: string, updates: Partial<RoleRecord>) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_roles");
  const existing = await getRoleById(id);
  if (existing?.isSystem) {
    throw new Error("Cannot update system role");
  }
  return updateRole(id, updates);
}

export async function deleteManagedRole(user: SessionUser | null, id: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_roles");
  const existing = await getRoleById(id);
  if (existing?.isSystem) {
    throw new Error("Cannot delete system role");
  }
  await deleteRole(id);
}

export async function listManagedDepartments(user: SessionUser | null): Promise<DepartmentRecord[]> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "view_departments");
  return listDepartments();
}

export async function createManagedDepartment(user: SessionUser | null, input: Omit<DepartmentRecord, "id">) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "create_departments");
  return createDepartment(input);
}

export async function updateManagedDepartment(user: SessionUser | null, id: string, updates: Partial<DepartmentRecord>) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "edit_departments");
  return updateDepartment(id, updates);
}

export async function deleteManagedDepartment(user: SessionUser | null, id: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "delete_departments");
  await deleteDepartment(id);
}

export async function getManagedDepartment(user: SessionUser | null, id: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "view_departments");
  return getDepartmentById(id);
}

export async function listMyNotifications(user: SessionUser | null): Promise<NotificationRecord[]> {
  const currentUser = await getCurrentUserOrThrow(user);
  return listNotificationsForUser(currentUser.uid);
}

export async function markNotificationReadForUser(user: SessionUser | null, id: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  const notifications = await listNotificationsForUser(currentUser.uid);
  const target = notifications.find((notification) => notification.id === id);
  if (!target) {
    throw new Error("Not found");
  }
  return updateNotification(id, { read: true });
}

export async function markAllNotificationsReadForUser(user: SessionUser | null) {
  const currentUser = await getCurrentUserOrThrow(user);
  await markAllNotificationsRead(currentUser.uid);
}

export async function getMyPermissions(user: SessionUser | null) {
  const currentUser = await getCurrentUserOrThrow(user);
  return currentUser.role.permissions;
}

export async function getMyProfile(user: SessionUser | null) {
  const currentUser = await getCurrentUserOrThrow(user);
  const profile = await getUserByUid(currentUser.uid);
  return {
    ...currentUser,
    profileId: profile?.id,
  };
}

export async function listManagedPasswords(user: SessionUser | null): Promise<PasswordRecord[]> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_passwords");
  return listPasswords();
}

export async function getManagedPassword(user: SessionUser | null, id: string): Promise<PasswordRecord | null> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_passwords");
  return getPasswordById(id);
}

export async function createManagedPassword(user: SessionUser | null, input: Omit<PasswordRecord, "id">) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_passwords");
  return createPassword(input);
}

export async function updateManagedPassword(user: SessionUser | null, id: string, updates: Partial<PasswordRecord>) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_passwords");
  return updatePassword(id, updates);
}

export async function deleteManagedPassword(user: SessionUser | null, id: string) {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "manage_passwords");
  await deletePassword(id);
}

export async function getManagedSettings(user: SessionUser | null): Promise<AppSettingsRecord> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "view_settings");
  return getAppSettings();
}

export async function updateManagedSettings(user: SessionUser | null, settings: AppSettingsRecord): Promise<AppSettingsRecord> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "edit_settings");
  return updateAppSettings(settings);
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "object" && value && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function withinDateRange(date: Date | null, startDate?: string, endDate?: string) {
  if (!date) return false;
  const dateKey = date.toISOString().split("T")[0];
  if (startDate && dateKey < startDate) return false;
  if (endDate && dateKey > endDate) return false;
  return true;
}

export async function getKpmReport(user: SessionUser | null, filters: { startDate?: string; endDate?: string }): Promise<KpmReportRecord> {
  const currentUser = await getCurrentUserOrThrow(user);
  requirePermission(currentUser, "view_kpm_reports");

  const tickets = await listVisibleTickets(currentUser);
  const canViewSpamTickets = currentUser.role.permissions.includes("mark_tickets_as_spam");
  const filteredTickets = tickets.filter((ticket) => withinDateRange(toDate(ticket.createdAt), filters.startDate, filters.endDate));

  const metricsMap = new Map<string, KpmDailyMetric>();

  for (const ticket of filteredTickets) {
    const createdAt = toDate(ticket.createdAt);
    if (!createdAt) continue;
    const dateKey = createdAt.toISOString().split("T")[0];

    if (!metricsMap.has(dateKey)) {
      metricsMap.set(dateKey, {
        date: dateKey,
        ticketsAccepted: 0,
        ticketsCompleted: 0,
        averageResolutionTime: 0,
        totalTickets: 0,
      });
    }

    const metric = metricsMap.get(dateKey)!;
    metric.totalTickets += 1;

    if (ticket.acceptedBy || ticket.acceptedAt) {
      metric.ticketsAccepted += 1;
    }

    if (ticket.status === "completed") {
      metric.ticketsCompleted += 1;
      const updatedAt = toDate(ticket.updatedAt);
      if (updatedAt) {
        const resolutionHours = Math.max(0, (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
        metric.averageResolutionTime =
          metric.averageResolutionTime === 0
            ? resolutionHours
            : (metric.averageResolutionTime + resolutionHours) / 2;
      }
    }
  }

  const metrics = Array.from(metricsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  const totalTickets = filteredTickets.length;
  const totalAccepted = metrics.reduce((sum, metric) => sum + metric.ticketsAccepted, 0);
  const totalCompleted = metrics.reduce((sum, metric) => sum + metric.ticketsCompleted, 0);
  const avgResolutionTime =
    metrics.length > 0 ? metrics.reduce((sum, metric) => sum + metric.averageResolutionTime, 0) / metrics.length : 0;

  const spamTickets = canViewSpamTickets
    ? filteredTickets
        .filter((ticket) => ticket.status === "spam")
        .sort((a, b) => {
          const aTime = toDate(a.updatedAt)?.getTime() ?? 0;
          const bTime = toDate(b.updatedAt)?.getTime() ?? 0;
          return bTime - aTime;
        })
    : [];

  const spamSummary = {
    totalSpamTickets: spamTickets.length,
    spamByDepartment: spamTickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.department] = (acc[ticket.department] ?? 0) + 1;
      return acc;
    }, {}),
    spamByStaff: spamTickets.reduce<Record<string, number>>((acc, ticket) => {
      const key = ticket.assignedTo || ticket.acceptedBy || "Unassigned";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  };

  return {
    metrics,
    summary: {
      totalTickets,
      totalAccepted,
      totalCompleted,
      totalNotCompleted: totalTickets - totalCompleted,
      avgResolutionTime,
      completionRate: totalTickets > 0 ? (totalCompleted / totalTickets) * 100 : 0,
      urgentTickets: filteredTickets.filter((ticket) => ticket.status === "urgent").length,
      pendingTickets: filteredTickets.filter((ticket) => ticket.status === "pending").length,
    },
    spamTickets,
    spamSummary,
    canViewSpamTickets,
    filters,
  };
}
