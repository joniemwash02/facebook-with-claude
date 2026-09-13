"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";

async function requireSession() {
  const session = await getServerSession();
  if (!session) throw new Error("You need to be signed in to do that.");
  return session;
}

export async function markAllNotificationsRead() {
  const session = await requireSession();

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/notifications");
}

export async function markNotificationRead(notificationId: string) {
  const session = await requireSession();

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });

  revalidatePath("/notifications");
}
