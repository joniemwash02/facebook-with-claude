import Link from "next/link";
import { Bell, Search, Settings, Bookmark, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export function LeftSidebar({
  user,
}: {
  user: { id: string; name: string; image: string | null; username: string | null };
}) {
  const items = [
    { href: "/search", label: "Find people", icon: Search },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col gap-1 sticky top-[72px] self-start w-full">
      <Link
        href={user.username ? `/profile/${user.username}` : "/settings"}
        className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary transition-colors"
      >
        <Avatar src={user.image} seed={user.id} name={user.name} size={36} />
        <span className="text-sm font-medium truncate">{user.name}</span>
      </Link>

      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-sm font-medium">{label}</span>
        </Link>
      ))}

      <div className="mt-4 flex items-center gap-2 px-2 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        <span>Commons · a small, quieter feed</span>
      </div>
    </aside>
  );
}
