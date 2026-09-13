"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Bell, Settings, LogOut, Users, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth-client";

export function NavBar({
  user,
  unreadCount,
}: {
  user: { id: string; name: string; image: string | null; username: string | null };
  unreadCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card">
      <div className="flex h-14 items-center gap-2 px-4">
        {/* Left: brand + search, like Facebook's top-left cluster */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Link
            href="/feed"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg"
          >
            C
          </Link>
          <form action="/search" className="hidden sm:block w-full max-w-[240px]">
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 h-10">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                name="q"
                placeholder="Search Commons"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>
        </div>

        {/* Center: primary nav pills, like Facebook's Home/Video/Groups row */}
        <nav className="hidden md:flex items-center gap-1">
          <NavPill href="/feed" active={pathname === "/feed"}>
            <Home className="h-6 w-6" />
          </NavPill>
          <NavPill href="/search" active={pathname === "/search"}>
            <Users className="h-6 w-6" />
          </NavPill>
        </nav>

        {/* Right: utility icons + profile, like Facebook's right icon cluster */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <RoundIconLink href="/notifications" active={pathname === "/notifications"} badge={unreadCount}>
            <Bell className="h-5 w-5" />
          </RoundIconLink>
          <RoundIconLink
            href={user.username ? `/profile/${user.username}` : "/settings"}
            active={pathname.startsWith("/profile")}
          >
            <MessageCircle className="h-5 w-5" />
          </RoundIconLink>
          <RoundIconLink href="/settings" active={pathname === "/settings"}>
            <Settings className="h-5 w-5" />
          </RoundIconLink>

          <Link
            href={user.username ? `/profile/${user.username}` : "/settings"}
            className="ml-1"
          >
            <Avatar src={user.image} seed={user.id} name={user.name} size={36} />
          </Link>

          <button
            onClick={async () => {
              await signOut();
              router.push("/");
              router.refresh();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-12 w-24 items-center justify-center rounded-lg transition-colors",
        active
          ? "text-primary border-b-[3px] border-primary"
          : "text-muted-foreground hover:bg-secondary"
      )}
    >
      {children}
    </Link>
  );
}

function RoundIconLink({
  href,
  active,
  badge,
  children,
}: {
  href: string;
  active: boolean;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        active ? "bg-primary/15 text-primary" : "bg-secondary text-foreground hover:bg-secondary/70"
      )}
    >
      {children}
      {!!badge && (
        <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}
