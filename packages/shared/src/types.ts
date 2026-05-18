import type { Permission } from "./permissions";

export type RoleScope = "customer" | "staff" | "admin";
export type TicketStatus = "pending" | "in-progress" | "completed" | "urgent" | "spam";
export type TicketPriority = "low" | "medium" | "high";

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  scope: RoleScope;
  isSystem: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UserRecord {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  roleId: string;
  department?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SessionUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  role: RoleRecord;
  department?: string;
}

export interface TicketRecord {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  department: string;
  category: string;
  submittedBy: string;
  assignedTo?: string;
  acceptedBy?: string;
  acceptedAt?: Date | string;
  attachments?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  memberCount?: number;
  status?: "active" | "inactive";
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: "ticket_accepted" | "ticket_reassigned" | "ticket_completed" | "ticket_urgent" | "ticket_available";
  title: string;
  message: string;
  ticketId?: string;
  ticketNumber?: string;
  read: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface PasswordRecord {
  id: string;
  pwdNo: number;
  accountType: string;
  address: string;
  email: string;
  password: string;
  status: "Active" | "Inactive";
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface AppSettingsRecord {
  applicationName: string;
  supportEmail: string;
  emailNotificationsEnabled: boolean;
  updatedAt?: Date | string;
}

export interface KpmDailyMetric {
  date: string;
  ticketsAccepted: number;
  ticketsCompleted: number;
  averageResolutionTime: number;
  totalTickets: number;
}

export interface KpmSummary {
  totalTickets: number;
  totalAccepted: number;
  totalCompleted: number;
  totalNotCompleted: number;
  avgResolutionTime: number;
  completionRate: number;
  urgentTickets: number;
  pendingTickets: number;
}

export interface SpamSummary {
  totalSpamTickets: number;
  spamByDepartment: Record<string, number>;
  spamByStaff: Record<string, number>;
}

export interface KpmReportRecord {
  metrics: KpmDailyMetric[];
  summary: KpmSummary;
  spamTickets: TicketRecord[];
  spamSummary: SpamSummary;
  canViewSpamTickets: boolean;
  filters: {
    startDate?: string;
    endDate?: string;
  };
}
