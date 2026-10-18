import type { App } from "@react-ui-os/core";
import { VigilEdrApp } from "@/components/apps/edr/VigilEdrApp";
import { EdrLineIcon, EdrFluentIcon } from "@/components/apps/SecurityIcons";

export const vigilEdrApp: App = {
  id: "edr",
  name: "Vigil EDR",
  tagline: "Simulación de EDR — Detección y Respuesta en Endpoint",
  accent: "#0067b8",
  icon: EdrLineIcon,
  icons: { fluent: EdrFluentIcon },
  category: "Security",
  defaultBounds: { w: 880, h: 600 },
  content: VigilEdrApp,
};

export const edrApp = vigilEdrApp;
