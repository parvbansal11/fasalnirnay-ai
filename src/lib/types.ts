export type SoilType = "Alluvial" | "Black" | "Red" | "Laterite" | "Sandy";
export type PreferredLanguage = "English" | "Hindi" | "Marathi" | "Telugu" | "Tamil";

export type FarmerProfile = {
  location: string; // District / region
  landSizeHa: number; // Hectares (normalized)
  currentCrop: string;
  sowingMonth: string; // "January"..."December"
  soilType: SoilType;
  preferredLanguage: PreferredLanguage;
};

export type RiskLevel = "Low" | "Medium" | "High";

export type CropAdvisory = {
  cropName: string;
  expectedYieldTonsPerHa: number;
  marketDemand: "Rising" | "Stable" | "Strong";
  waterNeed: "Low" | "Moderate" | "High";
  riskLevel: RiskLevel;
  recommendationReason: string;
  bestChoice?: boolean;
};

export type WeatherAlert = {
  severity: "Info" | "Watch" | "High";
  title: string;
  detail: string;
};

export type WeatherDay = {
  label: string; // "Today", "Tomorrow", or short date label
  condition: "Clear" | "Cloudy" | "Rain" | "Storm";
  rainProbabilityPct: number;
  minC: number;
  maxC: number;
};

export type MandiTrendPoint = {
  label: string; // Month label
  priceINRPerQuintal: number;
};

