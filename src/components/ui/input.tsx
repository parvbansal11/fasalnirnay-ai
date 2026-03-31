import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-emerald-100 bg-white/80 px-4 text-sm outline-none ring-offset-background transition-colors placeholder:text-emerald-900/40 focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-500/20",
        className
      )}
      {...props}
    />
  );
}

