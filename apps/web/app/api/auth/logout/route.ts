import { cookies } from "next/headers";
import { revokeSessionCookie, SESSION_COOKIE_NAME } from "@misconnect/api";
import { ok } from "@/lib/http";

export async function POST() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (sessionCookie) {
    await revokeSessionCookie(sessionCookie);
  }
  cookieStore.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return ok({ success: true });
}
