import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-[100px] w-full rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm outline-none ring-offset-background transition-colors placeholder:text-emerald-900/40 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
        className
      )}
      {...props}
    />
  );
}

