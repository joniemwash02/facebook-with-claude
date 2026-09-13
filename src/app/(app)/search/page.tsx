import Link from "next/link";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { FollowButton } from "@/components/feed/follow-button";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await getServerSession();
  if (!session) return null;

  const q = searchParams.q?.trim() ?? "";

  const results = q
    ? await prisma.user.findMany({
        where: {
          id: { not: session.user.id },
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 20,
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
          followers: { where: { followerId: session.user.id }, select: { id: true } },
        },
      })
    : [];

  return (
    <main className="container max-w-xl py-8">
      <h1 className="font-semibold text-2xl mb-6">Search</h1>

      <form action="/search" className="mb-6">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search by name or username…"
          autoFocus
        />
      </form>

      {q && results.length === 0 && (
        <p className="text-sm text-muted-foreground py-12 text-center">
          No one matches "{q}".
        </p>
      )}

      <div className="flex flex-col gap-2">
        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            <Link href={user.username ? `/profile/${user.username}` : "#"} className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar src={user.image} seed={user.id} name={user.name} size={40} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.username ? `@${user.username}` : "No username set"}
                </p>
              </div>
            </Link>
            <FollowButton targetUserId={user.id} initiallyFollowing={user.followers.length > 0} />
          </div>
        ))}
      </div>
    </main>
  );
}
