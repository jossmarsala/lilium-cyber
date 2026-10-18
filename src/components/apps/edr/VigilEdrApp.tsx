'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { notify } from '@react-ui-os/core'
import { useLab1Store, lab1Store } from '@/services/lab1/lab1Store'
import type { EdrDetectionAlert, SystemProcess } from '@/services/lab1/types'
import styles from './VigilEdrApp.module.css'

/* ─── Tiny inline SVG icons ─── */
function IconShield({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconCpu({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    </svg>
  )
}
function IconBiohazard({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="11.9" r="2" />
      <path d="M6.7 3.4a9 9 0 0 0 0 12.4l1.4-1.4a7 7 0 0 1 0-9.6L6.7 3.4z" />
      <path d="M17.3 3.4a9 9 0 0 1 0 12.4l-1.4-1.4a7 7 0 0 0 0-9.6l1.4-1.4z" />
      <path d="M6.7 20.6a9 9 0 0 0 10.6 0l-1.4-1.4a7 7 0 0 1-7.8 0l-1.4 1.4z" />
    </svg>
  )
}
function IconCheck({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconX({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconTerminal({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}
function IconRefresh({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
  )
}
function IconLeaf({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

/* ─── Severity & classification color utils ─── */
function severityColor(sev: string) {
  if (sev === 'Crítica') return '#ef4444'
  if (sev === 'Alta') return '#f97316'
  if (sev === 'Media') return '#eab308'
  return '#3b82f6'
}

function classColor(cls: EdrDetectionAlert['classification']) {
  if (cls === 'threat') return '#ef4444'
  if (cls === 'false_positive') return '#eab308'
  return '#22c55e'
}

/* ─── Health Bar Component ─── */
function HealthBar({ score, label }: { score: number; label: string }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600 }}>
        <span style={{ opacity: 0.7 }}>{label}</span>
        <span style={{ color }}>{score}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: color,
            borderRadius: 3,
            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1), background 0.4s',
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  )
}

/* ─── Process Row ─── */
function ProcessRow({ proc, onKill }: { proc: SystemProcess; onKill?: (pid: number) => void }) {
  const isRunning = proc.status === 'running'
  const cls = proc.edrClassification
  const rowColor =
    cls === 'threat' ? 'rgba(239,68,68,0.06)' :
    cls === 'false_positive' ? 'rgba(234,179,8,0.06)' :
    'transparent'
  const badgeColor =
    cls === 'threat' ? '#ef4444' :
    cls === 'false_positive' ? '#eab308' :
    '#22c55e'
  const badgeLabel =
    cls === 'threat' ? '⚠ AMENAZA' :
    cls === 'false_positive' ? '? Sospechoso' :
    '✓ Limpio'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '48px 64px 1fr 60px 60px auto',
      alignItems: 'center',
      gap: 8,
      padding: '7px 12px',
      background: rowColor,
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      fontSize: 11.5,
      fontFamily: 'ui-monospace, monospace',
    }}>
      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{proc.pid || '—'}</span>
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{proc.user}</span>
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: isRunning ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
      }}>
        {proc.command}
      </span>
      <span style={{ color: proc.cpu > 50 ? '#ef4444' : 'rgba(255,255,255,0.6)', textAlign: 'right', fontSize: 11 }}>
        {proc.cpu.toFixed(1)}%
      </span>
      <span style={{
        display: 'inline-block',
        padding: '2px 7px',
        borderRadius: 4,
        background: `${badgeColor}22`,
        color: badgeColor,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: 'sans-serif',
        whiteSpace: 'nowrap',
      }}>
        {badgeLabel}
      </span>
      {cls === 'threat' && isRunning && onKill ? (
        <button
          type="button"
          onClick={() => onKill(proc.pid)}
          style={{
            padding: '3px 8px', fontSize: 10, fontWeight: 700,
            background: 'rgba(239,68,68,0.15)', color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4,
            cursor: 'pointer', fontFamily: 'sans-serif',
          }}
          title={`kill -15 ${proc.pid}`}
        >
          kill -15
        </button>
      ) : <span />}
    </div>
  )
}

/* ─── Alert Card ─── */
function AlertCard({
  alert,
  isSelected,
  onClick,
  onMarkFP,
  onTerminate,
}: {
  alert: EdrDetectionAlert
  isSelected: boolean
  onClick: () => void
  onMarkFP?: () => void
  onTerminate?: () => void
}) {
  const sColor = severityColor(alert.severity)
  const cColor = classColor(alert.classification)
  const statusColor =
    alert.status === 'Contenido (Mitigado)' ? '#22c55e' :
    alert.status === 'Actividad Legítima Validada' ? '#22c55e' :
    sColor

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 14px',
        background: isSelected ? 'rgba(255,255,255,0.07)' : 'transparent',
        borderLeft: `3px solid ${isSelected ? cColor : 'transparent'}`,
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: `${cColor}18`, border: `1px solid ${cColor}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {alert.classification === 'threat' ? <IconBiohazard size={16} color={cColor} /> :
           alert.classification === 'false_positive' ? <IconLeaf size={16} color="#eab308" /> :
           <IconCheck size={16} color="#22c55e" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
            <span style={{
              fontSize: 12, fontWeight: 700,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              color: 'rgba(255,255,255,0.92)',
            }}>
              {alert.title}
            </span>
            <span style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 3,
              background: `${sColor}22`, color: sColor, fontWeight: 700, flexShrink: 0,
            }}>
              {alert.severity}
            </span>
          </div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontFamily: 'ui-monospace, monospace' }}>
            {alert.targetIdentifier}
          </div>
          <div style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 10,
            background: `${statusColor}18`, color: statusColor,
            border: `1px solid ${statusColor}30`, display: 'inline-block', fontWeight: 600,
          }}>
            {alert.status}
          </div>
        </div>
      </div>

      {isSelected && !alert.resolved && (
        <div style={{
          marginTop: 10, padding: '8px 10px',
          background: 'rgba(255,255,255,0.04)', borderRadius: 6,
          fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55,
        }}>
          <strong style={{ color: 'rgba(255,255,255,0.85)' }}>💡 Consejo:</strong>{' '}
          {alert.investigationTip}
        </div>
      )}

      {isSelected && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {alert.canMarkFalsePositive && !alert.resolved && onMarkFP && (
            <button
              type="button"
              id={`edr-fp-${alert.id}`}
              onClick={(e) => { e.stopPropagation(); onMarkFP() }}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 700,
                background: 'rgba(234,179,8,0.12)', color: '#eab308',
                border: '1px solid rgba(234,179,8,0.35)', borderRadius: 5,
                cursor: 'pointer',
              }}
            >
              ✓ Marcar como Falso Positivo / Permitir
            </button>
          )}
          {alert.classification === 'threat' && !alert.resolved && onTerminate && (
            <button
              type="button"
              id={`edr-terminate-${alert.id}`}
              onClick={(e) => { e.stopPropagation(); onTerminate() }}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 700,
                background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.35)', borderRadius: 5,
                cursor: 'pointer',
              }}
            >
              ⚡ Contener / Terminar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Main App ─── */
export function VigilEdrApp() {
  const state = useLab1Store()
  const [activeTab, setActiveTab] = useState<'alertas' | 'procesos' | 'tmp'>('alertas')
  const [selectedAlertId, setSelectedAlertId] = useState<string>('EDR-THREAT-01')

  const { edrAlerts, processes, fs, cia, totalCpuPercent, isNtpSynced } = state

  /* ── Derived stats for health bar ── */
  const overallHealth = cia.overallScore
  const threatCount = edrAlerts.filter(a => a.classification === 'threat' && !a.resolved).length
  const fpCount = edrAlerts.filter(a => a.classification === 'false_positive' && !a.resolved).length
  const resolvedCount = edrAlerts.filter(a => a.resolved).length

  const healthColor = overallHealth >= 80 ? '#22c55e' : overallHealth >= 50 ? '#eab308' : '#ef4444'
  const healthLabel = overallHealth >= 80 ? '🟢 Sistema Saludable' : overallHealth >= 50 ? '🟡 Degradado' : '🔴 Crítico'

  /* ── /tmp files listing ── */
  const tmpFiles = useMemo(() => {
    return Object.entries(fs)
      .filter(([path]) => path.startsWith('/tmp/') && path !== '/tmp/')
      .map(([path, node]) => ({ path, node }))
  }, [fs])

  /* ── Handlers ── */
  const handleMarkFalsePositive = (alertId: string) => {
    const result = lab1Store.markEdrResolution(alertId, 'allow_false_positive')
    notify({
      appId: 'edr',
      title: 'BioMonitor EDR — Falso Positivo Validado',
      body: 'riego_nocturno.sh reconocido como actividad legítima. Helechos en buen estado 🌿',
      level: 'success',
    })
    return result
  }

  const handleTerminate = (alertId: string) => {
    const result = lab1Store.markEdrResolution(alertId, 'terminate')
    notify({
      appId: 'edr',
      title: 'BioMonitor EDR — Proceso Contenido',
      body: 'SIGTERM enviado. Baliza C2 desconectada. Salud del host recuperando...',
      level: 'success',
    })
    return result
  }

  const handleKillPid = (pid: number) => {
    const result = lab1Store.killProcess(pid, 15, 'root')
    if (result.success) {
      notify({
        appId: 'edr',
        title: 'BioMonitor EDR — kill -15 ejecutado',
        body: `PID ${pid} terminado con SIGTERM. Monitorea la barra de salud.`,
        level: 'success',
      })
    }
  }

  const handleQuarantineFile = (alertId: string) => {
    const result = lab1Store.markEdrResolution(alertId, 'quarantine')
    notify({
      appId: 'edr',
      title: 'Archivo en Cuarentena',
      body: 'Artefacto movido a /root/cuarentena/ y aislado.',
      level: 'success',
    })
    return result
  }

  /* ── Sidebar tab style ── */
  const tabStyle = (active: boolean) => ({
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
    color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.45)',
    border: 'none',
    borderLeft: `2px solid ${active ? '#22c55e' : 'transparent'}`,
    display: 'flex', alignItems: 'center', gap: 8,
    textAlign: 'left' as const,
    transition: 'all 0.15s',
    width: '100%',
  })

  return (
    <div style={{
      display: 'flex', height: '100%', minHeight: 0,
      background: 'linear-gradient(135deg, #0d1117 0%, #0f1923 100%)',
      color: 'rgba(255,255,255,0.88)',
      fontFamily: 'system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width: 220, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        background: 'rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <IconShield size={20} color="#22c55e" />
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.3 }}>BioMonitor EDR</span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
            invernadero-central · Monitor Biológico del Host
          </div>

          {/* Overall Health */}
          <div style={{
            padding: '8px 10px',
            background: `${healthColor}12`,
            border: `1px solid ${healthColor}30`,
            borderRadius: 7,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: healthColor, marginBottom: 4 }}>
              {healthLabel}
            </div>
            <HealthBar score={overallHealth} label="Salud del Host" />
          </div>
        </div>

        {/* Stats pills */}
        <div style={{ padding: '8px 14px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontWeight: 700 }}>
            {threatCount} amenazas
          </span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: 'rgba(234,179,8,0.12)', color: '#eab308', fontWeight: 700 }}>
            {fpCount} sospechosos
          </span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontWeight: 700 }}>
            {resolvedCount} resueltos
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '6px 0' }}>
          <button type="button" style={tabStyle(activeTab === 'alertas')} onClick={() => setActiveTab('alertas')}>
            <IconShield size={15} color={activeTab === 'alertas' ? '#22c55e' : undefined} />
            Alertas EDR
          </button>
          <button type="button" style={tabStyle(activeTab === 'procesos')} onClick={() => setActiveTab('procesos')}>
            <IconCpu size={15} color={activeTab === 'procesos' ? '#22c55e' : undefined} />
            Procesos del Host
          </button>
          <button type="button" style={tabStyle(activeTab === 'tmp')} onClick={() => setActiveTab('tmp')}>
            <IconTerminal size={15} color={activeTab === 'tmp' ? '#22c55e' : undefined} />
            Directorio /tmp
          </button>
        </nav>

        {/* CIA mini gauges */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <HealthBar score={cia.confidentiality.score} label="Confidencialidad" />
          <HealthBar score={cia.integrity.score} label="Integridad" />
          <HealthBar score={cia.availability.score} label="Disponibilidad" />
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header bar */}
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(0,0,0,0.2)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>
            {activeTab === 'alertas' && '🛡 Alertas Activas del BioMonitor'}
            {activeTab === 'procesos' && '⚙️ Tabla de Procesos — ps aux'}
            {activeTab === 'tmp' && '📁 Directorio /tmp — Archivos Temporales'}
          </span>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconCpu size={12} />
            CPU total: <strong style={{ color: totalCpuPercent > 50 ? '#ef4444' : 'rgba(255,255,255,0.7)' }}>{totalCpuPercent}%</strong>
          </div>
          {!isNtpSynced && (
            <div style={{
              padding: '2px 8px', fontSize: 10, borderRadius: 4,
              background: 'rgba(234,179,8,0.15)', color: '#eab308',
              border: '1px solid rgba(234,179,8,0.3)', fontWeight: 600,
            }}>
              ⚠ NTP desincronizado
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {/* ── ALERTS TAB ── */}
          {activeTab === 'alertas' && (
            <div>
              {/* Tip banner */}
              <div style={{
                margin: '12px 16px 0',
                padding: '10px 14px',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 8, fontSize: 11,
                color: 'rgba(255,255,255,0.65)', lineHeight: 1.6,
              }}>
                <strong style={{ color: '#60a5fa' }}>🔬 Metodología:</strong>{' '}
                Antes de actuar, verifica en la terminal. Para el falso positivo:{' '}
                <code style={{ background: 'rgba(255,255,255,0.07)', padding: '0 4px', borderRadius: 3 }}>
                  cat /opt/sensores/riego_nocturno.sh
                </code>
                {' '}· Para la amenaza real:{' '}
                <code style={{ background: 'rgba(255,255,255,0.07)', padding: '0 4px', borderRadius: 3 }}>
                  ps aux | grep polilla
                </code>
              </div>

              {/* Alert list */}
              <div style={{ marginTop: 8 }}>
                {edrAlerts.map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlertId === alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    onMarkFP={alert.canMarkFalsePositive ? () => handleMarkFalsePositive(alert.id) : undefined}
                    onTerminate={alert.classification === 'threat' && alert.targetType === 'process'
                      ? () => handleTerminate(alert.id)
                      : alert.classification === 'threat' && alert.targetType === 'file'
                      ? () => handleQuarantineFile(alert.id)
                      : undefined}
                  />
                ))}
              </div>

              {/* FP detail: riego_nocturno */}
              {(() => {
                const fp = edrAlerts.find(a => a.id === 'EDR-FP-02')
                if (!fp || fp.resolved) return null
                const fpNode = fs['/opt/sensores/riego_nocturno.sh']
                if (!fpNode?.content) return null
                return (
                  <div style={{
                    margin: '0 16px 16px',
                    padding: '12px 14px',
                    background: 'rgba(234,179,8,0.05)',
                    border: '1px solid rgba(234,179,8,0.2)',
                    borderRadius: 8,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#eab308', marginBottom: 6 }}>
                      📄 Vista previa: /opt/sensores/riego_nocturno.sh
                    </div>
                    <pre style={{
                      fontSize: 10.5, margin: 0, lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'ui-monospace, monospace',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}>
                      {fpNode.content.slice(0, 600)}
                    </pre>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                      Este script solo riega los helechos. ¿Confirmas que es una actividad legítima?
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* ── PROCESSES TAB ── */}
          {activeTab === 'procesos' && (
            <div>
              {/* Column headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '48px 64px 1fr 60px 60px auto',
                gap: 8, padding: '8px 12px',
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                color: 'rgba(255,255,255,0.35)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                fontFamily: 'ui-monospace, monospace',
                textTransform: 'uppercase' as const,
              }}>
                <span>PID</span>
                <span>USUARIO</span>
                <span>COMANDO</span>
                <span style={{ textAlign: 'right' }}>CPU%</span>
                <span>ESTADO EDR</span>
                <span></span>
              </div>
              {processes.map(proc => (
                <ProcessRow key={proc.pid} proc={proc} onKill={handleKillPid} />
              ))}
              <div style={{
                padding: '10px 14px',
                fontSize: 11, color: 'rgba(255,255,255,0.4)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}>
                💡 Usa la terminal: <code>ps aux | grep polilla</code> · <code>kill -15 4412</code> · <code>file /tmp/catalogo_orquideas.pdf</code>
              </div>
            </div>
          )}

          {/* ── /TMP TAB ── */}
          {activeTab === 'tmp' && (
            <div>
              <div style={{
                padding: '12px 16px 6px',
                fontSize: 11, color: 'rgba(255,255,255,0.5)',
              }}>
                Archivos en <code style={{ color: '#60a5fa' }}>/tmp</code> — zona de escritura pública y volátil.
                Verifica cada archivo con <code>file &lt;ruta&gt;</code> en la terminal.
              </div>

              {tmpFiles.length === 0 && (
                <div style={{
                  padding: '32px 16px', textAlign: 'center',
                  fontSize: 12, color: '#22c55e',
                }}>
                  ✅ /tmp está limpio — ningún artefacto sospechoso.
                </div>
              )}

              {tmpFiles.map(({ path, node }) => {
                const isElf = node.magic && node.magic.includes('ELF')
                const isHidden = path.split('/').pop()?.startsWith('.')
                const riskColor = isElf ? '#ef4444' : isHidden ? '#f97316' : 'rgba(255,255,255,0.5)'
                return (
                  <div key={path} style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: isElf ? 'rgba(239,68,68,0.05)' : isHidden ? 'rgba(249,115,22,0.04)' : 'transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 11.5, fontFamily: 'ui-monospace, monospace',
                        color: riskColor, fontWeight: 600,
                      }}>
                        {path}
                      </span>
                      {isElf && (
                        <span style={{
                          fontSize: 9, padding: '1px 5px', borderRadius: 3,
                          background: 'rgba(239,68,68,0.2)', color: '#ef4444',
                          fontWeight: 700,
                        }}>
                          ⚠ EJECUTABLE ELF
                        </span>
                      )}
                      {isHidden && !isElf && (
                        <span style={{
                          fontSize: 9, padding: '1px 5px', borderRadius: 3,
                          background: 'rgba(249,115,22,0.2)', color: '#f97316',
                          fontWeight: 700,
                        }}>
                          ARCHIVO OCULTO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace' }}>
                      {node.magic} · {node.size} bytes · {node.perms} · {node.owner}
                    </div>
                    {isElf && (
                      <div style={{ fontSize: 10, color: '#ef4444', marginTop: 4 }}>
                        💣 Binario camuflado. Investiga: <code>file {path}</code> y elimina: <code>rm {path}</code>
                      </div>
                    )}
                  </div>
                )
              })}

              <div style={{
                padding: '10px 16px',
                fontSize: 11, color: 'rgba(255,255,255,0.35)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}>
                🔬 Comandos útiles en terminal: <code>ls -la /tmp</code> · <code>file /tmp/catalogo_orquideas.pdf</code> · <code>rm /tmp/catalogo_orquideas.pdf</code>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default VigilEdrApp
