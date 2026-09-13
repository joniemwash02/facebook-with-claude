"use client";

import { useRef, useState, useTransition } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/app/actions/posts";

export function PostComposer({
  user,
}: {
  user: { id: string; name: string; image?: string | null };
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [showImageField, setShowImageField] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createPost(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      setImageUrl("");
      setShowImageField(false);
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <Avatar src={user.image} seed={user.id} name={user.name} size={40} />
        <Textarea
          name="content"
          placeholder={`What's on your mind, ${user.name.split(" ")[0]}?`}
          maxLength={2000}
          rows={2}
          className="flex-1 resize-none rounded-full border-none bg-secondary px-4 py-2.5 focus-visible:ring-0"
        />
      </div>

      {showImageField && (
        <div className="mt-3 flex items-center gap-2 pl-[52px]">
          <Input
            name="image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste an image URL…"
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => {
              setShowImageField(false);
              setImageUrl("");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary shrink-0"
            aria-label="Remove photo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {imageUrl && (
        <div className="mt-2 pl-[52px]">
          <img
            src={imageUrl}
            alt=""
            className="max-h-64 rounded-lg border border-border object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      )}

      {error && <p className="mt-2 pl-[52px] text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <button
          type="button"
          onClick={() => setShowImageField((v) => !v)}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
        >
          <ImageIcon className="h-5 w-5 text-green-600" />
          Photo
        </button>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Posting…" : "Post"}
        </Button>
      </div>
    </form>
  );
}
