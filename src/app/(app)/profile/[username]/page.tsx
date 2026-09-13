import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FollowButton } from "@/components/feed/follow-button";
import { PostCard } from "@/components/feed/post-card";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await getServerSession();
  if (!session) return null;
  const { username } = await params;

  const profile = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: { select: { followers: true, following: true, posts: true } },
      followers: { where: { followerId: session.user.id }, select: { id: true } },
    },
  });

  if (!profile) notFound();

  const isOwnProfile = profile.id === session.user.id;

  const posts = await prisma.post.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true, username: true } },
      likes: { where: { userId: session.user.id }, select: { id: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        take: 3,
        include: { author: { select: { id: true, name: true, image: true } } },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return (
    <main className="max-w-[680px] mx-auto pb-8">
      {/* Cover photo, Facebook-style */}
      <div className="h-40 sm:h-56 rounded-b-lg bg-gradient-to-br from-primary to-blue-400" />

      <div className="px-4">
        <div className="-mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <Avatar
              src={profile.image}
              seed={profile.id}
              name={profile.name}
              size={112}
              className="border-4 border-background shadow-sm"
            />
            <div className="pb-1">
              <h1 className="text-2xl font-bold leading-tight">{profile.name}</h1>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
            </div>
          </div>

          {isOwnProfile ? (
            <Link href="/settings">
              <Button variant="outline" size="sm">Edit profile</Button>
            </Link>
          ) : (
            <FollowButton targetUserId={profile.id} initiallyFollowing={profile.followers.length > 0} />
          )}
        </div>

        {profile.bio && <p className="mt-4 text-sm">{profile.bio}</p>}

        <div className="mt-4 flex gap-5 text-sm border-b border-border pb-4">
          <span><strong>{profile._count.posts}</strong> <span className="text-muted-foreground">posts</span></span>
          <span><strong>{profile._count.followers}</strong> <span className="text-muted-foreground">followers</span></span>
          <span><strong>{profile._count.following}</strong> <span className="text-muted-foreground">following</span></span>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              {isOwnProfile ? "You haven't posted anything yet." : `${profile.name} hasn't posted anything yet.`}
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                currentUserId={session.user.id}
                post={{
                  id: post.id,
                  content: post.content,
                  image: post.image,
                  createdAt: post.createdAt,
                  author: post.author,
                  authorId: post.authorId,
                  likeCount: post._count.likes,
                  likedByMe: post.likes.length > 0,
                  commentCount: post._count.comments,
                  recentComments: post.comments,
                }}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
