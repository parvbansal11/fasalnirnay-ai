import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:pointer-events-none disabled:opacity-50 ring-offset-background transform-gpu active:scale-[0.98] active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-700 text-white hover:bg-emerald-800 shadow-[0_12px_35px_rgba(16,185,129,0.20)] hover:shadow-[0_16px_45px_rgba(16,185,129,0.26)]",
        secondary: "bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
        outline: "border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50",
        ghost: "text-emerald-800 hover:bg-emerald-50/80",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        subtle: "bg-stone-50/80 text-emerald-900 hover:bg-stone-50",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

