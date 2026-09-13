import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/nav-bar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  const unreadCount = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return (
    <div className="min-h-screen">
      <NavBar
        user={{
          id: session.user.id,
          name: session.user.name,
          image: session.user.image ?? null,
          username: (session.user as { username?: string | null }).username ?? null,
        }}
        unreadCount={unreadCount}
      />
      {children}
    </div>
  );
}
