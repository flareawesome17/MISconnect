import { deleteManagedUser, getManagedUser, updateManagedUser } from "@misconnect/api";
import { updateUserSchema } from "@misconnect/shared";
import { getRequestSessionUser } from "@/lib/request";
import { routeGuard } from "@/lib/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => getManagedUser(await getRequestSessionUser(), (await params).id));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const { id } = await params;
    const body = updateUserSchema.parse(await request.json());
    return updateManagedUser(await getRequestSessionUser(), id, body);
  });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  return routeGuard(async () => {
    const { id } = await params;
    await deleteManagedUser(await getRequestSessionUser(), id);
    return { success: true };
  });
}
