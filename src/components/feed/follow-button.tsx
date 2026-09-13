"use client";

import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/app/actions/users";

export function FollowButton({
  targetUserId,
  initiallyFollowing,
}: {
  targetUserId: string;
  initiallyFollowing: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [following, setFollowing] = useOptimistic(initiallyFollowing);

  return (
    <Button
      type="button"
      size="sm"
      variant={following ? "outline" : "default"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          setFollowing(!following);
          await toggleFollow(targetUserId);
        });
      }}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
