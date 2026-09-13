"use client";

import { useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/app/actions/posts";

export function LikeButton({
  postId,
  likedByMe,
  likeCount,
  variant = "row",
}: {
  postId: string;
  likedByMe: boolean;
  likeCount: number;
  /** "row": full-width Facebook-style action bar button. "compact": icon + count only. */
  variant?: "row" | "compact";
}) {
  const [pending, startTransition] = useTransition();

  if (variant === "compact") {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleLike(postId))}
        className={cn(
          "flex items-center gap-1.5 text-xs transition-colors disabled:opacity-60",
          likedByMe ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <ThumbsUp className={cn("h-3.5 w-3.5", likedByMe && "fill-primary")} />
        <span>{likeCount}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleLike(postId))}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors disabled:opacity-60",
        likedByMe ? "text-primary" : "text-muted-foreground hover:bg-secondary"
      )}
    >
      <ThumbsUp className={cn("h-[18px] w-[18px]", likedByMe && "fill-primary")} />
      Like
    </button>
  );
}
