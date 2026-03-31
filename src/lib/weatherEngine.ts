import type { CropAdvisory, FarmerProfile, WeatherAlert, WeatherDay } from "./types";
import { mockWeatherDays } from "./mockData";

export type WeatherRiskReport = {
  days: WeatherDay[];
  summary: {
    rainTodayPct: number;
    avgMinC: number;
    avgMaxC: number;
    headline: string;
  };
  riskAlerts: WeatherAlert[];
  farmingRecommendations: string[];
};

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function getWeatherRiskReport(
  profile: FarmerProfile,
  cropContext?: Pick<CropAdvisory, "waterNeed" | "riskLevel" | "cropName">
): WeatherRiskReport {
  const days = mockWeatherDays(profile);
  const rainTodayPct = days[0]?.rainProbabilityPct ?? 0;
  const avgMinC = avg(days.map((d) => d.minC));
  const avgMaxC = avg(days.map((d) => d.maxC));

  const waterNeed = cropContext?.waterNeed ?? "Moderate";
  const cropName = cropContext?.cropName ?? "your crop";
  const riskLevel = cropContext?.riskLevel ?? "Medium";

  const highRainSoon = days.slice(0, 2).some((d) => d.rainProbabilityPct >= 70);
  const veryHighRain = days.slice(0, 2).some((d) => d.rainProbabilityPct >= 85);
  const cloudyStretch = days.slice(0, 3).filter((d) => d.condition === "Cloudy" || d.condition === "Rain").length >= 2;

  const riskAlerts: WeatherAlert[] = [];
  const farmingRecommendations: string[] = [];

  if (veryHighRain) {
    riskAlerts.push({
      severity: "High",
      title: "Heavy rain warning",
      detail:
        `For ${cropName}, avoid water logging. Consider quick drainage checks and delay sensitive spraying near the storm window.`,
    });
    farmingRecommendations.push("Check field drainage channels before the first heavy shower.");
    farmingRecommendations.push("Avoid fertilizer top-dressing during the storm day (prototype advisory).");
  } else if (highRainSoon) {
    riskAlerts.push({
      severity: "Watch",
      title: "Rain likely in the next 48 hours",
      detail:
        `For ${cropName}, plan irrigation around rain. This helps reduce stress and improves uniform germination.`,
    });
    farmingRecommendations.push("Stagger irrigation so soil stays evenly moist, not flooded.");
    if (waterNeed === "High") farmingRecommendations.push("Mulch around rows to reduce splash + soil crusting risk.");
    else farmingRecommendations.push("Use light irrigation only if topsoil dries; avoid overwatering after showers.");
  } else {
    riskAlerts.push({
      severity: "Info",
      title: "Rain risk looks moderate",
      detail:
        `Forecast supports controlled irrigation. With proper scheduling, ${cropName} can handle the coming days.`,
    });
    farmingRecommendations.push("Follow a small irrigation schedule rather than one heavy watering (prototype).");
    if (cloudyStretch) farmingRecommendations.push("Scout for early disease signs during cloudy stretches; adjust spray timing.");
  }

  if (riskLevel === "High" && (veryHighRain || highRainSoon)) {
    riskAlerts.push({
      severity: "High",
      title: "Higher weather sensitivity for this crop",
      detail:
        `Your selected crop profile shows higher risk. Use weather alerts to tighten timing for irrigation and protection.`,
    });
    farmingRecommendations.push("Keep a close watch on leaves/flowers for stress after rainfall changes.");
  } else if (riskLevel === "Low" && cloudyStretch) {
    riskAlerts.push({
      severity: "Watch",
      title: "Cloudy days may slow growth",
      detail:
        `With ${cropName}, growth can slow under prolonged cloudy conditions. Keep nutrient timing flexible.`,
    });
    farmingRecommendations.push("Ensure adequate aeration; avoid thick canopy water stagnation.");
  }

  const headline = veryHighRain
    ? "Storm window approaching"
    : highRainSoon
      ? "Rain window in the next two days"
      : "Stable weather for planning";

  return {
    days,
    summary: { rainTodayPct: Math.round(rainTodayPct), avgMinC, avgMaxC, headline },
    riskAlerts,
    farmingRecommendations,
  };
}

