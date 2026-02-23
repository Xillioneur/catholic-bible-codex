"use client";

import { useEffect } from "react";
import { getLiturgicalDay } from "~/lib/liturgy";

/**
 * Liturgical Theme Provider
 * Injects the current Church season's color into CSS variables globally.
 */
export function LiturgicalThemeProvider() {
  useEffect(() => {
    const today = new Date();
    getLiturgicalDay(today).then((day) => {
      const root = document.documentElement;
      
      // Inject the liturgical color into the primary and ring variables
      // This makes buttons, progress bars, and highlights automatically switch
      root.style.setProperty("--primary", day.hex);
      root.style.setProperty("--ring", day.hex);
      
      // Optionally update meta theme color for mobile browsers
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute("content", day.hex);
      }
    });
  }, []);

  return null;
}
