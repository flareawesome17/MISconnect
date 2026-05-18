import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUserFromCookie, SESSION_COOKIE_NAME } from "@misconnect/api";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return getSessionUserFromCookie(sessionCookie);
}

export async function requireSession() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
