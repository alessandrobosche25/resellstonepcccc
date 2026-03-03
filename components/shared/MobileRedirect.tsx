"use client";

import { useEffect } from "react";

export function MobileRedirect() {
  useEffect(() => {
    // Controlla se è un dispositivo mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Redirect a app.resellstone.com
      window.location.href = "https://app.resellstone.com";
    }
  }, []);

  return null;
}
