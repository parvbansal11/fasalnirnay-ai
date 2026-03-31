import type {
  CropAdvisory,
  FarmerProfile,
  MandiTrendPoint,
  PreferredLanguage,
  SoilType,
  WeatherDay,
} from "./types";

export const APP_NAME = "FasalNirnay AI";

export const TAGLINE = "Smart crop and selling decisions for every farmer";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const SOIL_OPTIONS: SoilType[] = ["Alluvial", "Black", "Red", "Laterite", "Sandy"];

export const LANGUAGE_OPTIONS: PreferredLanguage[] = [
  "English",
  "Hindi",
  "Marathi",
  "Telugu",
  "Tamil",
];

export const DEFAULT_PROFILE: Omit<FarmerProfile, "landSizeHa"> & { landSizeHa?: number } = {
  location: "Nashik, Maharashtra",
  landSizeHa: 1.0,
  currentCrop: "Cotton",
  sowingMonth: "April",
  soilType: "Black",
  preferredLanguage: "English",
};

export type CropCatalog = {
  cropName: string;
  suitableMonths: number[]; // 0-11
  suitableSoils: SoilType[];
  baseYieldTonsPerHa: { min: number; max: number }; // dummy ranges
  waterNeed: CropAdvisory["waterNeed"];
  riskLevel: CropAdvisory["riskLevel"];
  marketDemand: CropAdvisory["marketDemand"];
  waterSensitivity: number; // higher means needs water
  demandIndex: number; // 0-100
  recommendationReasonBullets: string[];
};

export const CROP_CATALOG: CropCatalog[] = [
  {
    cropName: "Cotton",
    suitableMonths: [2, 3, 4, 5], // Mar-Jun
    suitableSoils: ["Black", "Alluvial", "Red"],
    baseYieldTonsPerHa: { min: 1.2, max: 1.9 },
    waterNeed: "High",
    riskLevel: "Medium",
    marketDemand: "Strong",
    waterSensitivity: 0.85,
    demandIndex: 78,
    recommendationReasonBullets: [
      "Strong market demand in many cotton belts",
      "Good fit for warm sowing windows",
      "Risk can be reduced with timely irrigation planning",
    ],
  },
  {
    cropName: "Soybean",
    suitableMonths: [1, 2, 3, 4], // Feb-May
    suitableSoils: ["Black", "Red", "Alluvial"],
    baseYieldTonsPerHa: { min: 1.0, max: 1.6 },
    waterNeed: "Moderate",
    riskLevel: "Low",
    marketDemand: "Rising",
    waterSensitivity: 0.55,
    demandIndex: 72,
    recommendationReasonBullets: [
      "Growing demand for oilcakes and feed",
      "Balances yield with manageable water needs",
      "Lower volatility compared to many cash crops",
    ],
  },
  {
    cropName: "Groundnut",
    suitableMonths: [1, 2, 3, 4], // Feb-May
    suitableSoils: ["Sandy", "Red", "Alluvial"],
    baseYieldTonsPerHa: { min: 0.9, max: 1.4 },
    waterNeed: "Moderate",
    riskLevel: "Medium",
    marketDemand: "Stable",
    waterSensitivity: 0.45,
    demandIndex: 56,
    recommendationReasonBullets: [
      "Comfortable fit for dry spells with planning",
      "Demand stays steady across seasons",
      "Good option for diversifying risk",
    ],
  },
  {
    cropName: "Maize",
    suitableMonths: [2, 3, 4, 5, 6], // Mar-Aug
    suitableSoils: ["Alluvial", "Black", "Red"],
    baseYieldTonsPerHa: { min: 3.2, max: 5.0 },
    waterNeed: "Moderate",
    riskLevel: "Low",
    marketDemand: "Rising",
    waterSensitivity: 0.5,
    demandIndex: 64,
    recommendationReasonBullets: [
      "Good yield potential with resilient growth",
      "Demand from poultry and feed markets",
      "Works well with planned irrigation/rain pockets",
    ],
  },
  {
    cropName: "Wheat",
    suitableMonths: [7, 8, 9, 10], // Aug-Nov (sowing rabi start)
    suitableSoils: ["Alluvial", "Black", "Red"],
    baseYieldTonsPerHa: { min: 3.0, max: 4.6 },
    waterNeed: "Moderate",
    riskLevel: "Low",
    marketDemand: "Stable",
    waterSensitivity: 0.42,
    demandIndex: 52,
    recommendationReasonBullets: [
      "Stable demand and long storage value",
      "Lower risk profile in typical rabi calendars",
      "Great for planning around expected winter temperatures",
    ],
  },
  {
    cropName: "Rice",
    suitableMonths: [4, 5, 6, 7], // May-Sep
    suitableSoils: ["Alluvial", "Laterite", "Sandy"],
    baseYieldTonsPerHa: { min: 3.8, max: 6.2 },
    waterNeed: "High",
    riskLevel: "High",
    marketDemand: "Strong",
    waterSensitivity: 0.9,
    demandIndex: 80,
    recommendationReasonBullets: [
      "High demand and bulk procurement tendency",
      "Best when water availability is well managed",
      "Weather-based risk is higher without drainage planning",
    ],
  },
  {
    cropName: "Chilli",
    suitableMonths: [1, 2, 3, 4], // Feb-May
    suitableSoils: ["Alluvial", "Red", "Laterite"],
    baseYieldTonsPerHa: { min: 0.35, max: 0.7 },
    waterNeed: "High",
    riskLevel: "High",
    marketDemand: "Rising",
    waterSensitivity: 0.78,
    demandIndex: 74,
    recommendationReasonBullets: [
      "Price improvement potential with quality grading",
      "High value but needs careful weather management",
      "Use alerts for irrigation and disease prevention windows",
    ],
  },
  {
    cropName: "Tomato",
    suitableMonths: [1, 2, 3], // Feb-Apr (nursery+planting window)
    suitableSoils: ["Red", "Alluvial", "Laterite"],
    baseYieldTonsPerHa: { min: 18, max: 30 }, // tons (dummy)
    waterNeed: "High",
    riskLevel: "High",
    marketDemand: "Strong",
    waterSensitivity: 0.8,
    demandIndex: 85,
    recommendationReasonBullets: [
      "Consistent market demand for fresh supply",
      "Premium prices possible during fewer-supply weeks",
      "Better results when alerts guide irrigation and spray timing",
    ],
  },
  {
    cropName: "Sugarcane",
    suitableMonths: [0, 1, 2, 9, 10], // Jan-Mar and Oct-Nov (dummy)
    suitableSoils: ["Alluvial", "Black", "Red"],
    baseYieldTonsPerHa: { min: 55, max: 90 },
    waterNeed: "High",
    riskLevel: "Medium",
    marketDemand: "Stable",
    waterSensitivity: 0.7,
    demandIndex: 60,
    recommendationReasonBullets: [
      "Long-term stable demand with predictable procurement",
      "Works for farmers planning multi-month cycles",
      "Risk can be reduced by monitoring rainfall distribution",
    ],
  },
];

const TREND_MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export const MANDI_TREND_BY_CROP: Record<string, MandiTrendPoint[]> = {
  Cotton: [2500, 2550, 2650, 2700, 2620, 2780].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Soybean: [3300, 3320, 3420, 3500, 3460, 3620].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Groundnut: [5200, 5150, 5300, 5400, 5350, 5480].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Maize: [1550, 1600, 1660, 1720, 1680, 1790].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Wheat: [2250, 2280, 2260, 2320, 2300, 2360].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Rice: [2050, 2100, 2160, 2080, 2120, 2200].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Chilli: [6800, 6900, 7100, 7200, 7050, 7380].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Tomato: [4200, 4100, 4250, 4450, 4380, 4600].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
  Sugarcane: [2950, 3000, 3050, 2980, 3020, 3080].map((p, i) => ({
    label: TREND_MONTHS[i] ?? `M${i + 1}`,
    priceINRPerQuintal: p,
  })),
};

export const NEARBY_MANDI_OFFSETS_IN_INR_PER_QUINTAL = {
  "Nashik, Maharashtra": { better: 120, same: 0, worse: -90 },
  "Prakasam, Andhra Pradesh": { better: 95, same: 0, worse: -75 },
  "Samastipur, Bihar": { better: 80, same: 0, worse: -110 },
  "Satara, Maharashtra": { better: 105, same: 0, worse: -85 },
  "Akola, Maharashtra": { better: 90, same: 0, worse: -95 },
};

export function getNearbyMandiDelta(location: string) {
  const table = NEARBY_MANDI_OFFSETS_IN_INR_PER_QUINTAL as Record<
    string,
    { better: number; same: number; worse: number }
  >;
  return table[location] ?? {
    better: 70,
    same: 0,
    worse: -100,
  };
}

export function mockWeatherDays(profile: FarmerProfile): WeatherDay[] {
  // Dummy forecast shaped by location keyword and sowing season.
  const loc = profile.location.toLowerCase();
  const monthIdx = MONTHS.indexOf(profile.sowingMonth as (typeof MONTHS)[number]);
  const isMonsoonLike = monthIdx >= 4 && monthIdx <= 7; // May-Sep

  const baseRain =
    loc.includes("bihar") || loc.includes("patna") ? 60 : loc.includes("andhra") ? 55 : 45;
  const rainBoost = isMonsoonLike ? 25 : monthIdx <= 2 ? 0 : 10;
  const trend = loc.includes("nashik") ? -2 : loc.includes("satara") ? 1 : 0;

  const todayMin = isMonsoonLike ? 22 : 18;
  const todayMax = isMonsoonLike ? 32 : 36;

  return Array.from({ length: 5 }).map((_, i) => {
    const rp = Math.max(
      10,
      Math.min(95, baseRain + rainBoost - i * 6 + (i % 2 === 0 ? trend : -trend))
    );
    const isRainy = rp >= 60;
    return {
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `Day ${i + 1}`,
      condition: isRainy ? (rp >= 78 ? "Storm" : "Rain") : i === 2 ? "Cloudy" : "Clear",
      rainProbabilityPct: Math.round(rp),
      minC: Math.round(todayMin + i * 0.6 - (isRainy ? 1.2 : 0)),
      maxC: Math.round(todayMax + i * 0.2 - (isRainy ? 2.5 : 0)),
    };
  });
}

