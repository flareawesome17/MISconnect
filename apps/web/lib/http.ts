import { NextResponse } from "next/server";

export function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function routeGuard<T>(fn: () => Promise<T>) {
  try {
    return ok(await fn());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    if (message === "Unauthorized") {
      return fail(401, message);
    }
    if (message === "Forbidden" || message === "Email verification required") {
      return fail(403, message);
    }
    if (message === "Not found") {
      return fail(404, message);
    }
    return fail(400, message);
  }
}
