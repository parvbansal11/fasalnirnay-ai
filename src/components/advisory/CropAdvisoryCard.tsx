"use client";

import * as React from "react";
import { Droplet, LineChart, Shield, Waves } from "lucide-react";
import type { CropAdvisory, RiskLevel } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function riskBadgeVariant(risk: RiskLevel) {
  if (risk === "Low") return "info";
  if (risk === "Medium") return "watch";
  return "high";
}

export function CropAdvisoryCard({
  advisory,
}: {
  advisory: CropAdvisory;
}) {
  return (
    <Card
      className={cn(
        "p-4 rounded-3xl border-emerald-100 transition-shadow",
        advisory.bestChoice
          ? "border-emerald-300 shadow-[0_18px_60px_rgba(5,150,105,0.16)]"
          : "shadow-sm"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-emerald-950">
              {advisory.cropName}
            </h3>
            {advisory.bestChoice ? (
              <Badge variant="default" className="bg-emerald-600 text-white border-emerald-600">
                Best Choice
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-emerald-950/60">
            {advisory.recommendationReason}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={riskBadgeVariant(advisory.riskLevel)}>
            {advisory.riskLevel} Risk
          </Badge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-emerald-100 bg-white/60 p-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700">
              <LineChart size={16} />
            </span>
            <p className="text-xs font-semibold text-emerald-950/70">Expected yield</p>
          </div>
          <p className="mt-2 text-lg font-extrabold text-emerald-950">
            {advisory.expectedYieldTonsPerHa} t/ha
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/60 p-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700">
              <Waves size={16} />
            </span>
            <p className="text-xs font-semibold text-emerald-950/70">Water need</p>
          </div>
          <p className="mt-2 text-lg font-extrabold text-emerald-950">{advisory.waterNeed}</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/60 p-3 col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700">
                <Droplet size={16} />
              </span>
              <p className="text-xs font-semibold text-emerald-950/70">Market demand</p>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-700" />
              <p className="text-sm font-extrabold text-emerald-950">
                {advisory.marketDemand}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

