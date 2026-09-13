"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  src?: string | null;
  name: string;
  /** User id (or any stable string) used to generate a placeholder photo when no src is set. */
  seed?: string;
  size?: number;
}

// Deterministic placeholder photo so people without an uploaded avatar still
// look like a real profile in the UI, not a blank circle.
function fallbackPhoto(seed: string) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
}

export function Avatar({ src, name, seed, size = 40, className, ...props }: AvatarProps) {
  const [broken, setBroken] = React.useState(false);

  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const resolvedSrc = !broken ? src || (seed ? fallbackPhoto(seed) : undefined) : undefined;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-secondary-foreground font-medium",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      {...props}
    >
      {resolvedSrc ? (
        // Plain <img>, not next/image: avatar/post URLs are arbitrary and
        // user-supplied, so they can't be pre-registered in next.config's
        // remotePatterns. This is what "pictures not showing" usually is.
        <img
          src={resolvedSrc}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
}
