import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";

export default async function Home() {
  const session = await getServerSession();
  if (session) redirect("/feed");

  return (
    <main className="min-h-screen flex flex-col">
      <header className="container flex items-center justify-between py-6">
        <span className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
            C
          </span>
          <span className="font-semibold text-xl">Commons</span>
        </span>
        <nav className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Join</Button>
          </Link>
        </nav>
      </header>

      <section className="container flex-1 grid md:grid-cols-2 gap-12 items-center py-16">
        <div className="max-w-md">
          <h1 className="font-semibold text-5xl leading-[1.1]">
            A quieter place to say what's on your mind.
          </h1>
          <p className="mt-5 text-muted-foreground text-base max-w-[42ch]">
            Post, follow people you care about, and keep up with what they're
            doing — without the noise.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/sign-up">
              <Button size="lg">Create an account</Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline">I already have one</Button>
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm max-w-sm ml-auto">
            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/150?u=demo-maya"
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">Maya Chen</p>
                <p className="text-xs text-muted-foreground">3 minutes ago</p>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Finally finished the trail behind the reservoir. Worth the mud.
            </p>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <span>12 likes</span>
              <span>4 comments</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
