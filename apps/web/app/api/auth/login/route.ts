import { cookies } from "next/headers";
import { createSessionCookie, getSessionUserFromIdToken, SESSION_COOKIE_NAME } from "@misconnect/api";
import { loginSchema } from "@misconnect/shared";
import { fail, ok } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const sessionUser = await getSessionUserFromIdToken(body.idToken);
    if (!sessionUser) {
      return fail(401, "User profile not found");
    }
    if (!sessionUser.emailVerified) {
      return fail(403, "Email verification required");
    }

    const sessionCookie = await createSessionCookie(body.idToken);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5,
    });

    return ok({ user: sessionUser });
  } catch (error) {
    return fail(400, error instanceof Error ? error.message : "Login failed");
  }
}
