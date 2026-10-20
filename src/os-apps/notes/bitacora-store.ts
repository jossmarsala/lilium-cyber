import type { StorageAdapter } from "@react-ui-os/core";
import { COMPILED_LABS } from "@/data/compiledLabs";

export type CIATriad = "C" | "I" | "A";
export type PriorityLevel = "Baja" | "Media" | "Alta" | "Crítica";
export type CertaintyLevel = "Confirmado" | "Hipótesis" | "Insuficiente";

export interface BitacoraFinding {
  id: string; // e.g. "H-01"
  fecha: string;
  activo: string;
  evidencia: string;
  hallazgo: string;
  vulnerabilidad: string;
  amenazaRiesgo: string;
  triadaCIA: CIATriad[];
  prioridad: PriorityLevel;
  prioridadJustificacion: string;
  accion: string;
  gradoCerteza: CertaintyLevel;
  faseAsociada: string;
  createdAt: number;
  updatedAt: number;
}

export interface ConsignaAssignment {
  id: string; // e.g. "fase-1-p1"
  faseId: string;
  faseTitle: string;
  stepNumber: string; // "Paso 1.1"
  stepTitle: string; // "Identifica el sistema que tienes delante"
  directive: string;
  suggestedCommand?: string;
  rationale?: string;
  studentNotes: string;
  updatedAt: number;
}

const FINDINGS_STORAGE_KEY = "lilium_bitacora_findings_v2";
const CONSIGNAS_STORAGE_KEY = "lilium_bitacora_consignas_v1";
const NOTES_STORAGE_KEY = "notes";

export const INITIAL_FINDINGS: BitacoraFinding[] = [
  {
    id: "H-01",
    fecha: "2026-10-19 01:00",
    activo: "/home/cuidador/.ssh/id_ed25519",
    evidencia: "sudo stat -c '%A %a %U:%G %n' /home/cuidador/.ssh/id_ed25519\n-> -rw-r--r-- 644 cuidador:cuidador",
    hallazgo: "Clave privada SSH de prueba legible por cualquier usuario local del sistema.",
    vulnerabilidad: "Permisos excesivos en material criptográfico privado (modo 0644 en vez de 0600).",
    amenazaRiesgo: "Cualquier usuario o proceso con acceso local puede extraer la clave privada y acceder a otros hosts.",
    triadaCIA: ["C"],
    prioridad: "Alta",
    prioridadJustificacion: "Exposición directa de credenciales de autenticación sin control de mínimo privilegio.",
    accion: "sudo chmod 600 /home/cuidador/.ssh/id_ed25519",
    gradoCerteza: "Confirmado",
    faseAsociada: "Fase 1: Auditoría",
    createdAt: Date.now() - 3600000 * 4,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: "H-02",
    fecha: "2026-10-19 01:10",
    activo: "/srv/invernadero/informes/registro_confidencial.csv",
    evidencia: "sudo stat -c '%A %a %U:%G %n' /srv/invernadero/informes/registro_confidencial.csv\n-> -rw-r--r-- 644 cuidador:cuidador",
    hallazgo: "Informe de producción clasificado como confidencial con permisos de lectura abierta (644).",
    vulnerabilidad: "Configuración de permisos no alineada con la clasificación de la información (CIS 3).",
    amenazaRiesgo: "Fuga no autorizada de datos operativos sensibles del invernadero.",
    triadaCIA: ["C"],
    prioridad: "Media",
    prioridadJustificacion: "Información interna sensible expuesta a cuentas no administrativas.",
    accion: "sudo chmod 600 /srv/invernadero/informes/registro_confidencial.csv",
    gradoCerteza: "Confirmado",
    faseAsociada: "Fase 1: Auditoría",
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 3,
  },
];

/** Extract initial consignas from compiled lab phases (Lab 01 by default) */
export function getInitialConsignas(labId = "lab-01"): ConsignaAssignment[] {
  const lab = COMPILED_LABS.find((l) => l.id === labId) ?? COMPILED_LABS[0];
  if (!lab) return [];

  const consignas: ConsignaAssignment[] = [];
  lab.phases.forEach((phase) => {
    phase.directives.forEach((directive, idx) => {
      const hint = phase.hints[idx];
      const guide = phase.pedagogicalGuide?.[idx];
      consignas.push({
        id: `${phase.id}-step-${idx + 1}`,
        faseId: phase.id,
        faseTitle: phase.title,
        stepNumber: directive.title.split("—")[0]?.trim() || `Paso ${phase.number}.${idx + 1}`,
        stepTitle: directive.title.split("—")[1]?.trim() || directive.title,
        directive: directive.text,
        suggestedCommand: hint?.command,
        rationale: guide?.rationale,
        studentNotes: "",
        updatedAt: Date.now(),
      });
    });
  });
  return consignas;
}

export function readFindings(storage: StorageAdapter): BitacoraFinding[] {
  const raw = storage.get<BitacoraFinding[]>(FINDINGS_STORAGE_KEY);
  if (Array.isArray(raw) && raw.length > 0) {
    if (raw.length === 5 && raw[0]?.id === "H-01" && raw[4]?.id === "H-05") {
      storage.set(FINDINGS_STORAGE_KEY, INITIAL_FINDINGS);
      syncToStandardNotes(storage, INITIAL_FINDINGS);
      return INITIAL_FINDINGS;
    }
    return raw;
  }
  // Initialize with default findings template if empty
  storage.set(FINDINGS_STORAGE_KEY, INITIAL_FINDINGS);
  syncToStandardNotes(storage, INITIAL_FINDINGS);
  return INITIAL_FINDINGS;
}

export function saveFindings(storage: StorageAdapter, findings: BitacoraFinding[]): void {
  storage.set(FINDINGS_STORAGE_KEY, findings);
  // Sync to standard notes storage so StartRecents and system integrations stay in sync
  syncToStandardNotes(storage, findings);
}

export function readConsignas(storage: StorageAdapter, labId = "lab-01"): ConsignaAssignment[] {
  const key = `${CONSIGNAS_STORAGE_KEY}_${labId}`;
  const raw = storage.get<ConsignaAssignment[]>(key);
  if (Array.isArray(raw) && raw.length > 0) return raw;
  const initial = getInitialConsignas(labId);
  storage.set(key, initial);
  return initial;
}

export function saveConsignas(storage: StorageAdapter, consignas: ConsignaAssignment[], labId = "lab-01"): void {
  const key = `${CONSIGNAS_STORAGE_KEY}_${labId}`;
  storage.set(key, consignas);
}

export function exportBitacoraToMarkdown(findings: BitacoraFinding[]): string {
  const rows = findings.map((f) => {
    const cia = f.triadaCIA.join("/") || "—";
    const cleanEvidencia = f.evidencia.replace(/\n/g, " ");
    const cleanHallazgo = f.hallazgo.replace(/\n/g, " ");
    const cleanVuln = f.vulnerabilidad.replace(/\n/g, " ");
    const cleanAmenaza = f.amenazaRiesgo.replace(/\n/g, " ");
    const cleanAccion = f.accion.replace(/\n/g, " ");
    return `| ${f.id} | ${f.fecha} | ${f.activo} | ${cleanEvidencia} | ${cleanHallazgo} | ${cleanVuln} | ${cleanAmenaza} | ${cia} | ${f.prioridad} | ${cleanAccion} |`;
  });

  return `# 📋 Cuaderno de Campo — Auditoría Técnica
Estación Botánica Automatizada N.º 4 — Invernadero Central
Fecha de generación: ${new Date().toLocaleString()}

## Plantilla para el Cuaderno de Campo

Utiliza una entrada por cada hallazgo. Una observación puede ser legítima, incorrecta o insuficiente para emitir una conclusión; registra el grado de certeza.

| Identificador | Fecha y hora | Activo o ruta | Evidencia | Hallazgo | Vulnerabilidad o debilidad | Amenaza y riesgo | Tríada CIA | Prioridad | Acción |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

---
*Generado automáticamente desde la Bitácora de Campo de LILIUM Cyber-Range.*
`;
}

function syncToStandardNotes(storage: StorageAdapter, findings: BitacoraFinding[]) {
  try {
    const md = exportBitacoraToMarkdown(findings);
    const existing = storage.get<Array<{ id: string; body: string; createdAt: number; updatedAt: number }>>(NOTES_STORAGE_KEY) || [];
    const noteId = "lilium-bitacora-cuaderno-de-campo";
    const now = Date.now();
    const updated = existing.filter((n) => n.id !== noteId);
    updated.unshift({
      id: noteId,
      body: md,
      createdAt: now,
      updatedAt: now,
    });
    storage.set(NOTES_STORAGE_KEY, updated);
  } catch (err) {
    console.warn("[syncToStandardNotes] could not sync notes:", err);
  }
}
