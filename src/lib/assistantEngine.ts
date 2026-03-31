import type { FarmerProfile, WeatherAlert } from "./types";
import { CROP_CATALOG, MONTHS } from "./mockData";
import { getDashboardStats } from "./advisoryEngine";
import { getMarketDecision } from "./marketEngine";
import { getRecommendedCrops } from "./advisoryEngine";
import { getWeatherRiskReport } from "./weatherEngine";

export type AssistantReply = {
  text: string;
  followUps: string[];
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function findCropInText(question: string) {
  const q = normalize(question);
  const hit = CROP_CATALOG.find((c) => q.includes(c.cropName.toLowerCase()));
  return hit?.cropName;
}

function findMonthInText(question: string) {
  const q = normalize(question);
  const hit = MONTHS.find((m) => q.includes(m.toLowerCase()));
  return hit;
}

function formatAlerts(alerts: WeatherAlert[]) {
  if (!alerts.length) return "";
  const first = alerts[0]!;
  return `${first.title}. ${first.detail}`;
}

export function getAssistantReply(
  question: string,
  profile: FarmerProfile,
  stats = getDashboardStats(profile)
): AssistantReply {
  const q = normalize(question);
  const followUps: string[] = [];

  const bestCrop = stats.bestCrop;
  const currentCrop = profile.currentCrop;

  const askedMonth = findMonthInText(question);
  const askedCrop = findCropInText(question);

  if (q.includes("sow") || q.includes("plant") || q.includes("grow")) {
    // If they ask "What should I sow in April?"
    const monthToUse = askedMonth ?? profile.sowingMonth;
    const nextProfile: FarmerProfile = { ...profile, sowingMonth: monthToUse };
    const recs = getRecommendedCrops(nextProfile);
    const best = recs[0] ?? bestCrop;
    followUps.push(`Should I choose ${best.cropName} over ${currentCrop}?`);
    followUps.push("How do I reduce risk if rainfall changes?");
    return {
      text:
        `For your sowing month of ${monthToUse}, the strongest prototype fit is ` +
        `${best.cropName}. Expected yield is around ${best.expectedYieldTonsPerHa} tons/ha ` +
        `with ${best.marketDemand.toLowerCase()} demand. ` +
        `Reason: ${best.recommendationReason}.\n\n` +
        `Next step: keep irrigation/reminders aligned with the next 48 hours of rain signals.`,
      followUps,
    };
  }

  if (q.includes("sell") || q.includes("mandi") || q.includes("rate") || q.includes("cotton now")) {
    const cropToAssess = askedCrop ?? currentCrop;
    const decision = getMarketDecision(profile, cropToAssess);
    followUps.push(`What should I do during the ${decision.decision} window?`);
    followUps.push("Show me the mandi trend for the best crop choice.");
    return {
      text:
        `Based on the mandi trend (prototype data) for ${cropToAssess}: ` +
        `${decision.decision}. ${decision.reason}\n\n` +
        `Quick alerts:\n- ${decision.alerts.likelyPriceRise}\n- ${decision.alerts.likelyPriceDrop}\n- ${decision.alerts.nearbyMandiBetterPricing}`,
      followUps,
    };
  }

  if (q.includes("rain") || q.includes("weather") || q.includes("storm") || q.includes("affect")) {
    const report = getWeatherRiskReport(profile, {
      cropName: bestCrop.cropName,
      waterNeed: bestCrop.waterNeed,
      riskLevel: bestCrop.riskLevel,
    });
    followUps.push("What irrigation schedule should I follow?");
    followUps.push("How should I protect the crop during cloudy days?");
    const alertsText = formatAlerts(report.riskAlerts);
    return {
      text:
        `Weather-wise, the next few days show: ${report.summary.headline}. ` +
        `Rain today is around ${report.summary.rainTodayPct}%.\n\n` +
        (alertsText ? `Risk alert: ${alertsText}\n\n` : "") +
        `Recommended actions for ${bestCrop.cropName}:\n` +
        report.farmingRecommendations.slice(0, 3).map((r) => `- ${r}`).join("\n"),
      followUps,
    };
  }

  // Default: summary style response.
  const marketDecision = getMarketDecision(profile, currentCrop);
  const report = getWeatherRiskReport(profile, {
    cropName: bestCrop.cropName,
    waterNeed: bestCrop.waterNeed,
    riskLevel: bestCrop.riskLevel,
  });
  const alert = report.riskAlerts[0];

  followUps.push(`Summarize my next 7-day plan for ${bestCrop.cropName}.`);
  followUps.push(`Should I sell ${currentCrop} now or wait?`);
  followUps.push("Which crops are safest for my soil type?");

  return {
    text:
      `Here’s your quick decision snapshot (prototype):\n\n` +
      `1) Best crop for planning: ${bestCrop.cropName} (confidence ${stats.confidenceScore}%).\n` +
      `   - Reason: ${bestCrop.recommendationReason}\n\n` +
      `2) Mandi move for your current crop (${currentCrop}): ${marketDecision.decision}.\n` +
      `   - ${marketDecision.reason}\n\n` +
      `3) Weather risk for ${bestCrop.cropName}: ${report.summary.headline}.\n` +
      `   - ${alert ? `${alert.title}: ${alert.detail}` : "Keep an eye on alerts and schedule inputs accordingly."}\n\n` +
      `Ask me anything like: “Should I sell cotton now?” or “Is rain going to affect my crop?”`,
    followUps,
  };
}

