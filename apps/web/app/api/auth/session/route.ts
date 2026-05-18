import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => {
    const user = await getRequestSessionUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    return { user };
  });
}
