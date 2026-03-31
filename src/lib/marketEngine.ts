import type { FarmerProfile, MandiTrendPoint } from "./types";
import { getNearbyMandiDelta, MANDI_TREND_BY_CROP } from "./mockData";

export type MarketDecision = {
  decision: "Sell Now" | "Wait" | "Monitor";
  reason: string;
  alerts: {
    likelyPriceRise: string;
    likelyPriceDrop: string;
    nearbyMandiBetterPricing: string;
  };
};

function slopePct(points: MandiTrendPoint[]) {
  if (points.length < 2) return 0;
  const first = points[0]?.priceINRPerQuintal ?? 0;
  const last = points[points.length - 1]?.priceINRPerQuintal ?? 0;
  if (!first) return 0;
  return ((last - first) / first) * 100;
}

function lastTwoDirection(points: MandiTrendPoint[]) {
  if (points.length < 2) return 0;
  const a = points[points.length - 2]!.priceINRPerQuintal;
  const b = points[points.length - 1]!.priceINRPerQuintal;
  return b - a;
}

export function getMandiTrend(cropName: string): MandiTrendPoint[] {
  return MANDI_TREND_BY_CROP[cropName] ?? [];
}

export function getMarketDecision(profile: FarmerProfile, cropName: string): MarketDecision {
  const points = getMandiTrend(cropName);
  if (!points.length) {
    return {
      decision: "Monitor",
      reason: "Limited price history for this crop (prototype data).",
      alerts: {
        likelyPriceRise: "No clear rise signals found right now.",
        likelyPriceDrop: "No clear drop signals found right now.",
        nearbyMandiBetterPricing: "Check nearby mandis for a better rate.",
      },
    };
  }

  const pct = slopePct(points);
  const lastDir = lastTwoDirection(points);
  const delta = getNearbyMandiDelta(profile.location);

  const nearbyBetter = delta.better > 0;
  const likelyRise = pct >= 5 && lastDir >= 0;
  const likelyDrop = pct <= -5 && lastDir <= 0;

  let decision: MarketDecision["decision"] = "Monitor";
  let reason = "Watching trend stability.";

  if (likelyRise) {
    decision = "Sell Now";
    reason = `Price trend is improving (${pct.toFixed(1)}%). Consider selling in the next ${Math.max(
      2,
      Math.round(points.length / 2)
    )} weeks (prototype logic).`;
  } else if (likelyDrop) {
    decision = "Wait";
    reason = `Price trend is weakening (${pct.toFixed(1)}%). Wait for a rebound before selling (prototype logic).`;
  } else {
    decision = "Monitor";
    const label =
      pct >= 0
        ? `Slight upward drift (${pct.toFixed(1)}%).`
        : `Slight downward drift (${pct.toFixed(1)}%).`;
    reason = `${label} Markets look mixed—monitor daily/weekly changes.`;
  }

  const likelyPriceRise = likelyRise
    ? `Likely price rise: trend up by ~${pct.toFixed(1)}% over recent months.`
    : `Likely price rise: not strong yet. Keep monitoring the next few weeks.`;

  const likelyPriceDrop = likelyDrop
    ? `Likely price drop: trend down by ~${Math.abs(pct).toFixed(1)}%. Avoid selling early.`
    : `Likely price drop: no clear drop signal from recent trend.`;

  const nearbyMandiBetterPricing = nearbyBetter
    ? `Nearby mandi better pricing possible: around +Rs ${delta.better}/q.`
    : `Nearby mandi may not be better right now. Compare rates before transport.`;

  return {
    decision,
    reason,
    alerts: {
      likelyPriceRise,
      likelyPriceDrop,
      nearbyMandiBetterPricing,
    },
  };
}

