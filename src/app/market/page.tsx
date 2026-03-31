"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Coins, TrendingUp, Clock, MapPin } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionHeader } from "@/components/app/SectionHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFarmerProfile } from "@/lib/useFarmerProfile";
import { getRecommendedCrops } from "@/lib/advisoryEngine";
import { getMandiTrend, getMarketDecision, type MarketDecision } from "@/lib/marketEngine";
import { MandiLineChart } from "@/components/market/MandiLineChart";
import { MandiBarChart } from "@/components/market/MandiBarChart";
import { Skeleton } from "@/components/ui/skeleton";

function lastPrice(points: { priceINRPerQuintal: number }[]) {
  if (!points.length) return 0;
  return points[points.length - 1]!.priceINRPerQuintal;
}

function decisionBadgeVariant(decision: MarketDecision["decision"]) {
  if (decision === "Sell Now") return "high";
  if (decision === "Wait") return "watch";
  return "info";
}

export default function MarketPage() {
  const { profile, isLoaded } = useFarmerProfile();

  const advisories = React.useMemo(() => getRecommendedCrops(profile), [profile]);
  const best = advisories[0];

  const focusCrops = React.useMemo(() => {
    const unique = new Map<string, string>();
    for (const a of advisories.slice(0, 4)) unique.set(a.cropName, a.cropName);
    unique.set(profile.currentCrop, profile.currentCrop);
    return Array.from(unique.values()).slice(0, 5);
  }, [advisories, profile.currentCrop]);

  const [focusCrop, setFocusCrop] = React.useState<string>("");

  React.useEffect(() => {
    if (!focusCrop && best?.cropName) setFocusCrop(best.cropName);
  }, [best?.cropName, focusCrop]);

  const trend = React.useMemo(() => getMandiTrend(focusCrop), [focusCrop]);
  const decision = React.useMemo(() => getMarketDecision(profile, focusCrop), [profile, focusCrop]);

  const comparisonData = React.useMemo(() => {
    return advisories.slice(0, 3).map((a) => {
      const points = getMandiTrend(a.cropName);
      return {
        cropName: a.cropName,
        priceINRPerQuintal: lastPrice(points),
      };
    });
  }, [advisories]);

  return (
    <AppShell subtitle={`Market intelligence • ${profile.location}`}>
      <div className="space-y-5">
        <SectionHeader
          title="Mandi price insights"
          subtitle="Prototype trend cards + simple charts and action hints."
        />

        {!isLoaded ? <Skeleton className="h-24" /> : null}

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-950/55">Focus crop</p>
            <h2 className="text-lg font-extrabold text-emerald-950">{focusCrop || best?.cropName}</h2>
          </div>
          {best ? <Badge variant={decisionBadgeVariant(decision.decision)}>{decision.decision}</Badge> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {focusCrops.map((c) => {
            const active = c === focusCrop;
            return (
              <button
                key={c}
                onClick={() => setFocusCrop(c)}
                className={[
                  "px-3 py-2 rounded-full text-xs font-extrabold border transition-colors",
                  active
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white/70 border-emerald-100 text-emerald-900 hover:bg-white",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>

        <Card className="p-4 rounded-3xl border-emerald-100 bg-white/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Coins size={18} />
              </div>
              <div>
                <p className="text-sm font-extrabold text-emerald-950">Decision</p>
                <p className="mt-1 text-xs text-emerald-950/60">{decision.reason}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-2xl">
              <span className="inline-flex items-center gap-2">
                <Bell size={16} />
                Enable alerts
              </span>
            </Button>
          </div>

          {trend.length ? (
            <div className="mt-3">
              <MandiLineChart data={trend} height={240} />
            </div>
          ) : (
            <div className="mt-3 text-sm text-emerald-950/60">No chart data for this crop in prototype.</div>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-4 rounded-3xl border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-emerald-950/80">Likely price rise</p>
                <p className="mt-2 text-sm font-semibold text-emerald-950/80">{decision.alerts.likelyPriceRise}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 rounded-3xl border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-800 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-emerald-950/80">Likely price drop</p>
                <p className="mt-2 text-sm font-semibold text-emerald-950/80">{decision.alerts.likelyPriceDrop}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 rounded-3xl border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-xs font-extrabold text-emerald-950/80">Nearby mandi better pricing</p>
                <p className="mt-2 text-sm font-semibold text-emerald-950/80">{decision.alerts.nearbyMandiBetterPricing}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4 rounded-3xl border-emerald-100 bg-white/80">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-emerald-950">Compare current prices</p>
              <p className="mt-1 text-xs text-emerald-950/60">Top recommended crops snapshot (prototype).</p>
            </div>
            <Link href="/advisory" className="text-sm font-extrabold text-emerald-700">
              Crop cards →
            </Link>
          </div>
          <div className="mt-3">
            <MandiBarChart data={comparisonData} height={220} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

