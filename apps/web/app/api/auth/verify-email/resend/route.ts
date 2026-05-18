import { adminAuth } from "@misconnect/api/firebase-admin";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function POST() {
  return routeGuard(async () => {
    const user = await getRequestSessionUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    const link = await adminAuth().generateEmailVerificationLink(user.email);
    return { verificationLink: link };
  });
}
