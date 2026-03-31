"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, CloudRain, Home, LineChart, Leaf } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const items: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: <Home size={20} /> },
  { key: "advisory", label: "Advisory", href: "/advisory", icon: <Leaf size={20} /> },
  { key: "market", label: "Market", href: "/market", icon: <LineChart size={20} /> },
  { key: "weather", label: "Weather", href: "/weather", icon: <CloudRain size={20} /> },
  { key: "assistant", label: "AI Assist", href: "/assistant", icon: <Bot size={20} /> },
];

export function BottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto w-full max-w-xl border-t border-emerald-100 bg-white/75 backdrop-blur">
        <div className="flex items-center justify-between px-2">
          {items.map((it) => {
            const active = pathname.startsWith(it.href);
            return (
              <Link
                key={it.key}
                href={it.href}
                className={[
                  "group flex flex-1 flex-col items-center justify-center gap-1 py-3 rounded-2xl transition-colors",
                  active ? "text-emerald-700" : "text-emerald-900/60 hover:text-emerald-700",
                ].join(" ")}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-2xl border transition-all duration-200",
                    active
                      ? "bg-emerald-700 border-emerald-700 text-white shadow-[0_12px_35px_rgba(16,185,129,0.22)]"
                      : "bg-white/70 border-emerald-100 text-emerald-800/80 group-hover:bg-white group-hover:border-emerald-200"
                  )}
                >
                  {it.icon}
                </span>
                <span className="text-[10px] font-semibold">{it.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

