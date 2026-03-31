"use client";

import * as React from "react";
import { APP_NAME } from "@/lib/mockData";
import { BottomNav } from "./BottomNav";
import { usePathname } from "next/navigation";

export function AppShell({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-stone-50 to-amber-50">
      <div className="pointer-events-none absolute inset-0 opacity-100 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_85%_25%,rgba(245,158,11,0.12),transparent_45%)]" />
      <header className="relative px-4 pt-3 sm:pt-5">
        <div className="mx-auto w-full max-w-xl sm:max-w-3xl flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
                <span className="text-sm font-black">FN</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-900/70 tracking-wide">FasalNirnay</p>
                <h1 className="text-base font-extrabold text-emerald-950 leading-tight">
                  {APP_NAME}
                </h1>
              </div>
            </div>
            {subtitle ? (
              <p className="mt-1 text-xs text-emerald-950/60">{subtitle}</p>
            ) : null}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="rounded-2xl border border-emerald-100 bg-white/70 px-3 py-2 text-xs font-semibold text-emerald-900/70">
              Prototype • Mock data
            </div>
          </div>
        </div>
      </header>

      <main className="relative px-4 pb-24 pt-4 sm:pt-6 sm:pb-10">
        <div className="mx-auto w-full max-w-xl sm:max-w-3xl" key={pathname}>
          <div className="animate-fade-up">{children}</div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

