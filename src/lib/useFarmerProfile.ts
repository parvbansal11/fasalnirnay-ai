"use client";

import * as React from "react";
import type { FarmerProfile } from "./types";
import { getFallbackProfile, loadFarmerProfile } from "./profileStorage";

export function useFarmerProfile() {
  const [profile, setProfile] = React.useState<FarmerProfile | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loaded = loadFarmerProfile();
    if (loaded) {
      setProfile(loaded);
    } else {
      setProfile(getFallbackProfile());
    }
    setIsLoaded(true);
  }, []);

  return { profile: profile ?? getFallbackProfile(), isLoaded };
}

