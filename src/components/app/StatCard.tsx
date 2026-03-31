import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon,
  hint,
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-4 rounded-3xl", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-emerald-950/60">{label}</p>
          <p className="mt-1 text-lg font-extrabold text-emerald-950">{value}</p>
          {hint ? <p className="mt-1 text-xs text-emerald-950/55">{hint}</p> : null}
        </div>
        {icon ? <div className="text-emerald-700">{icon}</div> : null}
      </div>
    </Card>
  );
}

