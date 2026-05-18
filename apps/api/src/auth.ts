import "server-only";
import type { SessionUser } from "@misconnect/shared";
import { adminAuth } from "./firebase-admin";
import { getRoleById, getUserByUid } from "./repositories";

export const SESSION_COOKIE_NAME = "misconnect_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 5;

export async function createSessionCookie(idToken: string) {
  return adminAuth().createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
}

export async function revokeSessionCookie(sessionCookie: string) {
  const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
  await adminAuth().revokeRefreshTokens(decoded.sub);
}

export async function getSessionUserFromCookie(sessionCookie: string | undefined): Promise<SessionUser | null> {
  if (!sessionCookie) {
    return null;
  }

  const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
  const profile = await getUserByUid(decoded.uid);
  if (!profile) {
    return null;
  }

  const role = await getRoleById(profile.roleId);
  if (!role) {
    throw new Error(`Role not found for profile ${profile.id}`);
  }

  return {
    uid: decoded.uid,
    email: profile.email,
    displayName: profile.displayName,
    emailVerified: decoded.email_verified ?? false,
    role,
    department: profile.department,
  };
}

export async function getSessionUserFromIdToken(idToken: string): Promise<SessionUser | null> {
  const decoded = await adminAuth().verifyIdToken(idToken, true);
  const profile = await getUserByUid(decoded.uid);
  if (!profile) {
    return null;
  }

  const role = await getRoleById(profile.roleId);
  if (!role) {
    throw new Error(`Role not found for profile ${profile.id}`);
  }

  return {
    uid: decoded.uid,
    email: profile.email,
    displayName: profile.displayName,
    emailVerified: decoded.email_verified ?? false,
    role,
    department: profile.department,
  };
}
