"use client";

import { useState, useTransition } from "react";
import { MessageCircle, Share2, Trash2, ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { LikeButton } from "@/components/feed/like-button";
import { CommentForm } from "@/components/feed/comment-form";
import { deletePost } from "@/app/actions/posts";
import { cn } from "@/lib/utils";

type CommentItem = {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; name: string; image: string | null };
};

export function PostCard({
  post,
  currentUserId,
}: {
  post: {
    id: string;
    content: string | null;
    image: string | null;
    createdAt: Date;
    author: { id: string; name: string; image: string | null; username: string | null };
    authorId: string;
    likeCount: number;
    likedByMe: boolean;
    commentCount: number;
    recentComments: CommentItem[];
  };
  currentUserId: string;
}) {
  const [showComments, setShowComments] = useState(false);
  const [deleting, startDeleteTransition] = useTransition();
  const isOwner = post.authorId === currentUserId;

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar src={post.author.image} seed={post.author.id} name={post.author.name} size={40} />
            <div>
              <p className="text-sm font-semibold">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {post.createdAt.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              type="button"
              disabled={deleting}
              onClick={() => startDeleteTransition(() => deletePost(post.id))}
              className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-60"
              aria-label="Delete post"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {post.content && <p className="mt-3 text-sm whitespace-pre-wrap">{post.content}</p>}
      </CardContent>

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full max-h-[520px] object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      <CardContent className="pt-3">
        {(post.likeCount > 0 || post.commentCount > 0) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
            <span className="flex items-center gap-1">
              {post.likeCount > 0 && (
                <>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                    <ThumbsUp className="h-2.5 w-2.5 fill-white text-white" />
                  </span>
                  {post.likeCount}
                </>
              )}
            </span>
            {post.commentCount > 0 && (
              <button onClick={() => setShowComments((v) => !v)} className="hover:underline">
                {post.commentCount} comment{post.commentCount === 1 ? "" : "s"}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center border-t border-border pt-1">
          <LikeButton postId={post.id} likedByMe={post.likedByMe} likeCount={post.likeCount} variant="row" />
          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors",
              showComments ? "text-primary" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <MessageCircle className="h-[18px] w-[18px]" />
            Comment
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
          >
            <Share2 className="h-[18px] w-[18px]" />
            Share
          </button>
        </div>

        {showComments && (
          <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
            {post.recentComments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No comments yet.</p>
            ) : (
              post.recentComments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <Avatar
                    src={comment.author.image}
                    seed={comment.author.id}
                    name={comment.author.name}
                    size={28}
                  />
                  <div className="rounded-2xl bg-secondary px-3 py-1.5 text-sm">
                    <span className="font-semibold">{comment.author.name}</span>{" "}
                    <span>{comment.content}</span>
                  </div>
                </div>
              ))
            )}
            {post.commentCount > post.recentComments.length && (
              <p className="text-xs text-muted-foreground pl-[38px]">
                {post.commentCount - post.recentComments.length} more comment
                {post.commentCount - post.recentComments.length === 1 ? "" : "s"}
              </p>
            )}
            <CommentForm postId={post.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
