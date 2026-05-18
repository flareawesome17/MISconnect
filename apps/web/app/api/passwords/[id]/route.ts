import { deleteManagedPassword, getManagedPassword, updateManagedPassword } from "@misconnect/api";
import { updatePasswordSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => getManagedPassword(await getRequestSessionUser(), (await params).id));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const body = updatePasswordSchema.parse(await request.json());
    return updateManagedPassword(await getRequestSessionUser(), (await params).id, body);
  });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    await deleteManagedPassword(await getRequestSessionUser(), (await params).id);
    return { success: true };
  });
}
