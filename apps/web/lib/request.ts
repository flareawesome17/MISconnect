import { cookies } from "next/headers";
import { getSessionUserFromCookie, SESSION_COOKIE_NAME } from "@misconnect/api";

export async function getRequestSessionUser() {
  const cookieStore = await cookies();
  return getSessionUserFromCookie(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
