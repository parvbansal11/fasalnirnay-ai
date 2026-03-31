import type { CropAdvisory, FarmerProfile } from "./types";
import { CROP_CATALOG, MONTHS } from "./mockData";
import { getMarketDecision } from "./marketEngine";
import { getWeatherRiskReport } from "./weatherEngine";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function monthNameToIndex(month: string) {
  const idx = MONTHS.indexOf(month as (typeof MONTHS)[number]);
  return idx >= 0 ? idx : 0;
}

function hashToUnit(s: string) {
  // Deterministic 0..1 based on input text.
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Force unsigned and map to [0,1)
  return ((h >>> 0) % 10000) / 10000;
}

function scoreForCrop(crop: (typeof CROP_CATALOG)[number], profile: FarmerProfile, rainAvgPctNext2: number) {
  const monthIdx = monthNameToIndex(profile.sowingMonth);
  const soilMatch = crop.suitableSoils.includes(profile.soilType) ? 1 : -0.35;
  const monthMatch = crop.suitableMonths.includes(monthIdx) ? 1 : crop.suitableMonths.includes((monthIdx + 12 - 1) % 12) ? 0.55 : -0.25;

  const waterNeedFactor = crop.waterNeed === "High" ? 1 : crop.waterNeed === "Moderate" ? 0.7 : 0.4;
  const rainWaterFactor = rainAvgPctNext2 >= 70 ? 1 : rainAvgPctNext2 >= 45 ? 0.65 : 0.35;
  const waterFit = 1 - Math.abs(rainWaterFactor - waterNeedFactor); // higher is better

  const riskPenalty = crop.riskLevel === "Low" ? 0.05 : crop.riskLevel === "Medium" ? 0.15 : 0.28;
  const demandBoost = crop.demandIndex / 100; // 0..1

  // Weighted score, tuned for a believable demo.
  return 50 + soilMatch * 18 + monthMatch * 22 + waterFit * 18 + demandBoost * 16 - riskPenalty * 40;
}

function pickYieldRangeTonsPerHa(cropName: string, profile: FarmerProfile, base: { min: number; max: number }) {
  const seed = `${cropName}|${profile.location}|${profile.landSizeHa}|${profile.sowingMonth}|${profile.soilType}`;
  const u = hashToUnit(seed);
  const mid = base.min + (base.max - base.min) * (0.35 + u * 0.3);
  const spread = base.max - base.min;
  const low = Math.max(0.1, mid - spread * (0.2 + u * 0.25));
  const high = mid + spread * (0.25 + u * 0.22);
  return { low, high, mid };
}

export function getRecommendedCrops(profile: FarmerProfile): CropAdvisory[] {
  // Use a quick rain read to adjust water fit.
  const rainDays = getWeatherRiskReport(profile, {
    cropName: profile.currentCrop,
    riskLevel: "Medium",
    waterNeed: "Moderate",
  }).days;
  const rainAvgPctNext2 =
    ((rainDays[0]?.rainProbabilityPct ?? 50) + (rainDays[1]?.rainProbabilityPct ?? 50)) / 2;

  const scored = CROP_CATALOG.map((crop) => {
    const score = scoreForCrop(crop, profile, rainAvgPctNext2);
    return { crop, score };
  }).sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 7);
  const bestCrop = top[0]?.crop;
  const bestName = bestCrop?.cropName ?? "";

  return top.map(({ crop }) => {
    const yields = pickYieldRangeTonsPerHa(crop.cropName, profile, crop.baseYieldTonsPerHa);
    const seed = hashToUnit(`${crop.cropName}|${profile.location}|${profile.preferredLanguage}`);
    const reasonIdx = Math.floor(seed * crop.recommendationReasonBullets.length);
    const reason =
      crop.recommendationReasonBullets[reasonIdx] ??
      crop.recommendationReasonBullets[0] ??
      "Good fit based on your inputs (prototype advisory).";

    return {
      cropName: crop.cropName,
      expectedYieldTonsPerHa: Math.round(yields.mid * 10) / 10,
      marketDemand: crop.marketDemand,
      waterNeed: crop.waterNeed,
      riskLevel: crop.riskLevel,
      recommendationReason: reason,
      bestChoice: crop.cropName === bestName,
    };
  });
}

export type DashboardStats = {
  greeting: string;
  bestCrop: CropAdvisory;
  cropAdvisories: CropAdvisory[];
  estimatedProfitRangeINR: { low: number; high: number };
  confidenceScore: number; // 0..100
  cropSuitabilityPct: number; // 0..100
  suggestedAction: string;
  marketDecisionForCurrentCrop: ReturnType<typeof getMarketDecision>;
};

function getBaseCostForCrop(cropName: string, waterNeed: CropAdvisory["waterNeed"]) {
  const base: Record<string, number> = {
    Cotton: 35000,
    Soybean: 25000,
    Groundnut: 28000,
    Maize: 22000,
    Wheat: 26000,
    Rice: 45000,
    Chilli: 60000,
    Tomato: 70000,
    Sugarcane: 40000,
  };
  const b = base[cropName] ?? 30000;
  const waterAdd = waterNeed === "High" ? 14000 : waterNeed === "Moderate" ? 8000 : 4500;
  return b + waterAdd;
}

export function getDashboardStats(profile: FarmerProfile): DashboardStats {
  const advisories = getRecommendedCrops(profile);
  const bestCrop = advisories[0] ?? {
    cropName: profile.currentCrop,
    expectedYieldTonsPerHa: 1.2,
    marketDemand: "Stable",
    waterNeed: "Moderate",
    riskLevel: "Medium",
    recommendationReason: "Prototype suggestion based on your inputs.",
    bestChoice: true,
  };

  const bestCatalog = CROP_CATALOG.find((c) => c.cropName === bestCrop.cropName);
  const rainReport = getWeatherRiskReport(profile, {
    cropName: bestCrop.cropName,
    riskLevel: bestCrop.riskLevel,
    waterNeed: bestCrop.waterNeed,
  });

  const seed = `${profile.location}|${profile.sowingMonth}|${profile.soilType}|${bestCrop.cropName}`;
  const monthIdx = monthNameToIndex(profile.sowingMonth);
  const soilMatch = bestCatalog?.suitableSoils.includes(profile.soilType) ? 1 : 0;
  const monthMatch = bestCatalog?.suitableMonths.includes(monthIdx) ? 1 : 0;
  const demandBoost = (bestCatalog?.demandIndex ?? 55) / 100;
  const riskPenalty = bestCrop.riskLevel === "Low" ? 0.05 : bestCrop.riskLevel === "Medium" ? 0.15 : 0.28;
  const rainAvg2 =
    ((rainReport.days[0]?.rainProbabilityPct ?? 50) + (rainReport.days[1]?.rainProbabilityPct ?? 50)) / 2;
  const rainFit = rainAvg2 >= 70 ? 1 : rainAvg2 >= 45 ? 0.7 : 0.35;
  const waterNeedFactor = bestCrop.waterNeed === "High" ? 1 : bestCrop.waterNeed === "Moderate" ? 0.7 : 0.4;
  const waterFit = 1 - Math.abs(rainFit - waterNeedFactor);

  const u = hashToUnit(seed);
  const confidenceRaw =
    58 +
    soilMatch * 12 +
    monthMatch * 14 +
    demandBoost * 10 +
    waterFit * 10 -
    riskPenalty * 50 +
    (u - 0.5) * 4;
  const confidenceScore = Math.round(clamp(confidenceRaw, 38, 92));
  const cropSuitabilityPct = Math.round(clamp(confidenceScore + (u - 0.5) * 6, 35, 95));

  // Profit range: use yield range if catalog exists, otherwise approximate around expected.
  const yieldLowHigh =
    bestCatalog?.baseYieldTonsPerHa ?? {
      min: Math.max(0.2, bestCrop.expectedYieldTonsPerHa * 0.85),
      max: bestCrop.expectedYieldTonsPerHa * 1.15,
    };

  const marketPriceINRPerQuintal = (() => {
    const dyn = bestCrop.marketDemand === "Strong" ? 1.04 : bestCrop.marketDemand === "Rising" ? 1.02 : 1.0;
    // Use deterministic dummy price around 2000-7000 based on crop type.
    const base: Record<string, number> = {
      Cotton: 2650,
      Soybean: 3520,
      Groundnut: 5400,
      Maize: 1700,
      Wheat: 2320,
      Rice: 2150,
      Chilli: 7280,
      Tomato: 4500,
      Sugarcane: 3040,
    };
    return Math.round((base[bestCrop.cropName] ?? 2400) * dyn);
  })();

  const yieldLowQuintal = (yieldLowHigh.min * 10) * (0.96 + u * 0.06);
  const yieldHighQuintal = (yieldLowHigh.max * 10) * (1.02 + u * 0.06);

  const priceVolPct = bestCrop.riskLevel === "High" ? 0.1 : bestCrop.riskLevel === "Medium" ? 0.07 : 0.05;
  const priceLow = marketPriceINRPerQuintal * (1 - priceVolPct * (0.6 + u * 0.3));
  const priceHigh = marketPriceINRPerQuintal * (1 + priceVolPct * (0.6 + u * 0.35));

  const costPerHa = getBaseCostForCrop(bestCrop.cropName, bestCrop.waterNeed);
  const landSize = Math.max(0.1, profile.landSizeHa);

  const revenueLow = yieldLowQuintal * priceLow;
  const revenueHigh = yieldHighQuintal * priceHigh;
  const costLow = costPerHa * landSize * (0.96 + u * 0.06);
  const costHigh = costPerHa * landSize * (1.02 + u * 0.07);

  const profitLow = Math.round(revenueLow - costHigh);
  const profitHigh = Math.round(revenueHigh - costLow);

  const marketDecisionForCurrentCrop = getMarketDecision(profile, profile.currentCrop);

  const suggestedAction = (() => {
    const heavyRain = rainReport.summary.rainTodayPct >= 75 || rainReport.days.slice(0, 2).some((d) => d.rainProbabilityPct >= 80);
    const bestRiskIsLower = bestCrop.riskLevel === "Low" && (profile.currentCrop || "").length > 0;

    if (heavyRain && bestCrop.waterNeed === "High") {
      return `With heavy rain risk, postpone sensitive tasks for ${bestCrop.cropName}. Do drainage checks and tighten spray/irrigation timing using alerts.`;
    }
    if (marketDecisionForCurrentCrop.decision === "Sell Now") {
      return `Market trend supports selling now. If your current crop is ready, prioritize mandi sale soon—avoid sale days during heavy showers.`;
    }
    if (profile.currentCrop !== bestCrop.cropName && bestRiskIsLower) {
      return `Reduce risk by preparing ${bestCrop.cropName} next. Start land prep now and follow weather windows for smoother establishment.`;
    }
    if (rainReport.summary.headline.includes("Storm")) {
      return `Plan around the storm window. Protect your crop with drainage + careful input timing, then resume activities after rainfall settles.`;
    }
    return `Follow a balanced plan: monitor mandi movement, keep irrigation scheduled based on alerts, and improve quality during harvest/sale.`;
  })();

  const greeting = `Hi farmer! Based on your inputs, here’s your next decision plan for ${bestCrop.cropName}.`;

  return {
    greeting,
    bestCrop,
    cropAdvisories: advisories.map((a) => ({ ...a, bestChoice: !!a.bestChoice })),
    estimatedProfitRangeINR: { low: Math.max(0, profitLow), high: Math.max(0, profitHigh) },
    confidenceScore,
    cropSuitabilityPct,
    suggestedAction,
    marketDecisionForCurrentCrop,
  };
}

