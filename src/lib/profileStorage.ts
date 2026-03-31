import type { FarmerProfile } from "./types";
import { DEFAULT_PROFILE } from "./mockData";

const PROFILE_KEY = "fasalnirnay.profile.v1";

export function loadFarmerProfile(): FarmerProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FarmerProfile;
    if (!parsed?.location || !parsed?.soilType || !parsed?.currentCrop || !parsed?.sowingMonth) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveFarmerProfile(profile: FarmerProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getFallbackProfile(): FarmerProfile {
  return {
    location: DEFAULT_PROFILE.location,
    landSizeHa: DEFAULT_PROFILE.landSizeHa ?? 1,
    currentCrop: DEFAULT_PROFILE.currentCrop,
    sowingMonth: DEFAULT_PROFILE.sowingMonth,
    soilType: DEFAULT_PROFILE.soilType,
    preferredLanguage: DEFAULT_PROFILE.preferredLanguage,
  };
}

