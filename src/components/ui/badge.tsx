import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-emerald-200 bg-emerald-50 text-emerald-900",
        outline: "border-emerald-200 bg-transparent text-emerald-900",
        subtle: "border-transparent bg-stone-50/80 text-emerald-900",
        high: "border-red-200 bg-red-50 text-red-800",
        watch: "border-amber-200 bg-amber-50 text-amber-900",
        info: "border-sky-200 bg-sky-50 text-sky-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

