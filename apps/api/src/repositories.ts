import "server-only";
import type { AppSettingsRecord, DepartmentRecord, NotificationRecord, PasswordRecord, RoleRecord, TicketRecord, UserRecord } from "@misconnect/shared";
import { adminDb } from "./firebase-admin";

type PlainRecord = Record<string, unknown>;

function toPlain<T>(value: PlainRecord): T {
  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => {
      if (fieldValue && typeof fieldValue === "object" && "toDate" in fieldValue && typeof (fieldValue as { toDate: () => Date }).toDate === "function") {
        return [key, (fieldValue as { toDate: () => Date }).toDate().toISOString()];
      }
      return [key, fieldValue];
    })
  ) as T;
}

function withId<T>(id: string, data: PlainRecord): T {
  return toPlain<T>({ id, ...data });
}

export async function listRoles(): Promise<RoleRecord[]> {
  const snapshot = await adminDb().collection("roles").get();
  return snapshot.docs.map((doc) => withId<RoleRecord>(doc.id, doc.data()));
}

export async function getRoleById(roleId: string): Promise<RoleRecord | null> {
  const doc = await adminDb().collection("roles").doc(roleId).get();
  return doc.exists ? withId<RoleRecord>(doc.id, doc.data() ?? {}) : null;
}

export async function createRole(input: Omit<RoleRecord, "id">): Promise<RoleRecord> {
  const ref = await adminDb().collection("roles").add({
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const created = await ref.get();
  return withId<RoleRecord>(created.id, created.data() ?? {});
}

export async function updateRole(roleId: string, updates: Partial<RoleRecord>): Promise<RoleRecord | null> {
  const ref = adminDb().collection("roles").doc(roleId);
  await ref.set({ ...updates, updatedAt: new Date() }, { merge: true });
  const updated = await ref.get();
  return updated.exists ? withId<RoleRecord>(updated.id, updated.data() ?? {}) : null;
}

export async function deleteRole(roleId: string): Promise<void> {
  await adminDb().collection("roles").doc(roleId).delete();
}

export async function listUsers(): Promise<UserRecord[]> {
  const snapshot = await adminDb().collection("users").get();
  return snapshot.docs.map((doc) => withId<UserRecord>(doc.id, doc.data()));
}

export async function getUserByUid(uid: string): Promise<UserRecord | null> {
  const snapshot = await adminDb().collection("users").where("uid", "==", uid).limit(1).get();
  const doc = snapshot.docs[0];
  return doc ? withId<UserRecord>(doc.id, doc.data()) : null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const doc = await adminDb().collection("users").doc(id).get();
  return doc.exists ? withId<UserRecord>(doc.id, doc.data() ?? {}) : null;
}

export async function createUserProfile(input: Omit<UserRecord, "id">): Promise<UserRecord> {
  const ref = await adminDb().collection("users").add({
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const created = await ref.get();
  return withId<UserRecord>(created.id, created.data() ?? {});
}

export async function updateUserProfile(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const ref = adminDb().collection("users").doc(id);
  await ref.set({ ...updates, updatedAt: new Date() }, { merge: true });
  const updated = await ref.get();
  return updated.exists ? withId<UserRecord>(updated.id, updated.data() ?? {}) : null;
}

export async function deleteUserProfile(id: string): Promise<void> {
  await adminDb().collection("users").doc(id).delete();
}

export async function listDepartments(): Promise<DepartmentRecord[]> {
  const snapshot = await adminDb().collection("departments").get();
  return snapshot.docs.map((doc) => withId<DepartmentRecord>(doc.id, doc.data()));
}

export async function getDepartmentById(id: string): Promise<DepartmentRecord | null> {
  const doc = await adminDb().collection("departments").doc(id).get();
  return doc.exists ? withId<DepartmentRecord>(doc.id, doc.data() ?? {}) : null;
}

export async function createDepartment(input: Omit<DepartmentRecord, "id">): Promise<DepartmentRecord> {
  const ref = await adminDb().collection("departments").add({
    ...input,
    memberCount: input.memberCount ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const created = await ref.get();
  return withId<DepartmentRecord>(created.id, created.data() ?? {});
}

export async function updateDepartment(id: string, updates: Partial<DepartmentRecord>): Promise<DepartmentRecord | null> {
  const ref = adminDb().collection("departments").doc(id);
  await ref.set({ ...updates, updatedAt: new Date() }, { merge: true });
  const updated = await ref.get();
  return updated.exists ? withId<DepartmentRecord>(updated.id, updated.data() ?? {}) : null;
}

export async function deleteDepartment(id: string): Promise<void> {
  await adminDb().collection("departments").doc(id).delete();
}

export async function listTickets(): Promise<TicketRecord[]> {
  const snapshot = await adminDb().collection("tickets").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => withId<TicketRecord>(doc.id, doc.data()));
}

export async function getTicketById(id: string): Promise<TicketRecord | null> {
  const doc = await adminDb().collection("tickets").doc(id).get();
  return doc.exists ? withId<TicketRecord>(doc.id, doc.data() ?? {}) : null;
}

export async function createTicket(input: Omit<TicketRecord, "id" | "ticketNumber"> & { ticketNumber: string }): Promise<TicketRecord> {
  const ref = await adminDb().collection("tickets").add({
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const created = await ref.get();
  return withId<TicketRecord>(created.id, created.data() ?? {});
}

export async function updateTicket(id: string, updates: Partial<TicketRecord>): Promise<TicketRecord | null> {
  const ref = adminDb().collection("tickets").doc(id);
  await ref.set({ ...updates, updatedAt: new Date() }, { merge: true });
  const updated = await ref.get();
  return updated.exists ? withId<TicketRecord>(updated.id, updated.data() ?? {}) : null;
}

export async function listNotificationsForUser(uid: string): Promise<NotificationRecord[]> {
  const snapshot = await adminDb().collection("notifications").where("userId", "==", uid).get();
  return snapshot.docs.map((doc) => withId<NotificationRecord>(doc.id, doc.data()));
}

export async function updateNotification(id: string, updates: Partial<NotificationRecord>): Promise<NotificationRecord | null> {
  const ref = adminDb().collection("notifications").doc(id);
  await ref.set({ ...updates, updatedAt: new Date() }, { merge: true });
  const updated = await ref.get();
  return updated.exists ? withId<NotificationRecord>(updated.id, updated.data() ?? {}) : null;
}

export async function markAllNotificationsRead(uid: string): Promise<void> {
  const snapshot = await adminDb().collection("notifications").where("userId", "==", uid).where("read", "==", false).get();
  const batch = adminDb().batch();
  for (const doc of snapshot.docs) {
    batch.set(doc.ref, { read: true, updatedAt: new Date() }, { merge: true });
  }
  await batch.commit();
}

export async function createNotification(input: Omit<NotificationRecord, "id">): Promise<NotificationRecord> {
  const ref = await adminDb().collection("notifications").add({
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const created = await ref.get();
  return withId<NotificationRecord>(created.id, created.data() ?? {});
}

export async function listPasswords(): Promise<PasswordRecord[]> {
  const snapshot = await adminDb().collection("pswrdManager").orderBy("pwdNo", "asc").get();
  return snapshot.docs.map((doc) => withId<PasswordRecord>(doc.id, doc.data()));
}

export async function getPasswordById(id: string): Promise<PasswordRecord | null> {
  const doc = await adminDb().collection("pswrdManager").doc(id).get();
  return doc.exists ? withId<PasswordRecord>(doc.id, doc.data() ?? {}) : null;
}

export async function createPassword(input: Omit<PasswordRecord, "id">): Promise<PasswordRecord> {
  const ref = await adminDb().collection("pswrdManager").add({
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const created = await ref.get();
  return withId<PasswordRecord>(created.id, created.data() ?? {});
}

export async function updatePassword(id: string, updates: Partial<PasswordRecord>): Promise<PasswordRecord | null> {
  const ref = adminDb().collection("pswrdManager").doc(id);
  await ref.set({ ...updates, updatedAt: new Date() }, { merge: true });
  const updated = await ref.get();
  return updated.exists ? withId<PasswordRecord>(updated.id, updated.data() ?? {}) : null;
}

export async function deletePassword(id: string): Promise<void> {
  await adminDb().collection("pswrdManager").doc(id).delete();
}

export async function getAppSettings(): Promise<AppSettingsRecord> {
  const doc = await adminDb().collection("system").doc("appSettings").get();
  if (!doc.exists) {
    return {
      applicationName: "MISConnect",
      supportEmail: "support@misconnect.com",
      emailNotificationsEnabled: true,
    };
  }
  return toPlain<AppSettingsRecord>(doc.data() ?? {});
}

export async function updateAppSettings(settings: AppSettingsRecord): Promise<AppSettingsRecord> {
  await adminDb().collection("system").doc("appSettings").set({
    ...settings,
    updatedAt: new Date(),
  });
  return getAppSettings();
}

export async function getNextTicketNumber(): Promise<string> {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const prefix = `${yy}${mm}${dd}`;
  const counterRef = adminDb().collection("counters").doc(prefix);

  const nextNumber = await adminDb().runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    const currentValue = counterDoc.exists ? Number(counterDoc.data()?.value ?? 0) : 0;
    const value = currentValue + 1;
    transaction.set(counterRef, { value }, { merge: true });
    return value;
  });

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}
