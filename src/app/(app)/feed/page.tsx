import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { PostComposer } from "@/components/feed/post-composer";
import { PostCard } from "@/components/feed/post-card";
import { LeftSidebar } from "@/components/feed/left-sidebar";
import { RightSidebar } from "@/components/feed/right-sidebar";

export default async function FeedPage() {
  const session = await getServerSession();
  if (!session) return null; // (app)/layout.tsx already redirects unauthenticated users

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
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

  const username = (session.user as { username?: string | null }).username ?? null;

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,600px)] xl:grid-cols-[240px_minmax(0,600px)_280px] gap-6 max-w-[1100px] mx-auto px-4 py-6 justify-center">
      <LeftSidebar
        user={{
          id: session.user.id,
          name: session.user.name,
          image: session.user.image ?? null,
          username,
        }}
      />

      <div className="w-full max-w-[600px] mx-auto lg:mx-0">
        <div className="mb-4">
          <PostComposer
            user={{ id: session.user.id, name: session.user.name, image: session.user.image }}
          />
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-12 text-center">
            No posts yet. Be the first to share something.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
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
            ))}
          </div>
        )}
      </div>

      <RightSidebar currentUserId={session.user.id} />
    </main>
  );
}
