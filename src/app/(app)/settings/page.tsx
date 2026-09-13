import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session) return null;

  const profile = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { id: true, name: true, username: true, bio: true, image: true },
  });

  return (
    <main className="container max-w-lg py-8">
      <h1 className="font-semibold text-2xl mb-6">Settings</h1>
      <Card>
        <CardContent className="pt-6">
          <SettingsForm profile={profile} />
        </CardContent>
      </Card>
    </main>
  );
}
