import type { App } from "@react-ui-os/core";
import { ArgosSiemApp } from "@/components/apps/siem/ArgosSiemApp";
import { SiemLineIcon, SiemFluentIcon } from "@/components/apps/SecurityIcons";

export const argosSiemApp: App = {
  id: "siem",
  name: "Argos SIEM",
  tagline: "Simulación de SOC — Correlación de Eventos",
  accent: "#0067b8",
  icon: SiemLineIcon,
  icons: { fluent: SiemFluentIcon },
  category: "Security",
  defaultBounds: { w: 880, h: 600 },
  content: ArgosSiemApp,
};

export const siemApp = argosSiemApp;
