'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { notify } from '@react-ui-os/core'
import { useLab1Store, lab1Store } from '@/services/lab1/lab1Store'
import type { SiemEvent } from '@/services/lab1/types'

/* ─── Inline SVG Icons ─── */
function IconFolder({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconClock({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IconAlertTriangle({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}
function IconSearch({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}
function IconRefresh({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
  )
}
function IconFilter({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
function IconTerminal({ size = 13, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}
function IconSortAsc({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}

/* ─── Severity Dot ─── */
function SeverityDot({ sev }: { sev: SiemEvent['severity'] }) {
  const color =
    sev === 'Crítica' ? '#ef4444' :
    sev === 'Alta' ? '#f97316' :
    sev === 'Media' ? '#eab308' : '#3b82f6'
  return (
    <span style={{
      width: 8, height: 8, borderRadius: '50%',
      background: color, display: 'inline-block', flexShrink: 0,
      boxShadow: `0 0 6px ${color}88`,
    }} />
  )
}

/* ─── Auth Log Live Viewer ─── */
function AuthLogPanel({ fs, searchQuery }: { fs: Record<string, any>; searchQuery: string }) {
  const authLog = fs['/var/log/auth.log']
  const lines = authLog?.content?.split('\n').filter(Boolean) ?? []

  const filteredLines = searchQuery
    ? lines.filter((l: string) => l.toLowerCase().includes(searchQuery.toLowerCase()))
    : lines

  const getLineColor = (line: string) => {
    if (line.toLowerCase().includes('failed')) return '#ef4444'
    if (line.toLowerCase().includes('cleartext') || line.toLowerCase().includes('insecure')) return '#f97316'
    if (line.toLowerCase().includes('sudo')) return '#eab308'
    if (line.toLowerCase().includes('connection from')) return '#60a5fa'
    return 'rgba(255,255,255,0.6)'
  }

  const failedIps: string[] = Array.from(
    new Set(
      lines
        .filter((l: string) => l.toLowerCase().includes('failed'))
        .map((l: string) => {
          const m = l.match(/from\s+(\d+\.\d+\.\d+\.\d+)/)
          return m ? m[1] : null
        })
        .filter((ip: string | null): ip is string => Boolean(ip))
    )
  )

  return (
    <div>
      {searchQuery && filteredLines.length > 0 && failedIps.length > 0 && (
        <div style={{
          margin: '8px 16px',
          padding: '10px 14px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 7,
          fontSize: 11,
        }}>
          <strong style={{ color: '#ef4444' }}>🎯 IPs con autenticación fallida:</strong>{' '}
          {failedIps.map((ip, i) => (
            <code key={i} style={{
              background: 'rgba(239,68,68,0.15)', color: '#ef4444',
              padding: '1px 6px', borderRadius: 4, marginLeft: 4, fontSize: 11,
            }}>
              {ip}
            </code>
          ))}
          <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.5)', fontSize: 10.5 }}>
            Correlaciona con el SIEM: estos son los orígenes del ataque de fuerza bruta.
          </div>
        </div>
      )}
      <div style={{
        margin: '0 16px 16px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '7px 12px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          fontSize: 11, color: 'rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <IconTerminal size={12} />
          /var/log/auth.log — {filteredLines.length} líneas {searchQuery ? `(filtradas: "${searchQuery}")` : ''}
        </div>
        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {filteredLines.map((line: string, i: number) => (
            <div key={i} style={{
              padding: '3px 12px',
              fontSize: 10.5,
              fontFamily: 'ui-monospace, monospace',
              color: getLineColor(line),
              lineHeight: 1.65,
              borderBottom: '1px solid rgba(255,255,255,0.025)',
            }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── NTP Banner ─── */
function NtpBanner({ isNtpSynced, onStartNtp }: { isNtpSynced: boolean; onStartNtp: () => void }) {
  if (isNtpSynced) return null
  return (
    <div style={{
      margin: '10px 16px',
      padding: '12px 16px',
      background: 'rgba(234,179,8,0.08)',
      border: '1px solid rgba(234,179,8,0.35)',
      borderRadius: 10,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <IconAlertTriangle size={20} color="#eab308" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#eab308', marginBottom: 3 }}>
          ⏰ Reloj del Sistema Desincronizado — Timestamps Corruptos
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 8 }}>
          El servicio NTP está <strong>detenido</strong>. Los eventos del SIEM muestran fechas incoherentes
          (mezcla de 1999 y 2026). La línea de tiempo del incidente es imposible de reconstruir.
          Para sincronizar el reloj y ordenar los eventos, ve a la terminal y ejecuta:
        </div>
        <code style={{
          display: 'block', padding: '6px 10px',
          background: 'rgba(0,0,0,0.4)', borderRadius: 5,
          fontSize: 11, color: '#fde047', marginBottom: 8,
          fontFamily: 'ui-monospace, monospace',
        }}>
          sudo systemctl start ntp.service
        </code>
        <button
          type="button"
          onClick={onStartNtp}
          id="siem-start-ntp-btn"
          style={{
            padding: '6px 14px', fontSize: 11, fontWeight: 700,
            background: 'rgba(234,179,8,0.15)', color: '#eab308',
            border: '1px solid rgba(234,179,8,0.4)', borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          ▶ Simular: sudo systemctl start ntp.service
        </button>
      </div>
    </div>
  )
}

/* ─── Main SIEM App ─── */
export function ArgosSiemApp() {
  const state = useLab1Store()
  const { siemEvents, fs, isNtpSynced, processes } = state

  const [activeTab, setActiveTab] = useState<'eventos' | 'authlog'>('eventos')
  const [selectedEventId, setSelectedEventId] = useState<string>('SIEM-001')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrigin, setSelectedOrigin] = useState('Todos')
  const [selectedSeverity, setSelectedSeverity] = useState('Todas')
  const [justSynced, setJustSynced] = useState(false)

  // Trigger animation when NTP syncs
  useEffect(() => {
    if (isNtpSynced) {
      setJustSynced(true)
      const t = setTimeout(() => setJustSynced(false), 2000)
      return () => clearTimeout(t)
    }
  }, [isNtpSynced])

  /* ── Filtering ── */
  const filteredEvents = useMemo(() => {
    return siemEvents.filter(evt => {
      const matchOrigin = selectedOrigin === 'Todos' || evt.origin.includes(selectedOrigin)
      const matchSev = selectedSeverity === 'Todas' || evt.severity === selectedSeverity
      const q = searchQuery.toLowerCase().trim()
      const matchSearch = !q ||
        evt.id.toLowerCase().includes(q) ||
        evt.event.toLowerCase().includes(q) ||
        evt.rawLog.toLowerCase().includes(q) ||
        (evt.sourceIp?.toLowerCase().includes(q) ?? false)
      return matchOrigin && matchSev && matchSearch
    })
  }, [siemEvents, selectedOrigin, selectedSeverity, searchQuery])

  const selectedEvent = siemEvents.find(e => e.id === selectedEventId) ?? siemEvents[0]

  /* ── NTP handler ── */
  const handleStartNtp = () => {
    const result = lab1Store.startService('ntp.service', 'root')
    if (result.success) {
      notify({
        appId: 'siem',
        title: '⏰ Cinta de Correlación — NTP Sincronizado',
        body: '¡Los eventos se ordenaron cronológicamente! La historia del incidente es ahora legible.',
        level: 'success',
      })
    }
  }

  /* ── Sidebar item style ── */
  const sidebarBtn = (active: boolean) => ({
    width: '100%', textAlign: 'left' as const,
    padding: '7px 12px', fontSize: 11.5, fontWeight: 600,
    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.45)',
    border: 'none',
    borderLeft: `2px solid ${active ? '#3b82f6' : 'transparent'}`,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 7,
    transition: 'all 0.14s',
  })

  /* ── Origin icon map ── */
  const originEmoji: Record<string, string> = {
    'Auth Log': '🔑',
    'Red / Zeek': '🌐',
    'Syslog / Audit': '📋',
    'Kernel / eBPF': '⚙️',
    'FIM / Integridad': '🔒',
  }

  /* ── Severity color ── */
  const sevColor: Record<string, string> = {
    'Crítica': '#ef4444',
    'Alta': '#f97316',
    'Media': '#eab308',
    'Informativa': '#3b82f6',
  }

  const critCount = siemEvents.filter(e => e.severity === 'Crítica').length
  const highCount = siemEvents.filter(e => e.severity === 'Alta').length

  return (
    <div style={{
      display: 'flex', height: '100%', minHeight: 0,
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a2f 100%)',
      color: 'rgba(255,255,255,0.88)',
      fontFamily: 'system-ui, sans-serif',
      overflow: 'hidden',
    }}>
      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width: 210, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        background: 'rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span style={{ fontSize: 18 }}>📡</span>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.3 }}>Cinta de Correlación</span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
            Argos SIEM · invernadero-central
          </div>

          {/* NTP status indicator */}
          <div style={{
            marginTop: 10, padding: '5px 8px',
            background: isNtpSynced ? 'rgba(34,197,94,0.08)' : 'rgba(234,179,8,0.08)',
            border: `1px solid ${isNtpSynced ? 'rgba(34,197,94,0.25)' : 'rgba(234,179,8,0.25)'}`,
            borderRadius: 6, fontSize: 10, fontWeight: 700,
            color: isNtpSynced ? '#22c55e' : '#eab308',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <IconClock size={11} color={isNtpSynced ? '#22c55e' : '#eab308'} />
            {isNtpSynced ? 'NTP Sincronizado ✓' : 'Reloj Desincronizado ⚠'}
          </div>

          {/* Stats */}
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 8,
              background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontWeight: 700,
            }}>
              {critCount} críticos
            </span>
            <span style={{
              fontSize: 10, padding: '2px 7px', borderRadius: 8,
              background: 'rgba(249,115,22,0.12)', color: '#f97316', fontWeight: 700,
            }}>
              {highCount} altos
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button type="button" style={sidebarBtn(activeTab === 'eventos')} onClick={() => setActiveTab('eventos')}>
            <IconFolder size={14} />
            Eventos SIEM
          </button>
          <button type="button" style={sidebarBtn(activeTab === 'authlog')} onClick={() => setActiveTab('authlog')}>
            <IconTerminal size={14} />
            /var/log/auth.log
          </button>
        </div>

        {/* Origin filters */}
        {activeTab === 'eventos' && (
          <div style={{ padding: '8px 0' }}>
            <div style={{
              padding: '4px 14px',
              fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8,
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const,
            }}>
              Origen de Eventos
            </div>
            {['Todos', 'Auth', 'Red', 'Syslog', 'Kernel', 'FIM'].map(orig => (
              <button key={orig} type="button"
                style={sidebarBtn(selectedOrigin === orig)}
                onClick={() => setSelectedOrigin(orig)}
              >
                <span style={{ fontSize: 13 }}>
                  {orig === 'Todos' ? '📁' : orig === 'Auth' ? '🔑' : orig === 'Red' ? '🌐' : orig === 'Syslog' ? '📋' : orig === 'Kernel' ? '⚙️' : '🔒'}
                </span>
                {orig === 'Todos' ? 'Todos los Eventos' :
                 orig === 'Auth' ? 'Auth Log' :
                 orig === 'Red' ? 'Red / Zeek' :
                 orig === 'Syslog' ? 'Syslog / Audit' :
                 orig === 'Kernel' ? 'Kernel / eBPF' : 'FIM / Integridad'}
              </button>
            ))}

            <div style={{
              padding: '6px 14px 4px',
              fontSize: 9.5, fontWeight: 700, letterSpacing: 0.8,
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const,
              marginTop: 4,
            }}>
              Severidad
            </div>
            {['Todas', 'Crítica', 'Alta', 'Media', 'Informativa'].map(sev => (
              <button key={sev} type="button"
                style={sidebarBtn(selectedSeverity === sev)}
                onClick={() => setSelectedSeverity(selectedSeverity === sev ? 'Todas' : sev)}
              >
                {sev !== 'Todas' && <SeverityDot sev={sev as SiemEvent['severity']} />}
                {sev}
              </button>
            ))}
          </div>
        )}

        {/* NTP tip in sidebar */}
        {!isNtpSynced && activeTab === 'eventos' && (
          <div style={{
            margin: '8px', padding: '8px',
            background: 'rgba(234,179,8,0.07)',
            border: '1px solid rgba(234,179,8,0.2)',
            borderRadius: 6, fontSize: 9.5,
            color: 'rgba(255,255,255,0.55)',
            marginTop: 'auto',
          }}>
            💡 Los eventos están desordenados. Activa el NTP para revelar la historia real.
          </div>
        )}
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          padding: '8px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,0,0,0.2)',
          flexWrap: 'wrap' as const,
        }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, padding: '4px 10px', flex: 1, minWidth: 160,
          }}>
            <IconSearch size={13} color="rgba(255,255,255,0.4)" />
            <input
              id="siem-search-input"
              type="text"
              placeholder={activeTab === 'authlog' ? 'grep -i &quot;failed&quot; auth.log...' : 'Buscar eventos, IPs, reglas...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 11.5, color: 'rgba(255,255,255,0.85)',
              }}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13 }}
              >×</button>
            )}
          </div>

          <button
            type="button"
            id="siem-reset-filters"
            onClick={() => { setSelectedOrigin('Todos'); setSelectedSeverity('Todas'); setSearchQuery('') }}
            style={{
              padding: '5px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            }}
          >
            <IconRefresh size={12} /> Limpiar
          </button>

          {!isNtpSynced && (
            <button
              type="button"
              id="siem-start-ntp-toolbar"
              onClick={handleStartNtp}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(234,179,8,0.12)', color: '#eab308',
                border: '1px solid rgba(234,179,8,0.35)', borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              ⏰ Iniciar NTP
            </button>
          )}

          {isNtpSynced && (
            <div style={{
              padding: '4px 10px', fontSize: 11, fontWeight: 700,
              background: 'rgba(34,197,94,0.1)', color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <IconSortAsc size={11} color="#22c55e" /> Ordenado cronológicamente
            </div>
          )}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {/* ── EVENTOS TAB ── */}
          {activeTab === 'eventos' && (
            <>
              {/* NTP Banner */}
              <NtpBanner isNtpSynced={isNtpSynced} onStartNtp={handleStartNtp} />

              {/* Timeline scramble notice */}
              {!isNtpSynced && (
                <div style={{
                  margin: '0 16px 8px',
                  padding: '6px 12px',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: 6, fontSize: 10.5,
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  ⚠ Los timestamps están desordenados — años 1999 mezclados con 2026. Activa NTP para revelar la línea de tiempo real del incidente.
                </div>
              )}

              {/* Synced celebration */}
              {justSynced && (
                <div style={{
                  margin: '0 16px 8px',
                  padding: '8px 14px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: 8, fontSize: 11.5,
                  color: '#22c55e', fontWeight: 700,
                  animation: 'pulse 0.5s ease',
                }}>
                  ✅ ¡NTP sincronizado! Los eventos ahora revelan cronológicamente cómo ocurrió el incidente.
                </div>
              )}

              {/* Column headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '14px 140px 1fr 90px 70px',
                gap: 8, padding: '6px 14px',
                fontSize: 9.5, fontWeight: 700, letterSpacing: 0.7,
                color: 'rgba(255,255,255,0.3)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                textTransform: 'uppercase' as const,
              }}>
                <span />
                <span>
                  Timestamp {isNtpSynced ? <IconSortAsc size={10} color="#22c55e" /> : '⚠'}
                </span>
                <span>Evento</span>
                <span>Severidad</span>
                <span>Origen</span>
              </div>

              {/* Event rows */}
              {filteredEvents.map(evt => {
                const isSelected = evt.id === selectedEventId
                const sColor = sevColor[evt.severity] || '#3b82f6'
                const isScrambled = !isNtpSynced && (
                  evt.timestampDisplay.includes('1999') ||
                  evt.timestampDisplay !== evt.timestampOriginal
                )

                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '14px 140px 1fr 90px 70px',
                      gap: 8, padding: '8px 14px',
                      background: isSelected ? 'rgba(59,130,246,0.07)' : 'transparent',
                      borderLeft: `2px solid ${isSelected ? sColor : 'transparent'}`,
                      borderBottom: '1px solid rgba(255,255,255,0.035)',
                      cursor: 'pointer',
                      alignItems: 'center',
                      transition: 'background 0.12s',
                    }}
                  >
                    <SeverityDot sev={evt.severity} />
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10 }}>
                      <span style={{ color: isScrambled ? '#f97316' : 'rgba(255,255,255,0.6)' }}>
                        {evt.timestampDisplay}
                      </span>
                      {isScrambled && <div style={{ fontSize: 9, color: '#f97316' }}>⚠ Reloj sin sincronizar</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>
                        {evt.event}
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace' }}>
                        {evt.ruleId}
                        {evt.sourceIp && <span style={{ marginLeft: 8, color: '#ef4444' }}>src: {evt.sourceIp}</span>}
                        {evt.isCleartextLeak && <span style={{ marginLeft: 6, color: '#f97316', fontWeight: 700 }}>⚡ CLEARTEXT</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 4,
                        background: `${sColor}18`, color: sColor, fontWeight: 700,
                      }}>
                        {evt.severity}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 10, color: 'rgba(255,255,255,0.45)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {originEmoji[evt.origin] ?? '📄'} {evt.origin.split('/')[0].trim()}
                    </div>
                  </div>
                )
              })}

              {filteredEvents.length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  Sin eventos que coincidan con los filtros.
                </div>
              )}

              {/* Selected event inspector */}
              {selectedEvent && (
                <div style={{
                  margin: '12px 16px',
                  padding: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                    🔍 Inspector: <code style={{ color: '#60a5fa' }}>{selectedEvent.id}</code>
                    {' — '}{selectedEvent.event}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                    {[
                      ['ID', selectedEvent.id],
                      ['Timestamp Real', selectedEvent.timestampOriginal],
                      ['Técnica MITRE', selectedEvent.mitreTechnique],
                      ['Detalle', selectedEvent.evidenceDetail],
                    ].map(([k, v]) => (
                      <div key={k} style={{
                        padding: '6px 8px',
                        background: 'rgba(255,255,255,0.03)', borderRadius: 5,
                      }}>
                        <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.35)', marginBottom: 2, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>
                          {k}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: 6, padding: '8px 10px',
                    fontSize: 10, fontFamily: 'ui-monospace, monospace',
                    color: '#22c55e', lineHeight: 1.65,
                    border: '1px solid rgba(255,255,255,0.05)',
                    overflowX: 'auto' as const,
                  }}>
                    {selectedEvent.rawLog}
                  </div>
                </div>
              )}

              {/* Auth log grep tip */}
              {searchQuery && activeTab === 'eventos' && (
                <div style={{
                  margin: '0 16px 16px',
                  padding: '8px 12px',
                  background: 'rgba(59,130,246,0.07)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: 7, fontSize: 11,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  💡 Para buscar en el log real:{' '}
                  <code style={{ color: '#93c5fd' }}>grep -i "{searchQuery}" /var/log/auth.log</code>
                </div>
              )}
            </>
          )}

          {/* ── AUTH LOG TAB ── */}
          {activeTab === 'authlog' && (
            <div style={{ paddingTop: 12 }}>
              <div style={{
                margin: '0 16px 10px',
                padding: '10px 14px',
                background: 'rgba(59,130,246,0.07)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 8, fontSize: 11,
                color: 'rgba(255,255,255,0.65)', lineHeight: 1.6,
              }}>
                <strong style={{ color: '#60a5fa' }}>📖 Correlación causa-efecto:</strong>{' '}
                Cada <code>sudo</code>, fallo de autenticación o cambio de permisos que ejecutes en la terminal
                aparece aquí como una línea nueva. Busca{' '}
                <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0 4px', borderRadius: 3 }}>
                  grep -i "failed" /var/log/auth.log
                </code>
                {' '}para encontrar la IP del atacante que el SIEM estaba señalando.
              </div>
              <AuthLogPanel fs={fs} searchQuery={searchQuery} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ArgosSiemApp
