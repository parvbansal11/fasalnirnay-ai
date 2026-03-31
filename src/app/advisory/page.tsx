"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Leaf, LineChart } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SectionHeader } from "@/components/app/SectionHeader";
import { CropAdvisoryCard } from "@/components/advisory/CropAdvisoryCard";
import { useFarmerProfile } from "@/lib/useFarmerProfile";
import { getRecommendedCrops } from "@/lib/advisoryEngine";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvisoryPage() {
  const { profile, isLoaded } = useFarmerProfile();

  const advisories = React.useMemo(() => getRecommendedCrops(profile), [profile]);
  const best = advisories[0];

  return (
    <AppShell subtitle={`Crop advisory • ${profile.sowingMonth}`}>
      <div className="space-y-5">
        <SectionHeader
          title="Recommended crops"
          subtitle="Believable prototype cards for an investor-grade demo."
        />

        {!isLoaded ? (
          <Skeleton className="h-24" />
        ) : null}

        {best ? (
          <Card className="p-5 rounded-3xl border-emerald-200 bg-white/80">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-emerald-600 text-white border-emerald-600">
                    Best Choice
                  </Badge>
                  <Badge variant="outline">{best.marketDemand} demand</Badge>
                </div>
                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-emerald-950">
                  {best.cropName}
                </h2>
                <p className="mt-1 text-sm text-emerald-950/65">
                  {best.recommendationReason}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge variant="subtle">Expected: {best.expectedYieldTonsPerHa} t/ha</Badge>
                  <Badge variant="subtle">Water: {best.waterNeed}</Badge>
                  <Badge variant="subtle">Risk: {best.riskLevel}</Badge>
                </div>
              </div>
              <div className="hidden sm:block h-12 w-12 rounded-2xl bg-emerald-600/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Link href="/market" className="flex-1">
                <button className="w-full h-11 rounded-2xl border border-emerald-200 bg-white/70 text-emerald-900 font-extrabold text-sm hover:bg-white transition-colors">
                  <span className="inline-flex items-center justify-center gap-2">
                    <LineChart size={18} />
                    Check mandi trend
                  </span>
                </button>
              </Link>
              <Link href="/weather" className="flex-1">
                <button className="w-full h-11 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm hover:bg-emerald-700 transition-colors">
                  <span className="inline-flex items-center justify-center gap-2">
                    <Leaf size={18} />
                    Weather risk
                    <ArrowRight size={18} />
                  </span>
                </button>
              </Link>
            </div>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {advisories.map((a) => (
            <div key={a.cropName}>
              <CropAdvisoryCard advisory={a} />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

