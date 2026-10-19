"use client";

import type { App } from "@react-ui-os/core";
import { NotesIcon, NotesFluentIcon } from "@react-ui-os/icons";
import { BitacoraApp } from "./BitacoraApp";

// Re-export store functions and templates for backward compatibility
export * from "./notes-store";
export * from "./bitacora-store";
export { AUDIT_TEMPLATE } from "@/pages/desktop/seedLabNotes";

/** Custom macOS-styled Bitácora notebook icon */
function BitacoraNotebookIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width={16} height={20} x={4} y={2} rx={2.5} ry={2.5} />
      <line x1={8} x2={16} y1={7} y2={7} />
      <line x1={8} x2={16} y1={11} y2={11} />
      <line x1={8} x2={13} y1={15} y2={15} />
      <circle cx={4} cy={7} r={0.7} fill="currentColor" />
      <circle cx={4} cy={11} r={0.7} fill="currentColor" />
      <circle cx={4} cy={15} r={0.7} fill="currentColor" />
    </svg>
  );
}

export const notesApp: App = {
  id: "notes",
  name: "Bitácora",
  tagline: "Plantilla del Cuaderno de Campo",
  accent: "#1893ff",
  icon: BitacoraNotebookIcon || NotesIcon,
  icons: { fluent: NotesFluentIcon },
  category: "Productivity",
  defaultBounds: { w: 860, h: 560 },
  content: BitacoraApp,
};
