"use client";

import * as React from "react";
import { Cloud, CloudRain, TriangleAlert, Shield, Thermometer, Droplet, Leaf } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionHeader } from "@/components/app/SectionHeader";
import { useFarmerProfile } from "@/lib/useFarmerProfile";
import { getRecommendedCrops } from "@/lib/advisoryEngine";
import { getWeatherRiskReport } from "@/lib/weatherEngine";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function severityToBadgeVariant(sev: "Info" | "Watch" | "High") {
  if (sev === "High") return "high";
  if (sev === "Watch") return "watch";
  return "info";
}

export default function WeatherPage() {
  const { profile, isLoaded } = useFarmerProfile();
  const advisories = React.useMemo(() => getRecommendedCrops(profile), [profile]);
  const best = advisories[0];

  const report = React.useMemo(
    () =>
      getWeatherRiskReport(profile, {
        cropName: best?.cropName ?? profile.currentCrop,
        waterNeed: best?.waterNeed ?? "Moderate",
        riskLevel: best?.riskLevel ?? "Medium",
      }),
    [profile, best?.cropName, best?.riskLevel, best?.waterNeed]
  );

  const topAlert = report.riskAlerts[0];

  return (
    <AppShell subtitle={`Weather alerts • ${best?.cropName ?? profile.currentCrop}`}>
      <div className="space-y-5">
        <SectionHeader
          title="Weather & Risk"
          subtitle="Color-coded warnings and farming actions from prototype forecasts."
        />

        {!isLoaded ? (
          <Card className="p-5 rounded-3xl border-emerald-100 bg-white/80">
            <div className="space-y-3">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-32 w-full" />
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-5 rounded-3xl border-emerald-100 bg-white/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <CloudRain size={18} />
                </div>
                <p className="text-sm font-extrabold text-emerald-950">{report.summary.headline}</p>
              </div>
              <p className="mt-2 text-xs text-emerald-950/60">
                Rain chance today: <span className="font-extrabold text-emerald-950">{report.summary.rainTodayPct}%</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="subtle">Avg min {Math.round(report.summary.avgMinC)}°C</Badge>
                <Badge variant="subtle">Avg max {Math.round(report.summary.avgMaxC)}°C</Badge>
                <Badge variant={severityToBadgeVariant(topAlert?.severity ?? "Info")}>
                  {topAlert?.severity ?? "Info"}
                </Badge>
              </div>
            </div>
            <div className="hidden sm:block rounded-3xl border border-emerald-100 bg-white/70 p-3 text-emerald-700">
              <Thermometer size={20} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {report.days.map((d) => {
              const rainy = d.rainProbabilityPct >= 70;
              const isWatch = d.rainProbabilityPct >= 55;
              const bg = rainy
                ? "bg-red-50 border-red-200 text-red-800"
                : isWatch
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900";
              const icon =
                d.condition === "Storm" ? <TriangleAlert size={16} /> : d.condition === "Rain" ? <Droplet size={16} /> : <Cloud size={16} />;
              return (
                <div key={d.label} className="rounded-3xl border border-emerald-100 bg-white/60 p-3 text-center">
                  <p className="text-[11px] font-extrabold text-emerald-950/60">{d.label}</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <span className={["inline-flex items-center justify-center w-6 h-6 rounded-2xl border", bg].join(" ")}>
                      {icon}
                    </span>
                    <p className="text-xs font-extrabold text-emerald-950">{d.rainProbabilityPct}%</p>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-950/55">
                    {d.minC}°/{d.maxC}°
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
        )}

        <SectionHeader title="Risk alerts" subtitle="What to watch in your farm window." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.riskAlerts.map((a) => (
            <Card
              key={a.title}
              className={[
                "p-4 rounded-3xl border-emerald-100",
                a.severity === "High"
                  ? "bg-red-50/40 border-red-200"
                  : a.severity === "Watch"
                    ? "bg-amber-50/40 border-amber-200"
                    : "bg-emerald-50/40 border-emerald-200",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    {a.severity === "High" ? (
                      <span className="text-red-700">
                        <TriangleAlert size={18} />
                      </span>
                    ) : a.severity === "Watch" ? (
                      <span className="text-amber-700">
                        <TriangleAlert size={18} />
                      </span>
                    ) : (
                      <span className="text-emerald-700">
                        <Shield size={18} />
                      </span>
                    )}
                    <p className="text-sm font-extrabold text-emerald-950">{a.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-emerald-950/65">{a.detail}</p>
                </div>
                <Badge variant={severityToBadgeVariant(a.severity)}>{a.severity}</Badge>
              </div>
            </Card>
          ))}
        </div>

        <SectionHeader title="Farming recommendations" subtitle="Simple, actionable steps from the forecast." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {report.farmingRecommendations.slice(0, 6).map((r, idx) => (
            <Card key={r + idx} className="p-4 rounded-3xl border-emerald-100 bg-white/80">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Leaf size={18} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-emerald-950/60">Action {idx + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-950/80">{r}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

