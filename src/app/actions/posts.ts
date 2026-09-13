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

export async function createPost(formData: FormData) {
  const session = await requireSession();

  const content = String(formData.get("content") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!content && !image) return { error: "Write something or add a photo before posting." };
  if (content.length > 2000) return { error: "That's a bit long — keep it under 2000 characters." };

  await prisma.post.create({
    data: {
      content: content || null,
      image: image || null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/feed");
  return { error: null };
}

export async function deletePost(postId: string) {
  const session = await requireSession();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id) {
    throw new Error("You can only delete your own posts.");
  }

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/feed");
}

export async function toggleLike(postId: string) {
  const session = await requireSession();

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { userId: session.user.id, postId },
    });

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (post) {
      await notify({ userId: post.authorId, actorId: session.user.id, type: "LIKE", postId });
    }
  }

  revalidatePath("/feed");
}

export async function addComment(postId: string, formData: FormData) {
  const session = await requireSession();

  const content = String(formData.get("content") ?? "").trim();
  if (!content) return { error: "Write a comment first." };
  if (content.length > 500) return { error: "Keep comments under 500 characters." };

  await prisma.comment.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
    },
  });

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (post) {
    await notify({ userId: post.authorId, actorId: session.user.id, type: "COMMENT", postId });
  }

  revalidatePath("/feed");
  return { error: null };
}
