"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Droplets,
  Leaf,
  MapPin,
  Scale,
  Sparkles,
  Sprout,
  Tractor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGE_OPTIONS, MONTHS, SOIL_OPTIONS, TAGLINE } from "@/lib/mockData";
import type { FarmerProfile, PreferredLanguage, SoilType } from "@/lib/types";
import { saveFarmerProfile } from "@/lib/profileStorage";
import { getDashboardStats } from "@/lib/advisoryEngine";
import { getMandiTrend } from "@/lib/marketEngine";
import { getWeatherRiskReport } from "@/lib/weatherEngine";
import { MandiLineChart } from "@/components/market/MandiLineChart";
import { Progress } from "@/components/ui/progress";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function decisionBadgeVariant(decision: "Sell Now" | "Wait" | "Monitor") {
  if (decision === "Sell Now") return "high";
  if (decision === "Wait") return "watch";
  return "info";
}

function Field({
  label,
  hint,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-emerald-700/85">{icon}</span> : null}
          <label className="text-sm font-extrabold text-emerald-950/85">{label}</label>
        </div>
        {hint ? <span className="text-xs text-emerald-950/55">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  const [location, setLocation] = React.useState("Nashik, Maharashtra");
  const [landSizeHa, setLandSizeHa] = React.useState("1.2");
  const [currentCrop, setCurrentCrop] = React.useState("Cotton");
  const [sowingMonth, setSowingMonth] = React.useState("April");
  const [soilType, setSoilType] = React.useState<SoilType>("Black");
  const [preferredLanguage, setPreferredLanguage] = React.useState<PreferredLanguage>(
    "English"
  );

  const [error, setError] = React.useState<string | null>(null);

  const submit = () => {
    setError(null);
    const parsedSize = Number(landSizeHa);
    if (!location.trim()) return setError("Please add your location.");
    if (!Number.isFinite(parsedSize) || parsedSize <= 0)
      return setError("Please enter a valid land size (hectares).");
    if (!currentCrop.trim()) return setError("Please tell us your current crop.");
    if (!sowingMonth.trim()) return setError("Please select your sowing month.");
    if (!soilType) return setError("Please select your soil type.");

    const profile: FarmerProfile = {
      location: location.trim(),
      landSizeHa: parsedSize,
      currentCrop: currentCrop.trim(),
      sowingMonth,
      soilType,
      preferredLanguage,
    };

    saveFarmerProfile(profile);
    router.push("/dashboard");
  };

  const draftProfile = React.useMemo<FarmerProfile>(() => {
    const parsedSize = Number(landSizeHa);
    const safeSize = Number.isFinite(parsedSize) && parsedSize > 0 ? parsedSize : 1.0;
    return {
      location: location.trim() || "Nashik, Maharashtra",
      landSizeHa: safeSize,
      currentCrop: currentCrop.trim() || "Cotton",
      sowingMonth: sowingMonth || "April",
      soilType: soilType || "Black",
      preferredLanguage,
    };
  }, [currentCrop, landSizeHa, location, preferredLanguage, soilType, sowingMonth]);

  const preview = React.useMemo(() => {
    const stats = getDashboardStats(draftProfile);
    const trend = getMandiTrend(stats.bestCrop.cropName);
    const weather = getWeatherRiskReport(draftProfile, {
      cropName: stats.bestCrop.cropName,
      waterNeed: stats.bestCrop.waterNeed,
      riskLevel: stats.bestCrop.riskLevel,
    });
    return { stats, trend, weather };
  }, [draftProfile]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-stone-50 to-amber-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(16,185,129,0.18),transparent_50%),radial-gradient(circle_at_92%_26%,rgba(245,158,11,0.14),transparent_45%),radial-gradient(circle_at_45%_100%,rgba(16,185,129,0.10),transparent_55%)]" />

      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-80 right-[-120px] h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:py-10 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-[0_14px_40px_rgba(16,185,129,0.25)]">
              <Sprout size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-900/70 tracking-wide">
                FasalNirnay
              </p>
              <h1 className="text-lg font-extrabold tracking-tight text-emerald-950">
                FasalNirnay AI
              </h1>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-3 py-1.5">
              <Badge variant="subtle">Premium demo</Badge>
              <span className="text-xs font-semibold text-emerald-950/60">Mock data only</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-emerald-200 bg-white/60">
                Crop Advisory
              </Badge>
              <Badge variant="outline" className="border-emerald-200 bg-white/60">
                Mandi Insights
              </Badge>
              <Badge variant="outline" className="border-emerald-200 bg-white/60">
                Weather Alerts
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-3 py-1.5">
              <Badge variant="subtle">Smart decisions</Badge>
              <span className="text-xs font-semibold text-emerald-950/60">for Indian farmers</span>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl leading-tight font-black text-emerald-950">
              {TAGLINE}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-emerald-950/65 max-w-prose">
              Enter your farm details to get crop recommendations, mandi price timing, and weather-based risk alerts that look and feel like a real product.
            </p>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-3xl border border-emerald-100 bg-white/65 p-3 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Leaf size={16} />
                  <p className="text-xs font-extrabold">Best crop fit</p>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-emerald-950/55">Season + soil ready</p>
              </div>
              <div className="rounded-3xl border border-emerald-100 bg-white/65 p-3 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Scale size={16} />
                  <p className="text-xs font-extrabold">Mandi timing</p>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-emerald-950/55">Sell, wait, monitor</p>
              </div>
              <div className="rounded-3xl border border-emerald-100 bg-white/65 p-3 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Droplets size={16} />
                  <p className="text-xs font-extrabold">Weather risk</p>
                </div>
                <p className="mt-1 text-[11px] font-semibold text-emerald-950/55">Color-coded guidance</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6">
                <Card className="rounded-3xl border-emerald-100 bg-white/80 shadow-sm backdrop-blur">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Tractor size={18} className="text-emerald-700" />
                          Farmer Inputs
                        </CardTitle>
                        <CardDescription>Used to personalize the advisory experience.</CardDescription>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-emerald-700/90">
                        <Sparkles size={16} />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <div className="grid grid-cols-1 gap-4">
                      <Field label="Location" hint="District / region" icon={<MapPin size={16} />}>
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Nashik, Maharashtra"
                          aria-label="Location"
                        />
                      </Field>

                      <Field label="Land size" hint="hectares" icon={<Scale size={16} />}>
                        <Input
                          type="number"
                          step="0.1"
                          value={landSizeHa}
                          onChange={(e) => setLandSizeHa(e.target.value)}
                          placeholder="e.g., 1.5"
                          aria-label="Land size in hectares"
                        />
                      </Field>

                      <Field label="Current crop" icon={<Leaf size={16} />}>
                        <Input
                          value={currentCrop}
                          onChange={(e) => setCurrentCrop(e.target.value)}
                          placeholder="e.g., Cotton"
                          aria-label="Current crop"
                        />
                      </Field>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Sowing month" icon={<CalendarDays size={16} />}>
                          <select
                            value={sowingMonth}
                            onChange={(e) => setSowingMonth(e.target.value)}
                            className="h-11 w-full rounded-2xl border border-emerald-100 bg-white/80 px-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
                            aria-label="Sowing month"
                          >
                            {MONTHS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Soil type" icon={<Droplets size={16} />}>
                          <select
                            value={soilType}
                            onChange={(e) => setSoilType(e.target.value as SoilType)}
                            className="h-11 w-full rounded-2xl border border-emerald-100 bg-white/80 px-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
                            aria-label="Soil type"
                          >
                            {SOIL_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <Field
                        label="Preferred language"
                        hint="For UI text only"
                        icon={<Sparkles size={16} />}
                      >
                        <select
                          value={preferredLanguage}
                          onChange={(e) =>
                            setPreferredLanguage(e.target.value as PreferredLanguage)
                          }
                          className="h-11 w-full rounded-2xl border border-emerald-100 bg-white/80 px-4 text-sm outline-none focus:border-emerald-300 focus:bg-white"
                          aria-label="Preferred language"
                        >
                          {LANGUAGE_OPTIONS.map((l) => (
                            <option key={l} value={l}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="mt-5">
                      {error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-semibold">
                          {error}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <div className="text-xs text-emerald-950/60">
                        Demo experience using your mock farm profile.
                      </div>

                      <Button
                        size="lg"
                        className="rounded-3xl group relative w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-[0_18px_60px_rgba(16,185,129,0.25)]"
                        onClick={submit}
                      >
                        <span className="relative z-10 inline-flex items-center gap-2">
                          <Sparkles size={18} />
                          Get Advisory
                        </span>
                        <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </div>

                    <div className="mt-4">
                      <Textarea
                        readOnly
                        value="Tip: After onboarding, open Market and Weather. The AI Assistant will answer using your mock farm profile."
                        className="bg-white/60 text-emerald-950/70 border-emerald-100"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-6">
                <Card className="rounded-3xl border-emerald-100 bg-white/80 shadow-sm backdrop-blur overflow-hidden">
                  <div className="p-5 pb-4 bg-gradient-to-r from-emerald-700/10 via-white to-amber-500/10">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base font-extrabold text-emerald-950">
                          Sample advisory preview
                        </CardTitle>
                        <CardDescription>Live from your current inputs.</CardDescription>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-emerald-700/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                        <Sparkles size={18} />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 pt-3 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-emerald-950/60">Best crop fit</p>
                        <h3 className="mt-1 text-xl font-extrabold tracking-tight text-emerald-950">
                          {preview.stats.bestCrop.cropName}
                        </h3>
                        <p className="mt-1 text-xs text-emerald-950/60">
                          Expected yield: <span className="font-extrabold">{preview.stats.bestCrop.expectedYieldTonsPerHa} t/ha</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={decisionBadgeVariant(preview.stats.marketDecisionForCurrentCrop.decision)}>
                          {preview.stats.marketDecisionForCurrentCrop.decision}
                        </Badge>
                        <Badge variant="subtle">{preview.stats.bestCrop.riskLevel} risk</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-emerald-950/60">Confidence score</p>
                        <p className="text-xs font-extrabold text-emerald-950">
                          {preview.stats.confidenceScore}%
                        </p>
                      </div>
                      <Progress value={preview.stats.confidenceScore} />
                      <p className="text-xs text-emerald-950/55">
                        Suitability for season + soil + weather signals (prototype logic).
                      </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-100 bg-white/70 p-4">
                      <p className="text-xs font-extrabold text-emerald-950/70">
                        Mandi trend (best crop)
                      </p>
                      <div className="mt-2">
                        <MandiLineChart data={preview.trend} height={120} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-2xl bg-emerald-700/10 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                          <Leaf size={18} />
                        </div>
                        <p className="text-xs font-extrabold text-emerald-950/70">Weather headline</p>
                      </div>
                      <p className="text-sm font-semibold text-emerald-950">
                        {preview.weather.summary.headline}
                      </p>
                      <p className="text-xs text-emerald-950/55">
                        {preview.weather.riskAlerts[0]?.title ?? "Keep an eye on alerts"} • Rain today{" "}
                        <span className="font-extrabold">{preview.weather.summary.rainTodayPct}%</span>
                      </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <p className="text-xs font-extrabold text-emerald-950/70">
                        Suggested action
                      </p>
                      <p className="mt-2 text-sm font-semibold text-emerald-950/85 leading-relaxed line-clamp-3">
                        {preview.stats.suggestedAction}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-emerald-950/60">
                          Profit range:{" "}
                          <span className="font-extrabold text-emerald-950">
                            {formatINR(preview.stats.estimatedProfitRangeINR.low)} - {formatINR(preview.stats.estimatedProfitRangeINR.high)}
                          </span>
                        </p>
                        <Badge variant="outline" className="border-emerald-200 bg-white/70">
                          Mock advisory
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-3 py-1.5">
            <Badge variant="subtle">Premium demo</Badge>
            <span className="text-xs font-semibold text-emerald-950/60">Mock data only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
