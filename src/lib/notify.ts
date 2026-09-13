import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@/generated/prisma";

export async function notify({
  userId,
  actorId,
  type,
  postId,
}: {
  userId: string;
  actorId: string;
  type: NotificationType;
  postId?: string;
}) {
  if (userId === actorId) return; // no need to notify yourself

  await prisma.notification.create({
    data: { userId, actorId, type, postId },
  });
}
