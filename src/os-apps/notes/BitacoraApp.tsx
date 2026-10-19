import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useDesktopContext, useTheme } from "@react-ui-os/desktop";
import {
  readFindings,
  saveFindings,
  INITIAL_FINDINGS,
  type BitacoraFinding,
  type CIATriad,
  type PriorityLevel,
  type CertaintyLevel,
} from "./bitacora-store";

type ViewMode =
  | { kind: "finding"; id: string }
  | { kind: "findings-list" }
  | { kind: "summary" };

export function BitacoraApp() {
  const { storage } = useDesktopContext();
  const theme = useTheme();
  const isDark =
    theme.palette.textPrimary === "#fff" ||
    theme.palette.textPrimary.toLowerCase().startsWith("#f") ||
    theme.palette.background?.toLowerCase().includes("#1") ||
    theme.palette.background?.toLowerCase().includes("#0");

  const [findings, setFindings] = useState<BitacoraFinding[]>(() =>
    readFindings(storage),
  );

  const [view, setView] = useState<ViewMode>({ kind: "finding", id: findings[0]?.id || "H-01" });

  // Sync findings whenever storage changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFindings(readFindings(storage));
  }, [storage]);

  const navigateTo = useCallback((newView: ViewMode) => {
    setView(newView);
  }, []);

  const selectedFinding = useMemo(() => {
    if (view.kind !== "finding") return null;
    return findings.find((f) => f.id === view.id) ?? findings[0] ?? null;
  }, [view, findings]);

  const handleUpdateFinding = useCallback(
    (updated: BitacoraFinding) => {
      const next = findings.map((f) => (f.id === updated.id ? { ...updated, updatedAt: Date.now() } : f));
      setFindings(next);
      saveFindings(storage, next);
    },
    [findings, storage],
  );

  const handleCreateFinding = useCallback(
    (prefill?: Partial<BitacoraFinding>) => {
      const existingIds = findings.map((f) => f.id);
      let nextNum = findings.length + 1;
      let nextId = `H-${String(nextNum).padStart(2, "0")}`;
      while (existingIds.includes(nextId)) {
        nextNum++;
        nextId = `H-${String(nextNum).padStart(2, "0")}`;
      }

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const newEntry: BitacoraFinding = {
        id: nextId,
        fecha: dateStr,
        activo: prefill?.activo || "",
        evidencia: prefill?.evidencia || "",
        hallazgo: prefill?.hallazgo || "",
        vulnerabilidad: prefill?.vulnerabilidad || "",
        amenazaRiesgo: prefill?.amenazaRiesgo || "",
        triadaCIA: prefill?.triadaCIA || ["C"],
        prioridad: prefill?.prioridad || "Media",
        prioridadJustificacion: prefill?.prioridadJustificacion || "",
        accion: prefill?.accion || "",
        gradoCerteza: prefill?.gradoCerteza || "Confirmado",
        faseAsociada: prefill?.faseAsociada || "Fase 1: Auditoría",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const next = [newEntry, ...findings];
      setFindings(next);
      saveFindings(storage, next);
      navigateTo({ kind: "finding", id: nextId });
    },
    [findings, storage, navigateTo],
  );

  const handleDeleteFinding = useCallback(
    (id: string) => {
      if (findings.length <= 1) {
        alert("Debe haber al menos una entrada en el Cuaderno de Campo.");
        return;
      }
      const next = findings.filter((f) => f.id !== id);
      setFindings(next);
      saveFindings(storage, next);
      navigateTo({ kind: "finding", id: next[0]!.id });
    },
    [findings, storage, navigateTo],
  );

  const handleResetToTemplate = useCallback(() => {
    if (confirm("¿Restablecer el Cuaderno de Campo a las entradas de plantilla de Lab 01?")) {
      setFindings(INITIAL_FINDINGS);
      saveFindings(storage, INITIAL_FINDINGS);
      navigateTo({ kind: "finding", id: INITIAL_FINDINGS[0]!.id });
    }
  }, [storage, navigateTo]);

  // Native OS glassy theme tokens
  const borderCol = theme.palette.border;
  const textPrimary = theme.palette.textPrimary;
  const textMuted = theme.palette.textSecondary;

  // Native OS glassy theme tokens & Playbook single accent color
  const ACCENT = "#1893ff";
  const sidebarBg = isDark
    ? "rgba(0, 0, 0, 0.18)"
    : "rgba(255, 255, 255, 0.28)";
  const activePillBg = isDark
    ? "rgba(24, 147, 255, 0.12)"
    : "rgba(24, 147, 255, 0.08)";
  const activePillBorder = isDark
    ? "rgba(24, 147, 255, 0.3)"
    : "rgba(24, 147, 255, 0.22)";
  const activePillShadow = isDark
    ? "0 1px 3px rgba(0, 0, 0, 0.2)"
    : "0 1px 2px rgba(0, 0, 0, 0.04)";
  const inputBg = isDark
    ? "rgba(255, 255, 255, 0.035)"
    : "rgba(255, 255, 255, 0.6)";
  const inputBorder = isDark
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";



  return (
    <div
      style={{
        display: "flex",
        height: "calc(100% + 32px)",
        width: "calc(100% + 32px)",
        margin: -16,
        color: textPrimary,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: 13,
        userSelect: "none",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* ── MINIMAL PLAYBOOK-STYLED SIDEBAR ── */}
      <div
        style={{
          width: 216,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: sidebarBg,
          borderRight: `1px solid ${borderCol}`,
          overflowY: "auto",
        }}
      >
        {/* Subtle Minimal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 14px 10px 14px",
            borderBottom: `1px solid ${borderCol}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <BitacoraNotebookIcon size={15} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: textPrimary,
                textTransform: "uppercase",
              }}
            >
              Bitácora
            </span>
          </div>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              fontFamily: "ui-monospace, monospace",
              color: textMuted,
              padding: "1px 6px",
              borderRadius: 4,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            }}
          >
            {findings.length}
          </span>
        </div>

        {/* Section 1: Hallazgos */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px 4px 14px",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: textMuted,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Hallazgos
          </span>
          <button
            type="button"
            onClick={() => handleCreateFinding()}
            style={{
              background: "transparent",
              border: "none",
              color: textMuted,
              cursor: "pointer",
              padding: "2px 4px",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
            }}
            title="Nuevo hallazgo"
            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
          >
            <PlusIcon size={12} />
          </button>
        </div>

        {/* Tabla Resumen */}
        <div
          onClick={() => navigateTo({ kind: "summary" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            margin: "1px 6px",
            borderRadius: 6,
            cursor: "pointer",
            background:
              view.kind === "summary" || view.kind === "findings-list"
                ? activePillBg
                : "transparent",
            border:
              view.kind === "summary" || view.kind === "findings-list"
                ? `1px solid ${activePillBorder}`
                : "1px solid transparent",
            boxShadow:
              view.kind === "summary" || view.kind === "findings-list"
                ? activePillShadow
                : "none",
            color:
              view.kind === "summary" || view.kind === "findings-list"
                ? ACCENT
                : textMuted,
            fontWeight:
              view.kind === "summary" || view.kind === "findings-list" ? 600 : 500,
            transition: "all 0.12s ease",
          }}
        >
          <TableIcon size={14} />
          <span style={{ flex: 1, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Tabla Resumen
          </span>
        </div>

        {/* Individual Findings */}
        <div style={{ margin: "2px 0 10px 0" }}>
          {findings.map((f) => {
            const isSelected = view.kind === "finding" && view.id === f.id;
            return (
              <div
                key={f.id}
                onClick={() => navigateTo({ kind: "finding", id: f.id })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 10px 5px 16px",
                  margin: "1px 6px",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: isSelected ? activePillBg : "transparent",
                  border: isSelected
                    ? `1px solid ${activePillBorder}`
                    : "1px solid transparent",
                  boxShadow: isSelected ? activePillShadow : "none",
                  color: isSelected ? textPrimary : textMuted,
                  fontWeight: isSelected ? 600 : 400,
                  transition: "all 0.12s ease",
                }}
              >
                <DocumentIcon size={13} />
                <span
                  style={{
                    fontSize: 11.5,
                    fontFamily: "ui-monospace, monospace",
                    fontWeight: 600,
                    color: isSelected ? ACCENT : textMuted,
                  }}
                >
                  {f.id}
                </span>
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 11.5,
                  }}
                >
                  {f.activo ? f.activo.split("/").pop() : "Sin activo"}
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    padding: "1px 4px",
                    borderRadius: 3,
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                    color: isSelected ? ACCENT : textMuted,
                  }}
                >
                  {f.prioridad[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT MAIN WORKSPACE ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
          background: "transparent",
        }}
      >
        {/* Minimal Clean Header Bar */}
        <div
          style={{
            height: 42,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: `1px solid ${borderCol}`,
            background: isDark ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.15)",
          }}
        >
          {/* Current View Title / Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {view.kind === "finding" && selectedFinding ? (
              <>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    padding: "2px 7px",
                    borderRadius: 4,
                    background: isDark ? "rgba(24, 147, 255, 0.15)" : "rgba(24, 147, 255, 0.1)",
                    border: `1px solid ${isDark ? "rgba(24, 147, 255, 0.35)" : "rgba(24, 147, 255, 0.3)"}`,
                    color: ACCENT,
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {selectedFinding.id}
                </span>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: textPrimary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFinding.activo || "Detalle del Hallazgo"}
                </span>
              </>
            ) : (
              <span style={{ fontWeight: 600, fontSize: 13, color: textPrimary }}>
                Cuaderno de Campo — Tabla Consolidada
              </span>
            )}
          </div>

          {/* Action Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {view.kind === "finding" && selectedFinding && (
              <button
                type="button"
                onClick={() => handleDeleteFinding(selectedFinding.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: `1px solid ${borderCol}`,
                  background: "transparent",
                  color: textMuted,
                  fontSize: 11.5,
                  cursor: "pointer",
                  transition: "all 120ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textPrimary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
                title="Eliminar este hallazgo"
              >
                Eliminar
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCreateFinding()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 4,
                background: ACCENT,
                border: "none",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 120ms ease",
              }}
              title="Registrar nuevo hallazgo"
            >
              <PlusIcon size={12} />
              <span>Nuevo Hallazgo</span>
            </button>
          </div>
        </div>

        {/* Content View Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px 32px 20px",
          }}
        >
          {view.kind === "finding" && selectedFinding && (
            <FindingDetailView
              finding={selectedFinding}
              onUpdate={handleUpdateFinding}
              onDelete={handleDeleteFinding}
              isDark={isDark}
              inputBg={inputBg}
              inputBorder={inputBorder}
              textPrimary={textPrimary}
              textMuted={textMuted}
            />
          )}

          {(view.kind === "summary" || view.kind === "findings-list") && (
            <SummaryView
              findings={findings}
              onSelectFinding={(id) => navigateTo({ kind: "finding", id })}
              onResetTemplate={handleResetToTemplate}
              isDark={isDark}
              textPrimary={textPrimary}
              textMuted={textMuted}
              borderCol={borderCol}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: Finding Detail View (Minimal & Clean)
// ─────────────────────────────────────────────────────────────
interface FindingDetailViewProps {
  finding: BitacoraFinding;
  onUpdate: (f: BitacoraFinding) => void;
  onDelete?: (id: string) => void;
  isDark: boolean;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textMuted: string;
}

function FindingDetailView({
  finding,
  onUpdate,
  onDelete,
  isDark,
  inputBg,
  inputBorder,
  textPrimary,
  textMuted,
}: FindingDetailViewProps) {
  const handleFieldChange = <K extends keyof BitacoraFinding>(field: K, val: BitacoraFinding[K]) => {
    onUpdate({ ...finding, [field]: val });
  };

  const toggleCIA = (tag: CIATriad) => {
    const current = finding.triadaCIA;
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    handleFieldChange("triadaCIA", next);
  };

  const handleSetNow = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    handleFieldChange("fecha", dateStr);
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: textMuted,
    marginBottom: 4,
    letterSpacing: "0.02em",
  };

  const baseInputStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: 6,
    padding: "7px 10px",
    color: textPrimary,
    fontSize: 12.5,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  const ACCENT = "#1893ff";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 13 }}>
      {/* Row 1: Fase + Certeza + Fecha y hora */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.1fr 1.3fr", gap: 10 }}>
        <div>
          <label style={labelStyle}>Fase Asociada</label>
          <select
            value={finding.faseAsociada}
            onChange={(e) => handleFieldChange("faseAsociada", e.target.value)}
            style={{ ...baseInputStyle, cursor: "pointer" }}
          >
            <option value="Fase 1: Auditoría">Fase 1: Auditoría</option>
            <option value="Fase 2: Triaje y contención">Fase 2: Triaje y contención</option>
            <option value="Fase 3: Hardening">Fase 3: Hardening</option>
            <option value="General">General / Transversal</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Grado de Certeza</label>
          <select
            value={finding.gradoCerteza}
            onChange={(e) => handleFieldChange("gradoCerteza", e.target.value as CertaintyLevel)}
            style={{ ...baseInputStyle, cursor: "pointer" }}
          >
            <option value="Confirmado">Confirmado</option>
            <option value="Hipótesis">Hipótesis</option>
            <option value="Insuficiente">Insuficiente</option>
          </select>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={labelStyle}>Fecha y hora</label>
            <button
              type="button"
              onClick={handleSetNow}
              style={{
                background: "transparent",
                border: "none",
                fontSize: 10,
                color: ACCENT,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Ahora
            </button>
          </div>
          <input
            type="text"
            value={finding.fecha}
            onChange={(e) => handleFieldChange("fecha", e.target.value)}
            style={baseInputStyle}
            placeholder="YYYY-MM-DD HH:MM"
          />
        </div>
      </div>

      {/* Row 2: Activo o ruta */}
      <div>
        <label style={labelStyle}>Activo o ruta</label>
        <input
          type="text"
          value={finding.activo}
          onChange={(e) => handleFieldChange("activo", e.target.value)}
          style={baseInputStyle}
          placeholder="/etc/shadow, /home/cuidador/.ssh/id_ed25519, polilla_emisora..."
        />
      </div>

      {/* Row 3: Evidencia */}
      <div>
        <label style={labelStyle}>Evidencia (Comando o dato observable)</label>
        <textarea
          rows={3}
          value={finding.evidencia}
          onChange={(e) => handleFieldChange("evidencia", e.target.value)}
          style={{
            ...baseInputStyle,
            resize: "vertical",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
            fontSize: 12,
            background: isDark ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.04)",
          }}
          placeholder="Comando y resultado observable (ej: sudo stat -c '%A %a' /etc/shadow)"
        />
      </div>

      {/* Row 4: Hallazgo */}
      <div>
        <label style={labelStyle}>Hallazgo</label>
        <textarea
          rows={2}
          value={finding.hallazgo}
          onChange={(e) => handleFieldChange("hallazgo", e.target.value)}
          style={{ ...baseInputStyle, resize: "vertical" }}
          placeholder="Qué se observó en el sistema"
        />
      </div>

      {/* Row 5: Vulnerabilidad o debilidad */}
      <div>
        <label style={labelStyle}>Vulnerabilidad o debilidad</label>
        <textarea
          rows={2}
          value={finding.vulnerabilidad}
          onChange={(e) => handleFieldChange("vulnerabilidad", e.target.value)}
          style={{ ...baseInputStyle, resize: "vertical" }}
          placeholder="La configuración o ausencia de control que genera exposición"
        />
      </div>

      {/* Row 6: Amenaza y riesgo */}
      <div>
        <label style={labelStyle}>Amenaza y riesgo</label>
        <textarea
          rows={2}
          value={finding.amenazaRiesgo}
          onChange={(e) => handleFieldChange("amenazaRiesgo", e.target.value)}
          style={{ ...baseInputStyle, resize: "vertical" }}
          placeholder="Qué podría aprovechar la debilidad y qué impacto tendría"
        />
      </div>

      {/* Row 7: Tríada CIA & Prioridad — Single Accent Color */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr", gap: 12 }}>
        {/* CIA Triad */}
        <div>
          <label style={labelStyle}>Tríada CIA</label>
          <div style={{ display: "flex", gap: 5 }}>
            {(
              [
                { key: "C", label: "Confidencialidad", short: "Conf." },
                { key: "I", label: "Integridad", short: "Integ." },
                { key: "A", label: "Disponibilidad", short: "Disp." },
              ] as const
            ).map((item) => {
              const active = finding.triadaCIA.includes(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleCIA(item.key)}
                  style={{
                    flex: 1,
                    padding: "5px 4px",
                    borderRadius: 4,
                    border: active
                      ? `1px solid ${ACCENT}`
                      : `1px solid ${inputBorder}`,
                    background: active
                      ? isDark
                        ? "rgba(24, 147, 255, 0.18)"
                        : "rgba(24, 147, 255, 0.12)"
                      : inputBg,
                    color: active ? ACCENT : textMuted,
                    fontWeight: active ? 700 : 500,
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                  title={item.label}
                >
                  [{item.key}] {item.short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label style={labelStyle}>Prioridad</label>
          <div style={{ display: "flex", gap: 5 }}>
            {(["Baja", "Media", "Alta", "Crítica"] as const).map((level) => {
              const active = finding.prioridad === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleFieldChange("prioridad", level as PriorityLevel)}
                  style={{
                    flex: 1,
                    padding: "5px 4px",
                    borderRadius: 4,
                    border: active
                      ? `1px solid ${ACCENT}`
                      : `1px solid ${inputBorder}`,
                    background: active
                      ? isDark
                        ? "rgba(24, 147, 255, 0.18)"
                        : "rgba(24, 147, 255, 0.12)"
                      : inputBg,
                    color: active ? ACCENT : textMuted,
                    fontWeight: active ? 700 : 500,
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 8: Acción */}
      <div>
        <label style={labelStyle}>Acción (Mitigación o Remediación)</label>
        <textarea
          rows={3}
          value={finding.accion}
          onChange={(e) => handleFieldChange("accion", e.target.value)}
          style={{ ...baseInputStyle, resize: "vertical" }}
          placeholder="Qué se hizo o debe hacerse para mitigar el riesgo (ej: sudo chmod 600 /etc/shadow)"
        />
      </div>

      {onDelete && (
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
          <button
            type="button"
            onClick={() => onDelete(finding.id)}
            style={{
              background: "transparent",
              border: "none",
              color: textMuted,
              fontSize: 11,
              cursor: "pointer",
              padding: "3px 6px",
              opacity: 0.7,
              transition: "opacity 120ms ease, color 120ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.color = textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.7";
              e.currentTarget.style.color = textMuted;
            }}
          >
            Eliminar entrada
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────
// COMPONENT: Summary View (Minimal Clean Consolidated Table)
// ─────────────────────────────────────────────────────────────
interface SummaryViewProps {
  findings: BitacoraFinding[];
  onSelectFinding: (id: string) => void;
  onResetTemplate?: () => void;
  isDark: boolean;
  textPrimary: string;
  textMuted: string;
  borderCol: string;
}

function SummaryView({
  findings,
  onSelectFinding,
  onResetTemplate,
  isDark,
  textPrimary,
  textMuted,
  borderCol,
}: SummaryViewProps) {
  const ACCENT = "#1893ff";

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: 6,
          background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.45)",
          border: `1px solid ${borderCol}`,
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 2px 0", fontSize: 13.5, fontWeight: 700, color: textPrimary }}>
            Cuaderno de Campo — Resumen Consolidado
          </h2>
          <span style={{ fontSize: 11.5, color: textMuted }}>
            {findings.length} hallazgo{findings.length === 1 ? "" : "s"} registrado{findings.length === 1 ? "" : "s"}.
          </span>
        </div>

        {onResetTemplate && (
          <button
            type="button"
            onClick={onResetTemplate}
            style={{
              padding: "4px 8px",
              borderRadius: 4,
              border: `1px solid ${borderCol}`,
              background: "transparent",
              color: textMuted,
              fontSize: 11,
              cursor: "pointer",
              transition: "all 120ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = textMuted)}
          >
            Restablecer Plantilla
          </button>
        )}
      </div>

      {/* Table view */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: 6,
          border: `1px solid ${borderCol}`,
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.4)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${borderCol}`,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                color: textMuted,
                fontSize: 11,
              }}
            >
              <th style={{ padding: "7px 10px" }}>ID</th>
              <th style={{ padding: "7px 10px" }}>Activo / Ruta</th>
              <th style={{ padding: "7px 10px" }}>Hallazgo</th>
              <th style={{ padding: "7px 10px" }}>Tríada</th>
              <th style={{ padding: "7px 10px" }}>Prioridad</th>
              <th style={{ padding: "7px 10px" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((f) => (
              <tr
                key={f.id}
                onClick={() => onSelectFinding(f.id)}
                style={{
                  borderBottom: `1px solid ${borderCol}`,
                  cursor: "pointer",
                  transition: "background 100ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <td style={{ padding: "7px 10px", fontWeight: 700, fontFamily: "ui-monospace, monospace", color: ACCENT }}>
                  {f.id}
                </td>
                <td style={{ padding: "7px 10px", fontWeight: 600, color: textPrimary, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.activo}
                </td>
                <td style={{ padding: "7px 10px", color: textPrimary, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.hallazgo}
                </td>
                <td style={{ padding: "7px 10px", color: textMuted }}>
                  {f.triadaCIA.join("/") || "—"}
                </td>
                <td style={{ padding: "7px 10px" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "1.5px 5px",
                      borderRadius: 3,
                      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                      border: `1px solid ${borderCol}`,
                      color: textMuted,
                    }}
                  >
                    {f.prioridad}
                  </span>
                </td>
                <td style={{ padding: "7px 10px", color: textMuted, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.accion}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// VECTOR ICONS (Minimalist OS aesthetic)
// ─────────────────────────────────────────────────────────────
function BitacoraNotebookIcon({ size = 16 }: { size?: number }) {
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

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function DocumentIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function TableIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <rect width={18} height={18} x={3} y={3} rx={2} />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
    </svg>
  );
}
