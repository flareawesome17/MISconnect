import { getManagedSettings, updateManagedSettings } from "@misconnect/api";
import { updateSettingsSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET() {
  return routeGuard(async () => getManagedSettings(await getRequestSessionUser()));
}

export async function PATCH(request: Request) {
  return routeGuard(async () => {
    const body = updateSettingsSchema.parse(await request.json());
    return updateManagedSettings(await getRequestSessionUser(), body);
  });
}
