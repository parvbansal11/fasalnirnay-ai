import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-5", className)}>
      <div className="flex items-baseline gap-3">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-950">
          {title}
        </h2>
        <div className="hidden sm:block h-1.5 w-10 rounded-full bg-emerald-600/30" />
      </div>
      {subtitle ? (
        <p className="mt-1 text-sm sm:text-[15px] text-emerald-950/60 leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

