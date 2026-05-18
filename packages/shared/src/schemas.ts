import { z } from "zod";
import { PERMISSIONS } from "./permissions";

export const permissionSchema = z.enum(PERMISSIONS);
export const roleScopeSchema = z.enum(["customer", "staff", "admin"]);
export const ticketStatusSchema = z.enum(["pending", "in-progress", "completed", "urgent", "spam"]);
export const ticketPrioritySchema = z.enum(["low", "medium", "high"]);

export const loginSchema = z.object({
  idToken: z.string().min(1),
});

export const createTicketSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  priority: ticketPrioritySchema,
  department: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  attachments: z.array(z.string()).optional().default([]),
});

export const updateTicketSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  department: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(100).optional(),
  assignedTo: z.string().email().optional(),
});

export const reassignTicketSchema = z.object({
  toEmail: z.string().email(),
  reason: z.string().max(1000).optional(),
});

export const createRoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  permissions: z.array(permissionSchema).min(1),
  scope: roleScopeSchema,
  isSystem: z.boolean().optional().default(false),
});

export const updateRoleSchema = createRoleSchema.partial();

export const createDepartmentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  manager: z.string().max(200).optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(200),
  roleId: z.string().min(1),
  department: z.string().max(100).optional(),
});

export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(200).optional(),
  roleId: z.string().min(1).optional(),
  department: z.string().max(100).optional(),
});

export const markNotificationReadSchema = z.object({
  read: z.literal(true),
});

export const passwordStatusSchema = z.enum(["Active", "Inactive"]);

export const createPasswordSchema = z.object({
  pwdNo: z.number().int().nonnegative(),
  accountType: z.string().min(1).max(100),
  address: z.string().max(200).default(""),
  email: z.string().min(1).max(200),
  password: z.string().min(1).max(200),
  status: passwordStatusSchema,
});

export const updatePasswordSchema = createPasswordSchema.partial();

export const updateSettingsSchema = z.object({
  applicationName: z.string().min(1).max(100),
  supportEmail: z.string().email(),
  emailNotificationsEnabled: z.boolean(),
});

export const kpmReportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
