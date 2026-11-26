"use client";

import { useEffect } from "react";
import { buildCloneBeaconUrl } from "@/lib/inspectGuard";

export default function CloneCanary() {
  useEffect(() => {
    const beaconUrl = buildCloneBeaconUrl(
      window.location.href,
      window.location.hostname,
      document.referrer
    );
    if (!beaconUrl) return;
    const beacon = new Image();
    beacon.src = beaconUrl;
  }, []);

  return null;
}

