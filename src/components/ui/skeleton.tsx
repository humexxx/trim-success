import { cn } from "@/lib/utils";

/**
 * Lightweight loading placeholder — animated muted block. Drop in to
 * reserve layout space while real content is being fetched.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
