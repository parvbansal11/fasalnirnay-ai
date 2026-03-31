"use client";

import * as React from "react";
import Link from "next/link";
import {
  CloudRain,
  LineChart,
  Leaf,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionHeader } from "@/components/app/SectionHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useFarmerProfile } from "@/lib/useFarmerProfile";
import { getDashboardStats } from "@/lib/advisoryEngine";
import { getMandiTrend } from "@/lib/marketEngine";
import { MandiLineChart } from "@/components/market/MandiLineChart";
import { getWeatherRiskReport } from "@/lib/weatherEngine";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function marketDecisionBadgeVariant(decision: "Sell Now" | "Wait" | "Monitor") {
  if (decision === "Sell Now") return "high";
  if (decision === "Wait") return "watch";
  return "info";
}

function severityToBadgeVariant(sev: "Info" | "Watch" | "High" | undefined) {
  if (sev === "High") return "high";
  if (sev === "Watch") return "watch";
  return "info";
}

export default function DashboardPage() {
  const { profile, isLoaded } = useFarmerProfile();

  const stats = React.useMemo(() => getDashboardStats(profile), [profile]);
  const trend = React.useMemo(() => getMandiTrend(stats.bestCrop.cropName), [stats.bestCrop.cropName]);
  const weather = React.useMemo(
    () =>
      getWeatherRiskReport(profile, {
        cropName: stats.bestCrop.cropName,
        waterNeed: stats.bestCrop.waterNeed,
        riskLevel: stats.bestCrop.riskLevel,
      }),
    [profile, stats.bestCrop.cropName, stats.bestCrop.waterNeed, stats.bestCrop.riskLevel]
  );

  if (!isLoaded) {
    return (
      <AppShell subtitle="Loading your mock advisory...">
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-44" />
        </div>
      </AppShell>
    );
  }

  const topWeatherAlert = weather.riskAlerts[0];
  const marketDecision = stats.marketDecisionForCurrentCrop;

  return (
    <AppShell subtitle={`Farm profile • ${profile.location}`}>
      <div className="space-y-6">
        {/* Profile / greeting */}
        <Card className="p-5 rounded-3xl border-emerald-100 bg-white/80">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-950/55">
                Farmer dashboard • decision cockpit
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-emerald-950">
                {stats.greeting}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="subtle">{profile.currentCrop}</Badge>
                <Badge variant="outline">Soil: {profile.soilType}</Badge>
                <Badge variant="outline">Sowing: {profile.sowingMonth}</Badge>
                <Badge variant="outline" className="hidden sm:inline-flex">
                  Land: {profile.landSizeHa.toFixed(1)} ha
                </Badge>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="rounded-3xl bg-emerald-600/10 border border-emerald-200 p-3 text-emerald-700">
                <Sparkles size={18} />
              </div>
            </div>
          </div>
        </Card>

        {/* Cockpit overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-7 space-y-3">
            <SectionHeader
              title="Farmer decision cockpit"
              subtitle="Confidence, profit, weather risk, and market action—at a glance."
              className="mb-0"
            />

            <Card className="p-4 rounded-3xl border-emerald-100 bg-white/80">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/70 to-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-950/60">Confidence</p>
                      <p className="mt-1 text-2xl font-extrabold text-emerald-950">
                        {stats.confidenceScore}%
                      </p>
                    </div>
                    <div className="text-emerald-700">
                      <Sparkles size={20} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={stats.confidenceScore} />
                  </div>
                  <p className="mt-2 text-[11px] text-emerald-950/55">
                    Fit for your soil + season timing (prototype).
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-amber-50/80 to-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-950/60">Profit estimate</p>
                      <p className="mt-1 text-2xl font-extrabold text-emerald-950 leading-tight">
                        {formatINR(stats.estimatedProfitRangeINR.low)}
                        <span className="text-xs font-extrabold text-emerald-950/55"> - </span>
                        {formatINR(stats.estimatedProfitRangeINR.high)}
                      </p>
                    </div>
                    <div className="text-emerald-700">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-emerald-950/55">
                    Based on your land size: {profile.landSizeHa.toFixed(1)} ha.
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-sky-50/70 to-white p-4 col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-950/60">Weather alert</p>
                      <p className="mt-1 text-base font-extrabold text-emerald-950">
                        {weather.summary.headline}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge
                          variant={severityToBadgeVariant(topWeatherAlert?.severity)}
                          className="font-extrabold"
                        >
                          {topWeatherAlert?.severity ?? "Info"}
                        </Badge>
                        <Badge variant="subtle">Rain today: {weather.summary.rainTodayPct}%</Badge>
                        <Badge variant="outline" className="hidden sm:inline-flex">
                          Avg: {Math.round(weather.summary.avgMinC)}° - {Math.round(weather.summary.avgMaxC)}°
                        </Badge>
                      </div>
                    </div>
                    <div className="text-emerald-700">
                      <CloudRain size={22} />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {weather.days.slice(0, 3).map((d) => {
                      const isRainy = d.rainProbabilityPct >= 70;
                      const isWatch = d.rainProbabilityPct >= 55;
                      const bg = isRainy
                        ? "bg-red-50/60 border-red-200 text-red-800"
                        : isWatch
                          ? "bg-amber-50/60 border-amber-200 text-amber-900"
                          : "bg-emerald-50/60 border-emerald-200 text-emerald-900";
                      return (
                        <div
                          key={d.label}
                          className={`rounded-2xl border p-2 text-center ${bg}`}
                        >
                          <p className="text-[11px] font-extrabold">{d.label}</p>
                          <p className="mt-1 text-sm font-extrabold">{d.rainProbabilityPct}%</p>
                          <p className="text-[10px] font-semibold opacity-80">{d.condition}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-950/60">Market action</p>
                      <p className="mt-1 text-lg font-extrabold text-emerald-950">
                        {marketDecision.decision}
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-950/55 line-clamp-2">
                        {marketDecision.reason}
                      </p>
                    </div>
                    <div className="text-emerald-700">
                      <LineChart size={20} />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant={marketDecisionBadgeVariant(marketDecision.decision)}>
                      {marketDecision.decision === "Sell Now" ? "Act now" : marketDecision.decision}
                    </Badge>
                    <Link href="/market" className="text-xs font-extrabold text-emerald-700">
                      Open →
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white/70 p-4">
                  <p className="text-xs font-semibold text-emerald-950/60">Crop suitability</p>
                  <p className="mt-1 text-2xl font-extrabold text-emerald-950">
                    {stats.cropSuitabilityPct}%
                  </p>
                  <p className="mt-2 text-[11px] text-emerald-950/55">
                    Season fit + demand + risk (prototype).
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant="subtle">{stats.bestCrop.marketDemand} demand</Badge>
                    <Link href="/advisory" className="text-xs font-extrabold text-emerald-700">
                      Advice →
                    </Link>
                  </div>
                </div>
              </div>
            </Card>

            {/* Today's Recommended Action */}
            <div className="space-y-3">
              <SectionHeader
                title="Today’s Recommended Action"
                subtitle="Your single best move, aligned to weather + mandi signals."
              />

              <Card className="p-5 rounded-3xl border-emerald-100 bg-gradient-to-b from-emerald-600/10 via-white to-white shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={marketDecisionBadgeVariant(marketDecision.decision)}>
                        {marketDecision.decision}
                      </Badge>
                      <Badge variant={severityToBadgeVariant(topWeatherAlert?.severity)}>
                        {topWeatherAlert?.severity ?? "Info"}
                      </Badge>
                      <Badge variant="subtle">{stats.bestCrop.cropName}</Badge>
                    </div>

                    <h3 className="mt-3 text-xl font-extrabold tracking-tight text-emerald-950">
                      Do this next
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-emerald-950/80 leading-relaxed">
                      {stats.suggestedAction}
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {weather.riskAlerts.slice(0, 2).map((a) => (
                        <div
                          key={a.title}
                          className={[
                            "rounded-3xl border p-3",
                            a.severity === "High"
                              ? "border-red-200 bg-red-50/60"
                              : a.severity === "Watch"
                                ? "border-amber-200 bg-amber-50/60"
                                : "border-emerald-200 bg-emerald-50/60",
                          ].join(" ")}
                        >
                          <p className="text-[11px] font-extrabold text-emerald-950/70">
                            {a.title}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold text-emerald-950/55 line-clamp-2">
                            {a.detail}
                          </p>
                        </div>
                      ))}
                      {weather.riskAlerts.length < 2 ? (
                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-3">
                          <p className="text-[11px] font-extrabold text-emerald-950/70">No major risks</p>
                          <p className="mt-1 text-[11px] font-semibold text-emerald-950/55">
                            Keep a routine and monitor changes.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="hidden sm:block rounded-3xl border border-emerald-200 bg-white/70 px-4 py-3 text-emerald-700">
                    <ShieldCheck size={22} />
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-xs text-emerald-950/60">
                    Confidence {stats.confidenceScore}% • Profit{" "}
                    <span className="font-extrabold text-emerald-950">
                      {formatINR(stats.estimatedProfitRangeINR.low)} - {formatINR(stats.estimatedProfitRangeINR.high)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/weather">
                      <Button size="sm" className="rounded-2xl">
                        Weather alerts →
                      </Button>
                    </Link>
                    <Link href="/market">
                      <Button size="sm" variant="outline" className="rounded-2xl">
                        Mandi action →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Side cards */}
          <div className="lg:col-span-5 space-y-3">
            <SectionHeader
              title="Signals & recommendations"
              subtitle="Crop fit and mandi movement for your next decision."
            />

            <Link href="/advisory" className="block">
              <Card className="p-4 rounded-3xl border-emerald-100 bg-white/80 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-950">Crop recommendation</p>
                    <p className="mt-1 text-xs text-emerald-950/60">Best choice for your inputs</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                        <Leaf size={20} />
                      </div>
                      <div>
                        <p className="text-base font-extrabold text-emerald-950">
                          {stats.bestCrop.cropName}
                        </p>
                        <p className="text-xs text-emerald-950/60">
                          Expected yield: <span className="font-extrabold">{stats.bestCrop.expectedYieldTonsPerHa} t/ha</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="subtle">{stats.bestCrop.riskLevel} risk</Badge>
                </div>

                <div className="mt-3 rounded-3xl border border-emerald-100 bg-emerald-50/40 p-3">
                  <p className="text-[11px] font-extrabold text-emerald-950/60">Recommendation reason</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-950/80 line-clamp-3">
                    {stats.bestCrop.recommendationReason}
                  </p>
                </div>
              </Card>
            </Link>

            <Link href="/market" className="block">
              <Card className="p-4 rounded-3xl border-emerald-100 bg-white/80 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-950">Mandi price trend</p>
                    <p className="mt-1 text-xs text-emerald-950/60">
                      Prototype trend for <span className="font-extrabold">{stats.bestCrop.cropName}</span>
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                        <LineChart size={18} />
                      </div>
                      <Badge variant={marketDecisionBadgeVariant(marketDecision.decision)}>
                        {marketDecision.decision}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    Last 6 months
                  </Badge>
                </div>

                {trend.length ? (
                  <div className="mt-3">
                    <MandiLineChart data={trend} height={160} />
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-emerald-950/60">No chart data in prototype.</div>
                )}
              </Card>
            </Link>

            <Link href="/weather" className="block">
              <Card className="p-4 rounded-3xl border-emerald-100 bg-white/80 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-emerald-950">Weather-driven steps</p>
                    <p className="mt-1 text-xs text-emerald-950/60">
                      Next actions for <span className="font-extrabold">{stats.bestCrop.cropName}</span>
                    </p>
                  </div>
                  <Badge variant={severityToBadgeVariant(topWeatherAlert?.severity)}>
                    {topWeatherAlert?.severity ?? "Info"}
                  </Badge>
                </div>
                <div className="mt-3 space-y-2">
                  {weather.farmingRecommendations.slice(0, 3).map((r, idx) => (
                    <div key={r + idx} className="flex items-start gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/30 p-3">
                      <div className="h-9 w-9 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center font-extrabold">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-semibold text-emerald-950/80 leading-relaxed">
                        {r}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </Link>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-emerald-950/55">
            Want deeper details? Open Advisory for full crop cards.
          </p>
          <Link href="/advisory" className="text-sm font-extrabold text-emerald-700">
            View crop cards →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

