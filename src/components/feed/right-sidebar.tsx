import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/avatar";
import { FollowButton } from "@/components/feed/follow-button";

export async function RightSidebar({ currentUserId }: { currentUserId: string }) {
  const suggestions = await prisma.user.findMany({
    where: {
      id: { not: currentUserId },
      followers: { none: { followerId: currentUserId } },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, username: true, image: true },
  });

  return (
    <aside className="hidden xl:block sticky top-[72px] self-start w-full">
      <h2 className="px-2 mb-2 text-sm font-semibold text-muted-foreground">
        People you may know
      </h2>

      {suggestions.length === 0 ? (
        <p className="px-2 text-sm text-muted-foreground">
          You're following everyone here already.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {suggestions.map((person) => (
            <div
              key={person.id}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary transition-colors"
            >
              <Avatar src={person.image} seed={person.id} name={person.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{person.name}</p>
                {person.username && (
                  <p className="text-xs text-muted-foreground truncate">@{person.username}</p>
                )}
              </div>
              <FollowButton targetUserId={person.id} initiallyFollowing={false} />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
