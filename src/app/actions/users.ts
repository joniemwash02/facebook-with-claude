"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/get-session";
import { notify } from "@/lib/notify";

async function requireSession() {
  const session = await getServerSession();
  if (!session) throw new Error("You need to be signed in to do that.");
  return session;
}

export async function toggleFollow(targetUserId: string) {
  const session = await requireSession();
  if (session.user.id === targetUserId) throw new Error("You can't follow yourself.");

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: { followerId: session.user.id, followingId: targetUserId },
    });
    await notify({ userId: targetUserId, actorId: session.user.id, type: "FOLLOW" });
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { username: true },
  });

  revalidatePath("/feed");
  revalidatePath("/search");
  if (target?.username) revalidatePath(`/profile/${target.username}`);
}

export async function updateProfile(formData: FormData) {
  const session = await requireSession();

  const name = String(formData.get("name") ?? "").trim();
  const usernameInput = String(formData.get("username") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!name) return { error: "Name can't be empty." };

  const username = usernameInput || null;
  if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return { error: "Usernames are 3-20 characters: letters, numbers, and underscores only." };
  }

  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return { error: "That username is already taken." };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      username,
      bio: bio || null,
      image: image || null,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/feed");
  if (username) revalidatePath(`/profile/${username}`);

  return { error: null };
}
