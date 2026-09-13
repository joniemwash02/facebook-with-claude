import Link from "next/link";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MarkAllReadButton } from "@/components/notifications/mark-all-read-button";

const ICONS = {
  LIKE: Heart,
  COMMENT: MessageCircle,
  FOLLOW: UserPlus,
} as const;

const VERBS = {
  LIKE: "liked your post",
  COMMENT: "commented on your post",
  FOLLOW: "started following you",
} as const;

export default async function NotificationsPage() {
  const session = await getServerSession();
  if (!session) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      actor: { select: { id: true, name: true, image: true, username: true } },
    },
  });

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <main className="container max-w-xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-2xl">Notifications</h1>
        {hasUnread && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          Nothing here yet. Activity on your posts will show up in this list.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
          {notifications.map((n) => {
            const Icon = ICONS[n.type];
            return (
              <Link
                key={n.id}
                href={n.actor.username ? `/profile/${n.actor.username}` : "/feed"}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/50",
                  !n.read && "bg-accent/5"
                )}
              >
                <Avatar src={n.actor.image} seed={n.actor.id} name={n.actor.name} size={36} />
                <div className="flex-1 text-sm">
                  <span className="font-medium">{n.actor.name}</span>{" "}
                  <span className="text-muted-foreground">{VERBS[n.type]}</span>
                </div>
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                {!n.read && <span className="h-2 w-2 rounded-full bg-accent shrink-0" />}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
