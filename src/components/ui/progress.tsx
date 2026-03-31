import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
}: {
  value: number; // 0..100
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const color =
    v >= 80 ? "bg-emerald-600" : v >= 60 ? "bg-emerald-500" : v >= 40 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className={cn("h-3 w-full rounded-full bg-emerald-100/80", className)}>
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${v}%` }} />
    </div>
  );
}

