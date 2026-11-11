#!/usr/bin/env node
/**
 * scripts/docs-to-pdf-condensed.mjs
 *
 * Condensed, executive edition of the LILIUM playbook.
 * Keeps every module, subsection and sub-subsection, but replaces the full
 * content with a short lead + one-line summaries per topic. Detailed steps,
 * code blocks, tables, groups, file trees and diagrams are dropped.
 *
 * The original docs (docs/*.md, src/data/docs.json) and the full PDF
 * generator (scripts/docs-to-pdf.mjs) are left untouched.
 *
 * Usage:
 *   npm run docs:pdf:condensed
 *   node scripts/docs-to-pdf-condensed.mjs --keep-html
 *   node scripts/docs-to-pdf-condensed.mjs --showcase    # include Component Showcase
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS_JSON = path.join(ROOT, 'src/data/docs.json')
const OUT_DIR = path.join(ROOT, 'dist-pdf')
const HTML_OUT = path.join(OUT_DIR, 'lilium-documentacion-condensada.html')
const PDF_OUT = path.join(OUT_DIR, 'LILIUM-Documentacion-Condensada.pdf')

const argv = new Set(process.argv.slice(2))
const KEEP_HTML = argv.has('--keep-html')
const INCLUDE_SHOWCASE = argv.has('--showcase')

/* ═══════════════════════════════════════════════════════════════════
   LENGTH BUDGET  — tune these to move the page count up or down
   ═══════════════════════════════════════════════════════════════════ */
const CFG = {
  leadSentences: 4, // opening paragraph of each subsection
  leadChars: 760,
  topicSentences: 3, // summary shown under each heading
  topicChars: 620,
  maxTopics: 18, // per subsection (the rest are summarised as "… y N más")
  maxAlerts: 3, // warning/critical callouts per subsection
  sectionLeadSentences: 4,
  sectionLeadChars: 940,
}

/* ═══════════════════════════════════════════════════════════════════
   TEXT HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Lightweight inline markdown renderer for summaries. */
function inline(text) {
  let s = esc(String(text ?? ''))
  s = s.replace(/```[\s\S]*?```/g, ' ')
  s = s.replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|[\s(])_([^_]+)_(?=[\s.,;:)!?]|$)/g, '$1<em>$2</em>')
  s = s.replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s.,;:)!?]|$)/g, '$1<em>$2</em>')
  s = s.replace(/<br\s*\/?>/gi, ' ')
  s = s.replace(/\s{2,}/g, ' ')
  return s.trim()
}

/** Strips markdown so we can measure and re-cut plain text. */
function plain(text) {
  return String(text ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/[*_#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const ABBREVIATIONS = new Set([
  'p. ej',
  'ej',
  'etc',
  'vs',
  'dr',
  'dra',
  'sr',
  'sra',
  'art',
  'num',
  'n',
  'no',
  'fig',
  'cap',
  'inc',
  'aprox',
])

function splitSentences(text) {
  const src = plain(text)
  if (!src) return []

  const out = []
  let buf = ''
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    buf += ch

    if (ch !== '.' && ch !== '!' && ch !== '?' && ch !== '…') continue
    const next = src[i + 1]
    if (next !== ' ') continue
    const after = src.slice(i + 2, i + 3)
    if (!/^[A-ZÁÉÍÓÚÑÜ¿¡«"(]/.test(after)) continue

    const tail = src.slice(0, i + 1)
    const abbr = tail.match(/([A-Za-zÁÉÍÓÚÑáéíóúñ.]{1,5})\.$/)
    if (abbr && ABBREVIATIONS.has(abbr[1].toLowerCase())) continue
    if (/^\s*\d+[.)]$/.test(buf.trim())) continue

    out.push(buf.trim())
    buf = ''
  }
  if (buf.trim()) out.push(buf.trim())
  return out.filter(Boolean)
}

function cutChars(text, max) {
  const s = String(text ?? '').trim()
  if (s.length <= max) return s
  const slice = s.slice(0, max)
  const breakAt = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf(','), slice.lastIndexOf(';'))
  return (breakAt > max * 0.55 ? slice.slice(0, breakAt) : slice).replace(/[.,;:\s]+$/, '') + '…'
}

const VISUAL_REFERENCE =
  /\b(en|la|el|debajo|arriba)\s+(la\s+|el\s+)?(siguiente|anterior|previa)\s+(imagen|figura|tabla|ilustraci[oó]n|diagrama|gr[aá]fico)|\bcomo\s+(se\s+)?(muestra|vemos|puede\s+verse|puedes\s+ver|se\s+observa)\s+en\s+(la|el)\s+(imagen|figura|tabla|diagrama)|^(en|con)\s+la\s+imagen\b|^la\s+imagen\s+(anterior|siguiente)\b/i

function summarize(text, maxSentences, maxChars) {
  const sentences = splitSentences(text)
  if (!sentences.length) return ''
  const usable = sentences.filter((sentence) => !VISUAL_REFERENCE.test(sentence))
  if (!usable.length) return ''
  return cutChars(usable.slice(0, maxSentences).join(' '), maxChars)
}

/* ═══════════════════════════════════════════════════════════════════
   CONTENT EXTRACTION
   ═══════════════════════════════════════════════════════════════════ */

function hasContent(node) {
  if (!node) return false
  if (node.blocks && node.blocks.length > 0) return true
  if (node.subsections && node.subsections.length > 0) return true
  return false
}

function numberOf(node) {
  const title = String(node?.title ?? '')
  const m = title.match(/^(\d+(?:\.\d+)*)/)
  return m ? m[1].replace(/\.$/, '') : ''
}

/** Builds { lead, topics[], alerts[], extraTopics } for a subsection. */
function extractSubsection(sub) {
  const blocks = sub.blocks || []
  const topics = []
  const alerts = []
  const used = new Set()
  let lead = ''
  let fallbackParagraphs = []
  let current = null

  for (const block of blocks) {
    if (block.type === 'heading') {
      current = { title: plain(block.text), text: '', bullets: [] }
      topics.push(current)
      continue
    }

    if (block.type === 'paragraph') {
      const value = block.text || ''
      if (!plain(value)) continue
      if (!lead) {
        lead = value
        continue
      }
      if (current && !current.text) {
        current.text = value
        continue
      }
      if (fallbackParagraphs.length < 4) fallbackParagraphs.push(value)
      continue
    }

    if (block.type === 'callout') {
      const variant = block.variant || 'note'
      const body = [
        block.text,
        ...(block.items || []).map((i) => (typeof i === 'object' ? i.text : i)),
      ]
        .filter(Boolean)
        .join(' ')
      if (!plain(body)) continue

      if (variant === 'warning' || variant === 'critical') {
        alerts.push({ variant, text: summarize(body, 1, 220) })
      } else if (current && !current.text) {
        current.text = body
      } else if (!current && fallbackParagraphs.length < 4) {
        fallbackParagraphs.push(body)
      }
      continue
    }

    if (block.type === 'list') {
      const items = (block.items || []).map((i) => (typeof i === 'object' ? i.text : i))
      for (const item of items) {
        const sentence = summarize(item, 1, 175)
        if (!sentence || sentence.length < 25 || used.has(sentence)) continue

        if (current && current.bullets.length < 3) {
          current.bullets.push(sentence)
          used.add(sentence)
        } else if (!current && fallbackParagraphs.length < 4) {
          fallbackParagraphs.push(item)
        }
      }
      continue
    }

    if (block.type === 'group') {
      for (const row of block.rows || []) {
        if (!current || current.bullets.length >= 8) break
        const detail = summarize(row.text, 1, 130)
        const label = plain(row.keyLabel)
        const line = detail ? `${label} — ${detail}` : label
        if (line && !used.has(line)) {
          current.bullets.push(line)
          used.add(line)
        }
      }
      continue
    }

    if (block.type === 'steps') {
      if (!current || current.text || current.bullets.length) continue
      for (const step of (block.items || []).slice(0, 5)) {
        const title = summarize(String(step.title ?? '').replace(/^\d+[.)]\s*/, ''), 1, 90)
        if (title) current.bullets.push(title)
      }
      continue
    }

    if (block.type === 'table') {
      if (current && !current.table) {
        current.table = {
          caption: block.caption || '',
          rows: (block.rows || [])
            .slice(0, 4)
            .map((row) => summarize(row[0], 1, 70))
            .filter(Boolean),
        }
      }
      continue
    }
  }

  let extraTopics = 0
  let keptTopics = topics
  if (topics.length > CFG.maxTopics) {
    extraTopics = topics.length - CFG.maxTopics
    keptTopics = topics.slice(0, CFG.maxTopics)
  }

  const renderedTopics = keptTopics
    .map((topic) => {
      let text = summarize(topic.text, CFG.topicSentences, CFG.topicChars)
      let bullets = topic.bullets

      if (!text && !bullets.length && topic.table) {
        text = topic.table.caption
        bullets = topic.table.rows
      }

      return { title: topic.title, text, bullets }
    })
    .filter((topic) => topic.title && (topic.text || topic.bullets.length))

  // Subsections without headings: turn the first paragraphs into bullet points.
  const fallback = renderedTopics.length
    ? []
    : fallbackParagraphs
        .map((p) => summarize(p, 1, 200))
        .filter(Boolean)
        .slice(0, 5)

  return {
    lead: summarize(lead, CFG.leadSentences, CFG.leadChars),
    description: sub.description ? summarize(sub.description, 1, 200) : '',
    topics: renderedTopics,
    fallback,
    alerts: alerts.slice(0, CFG.maxAlerts),
    extraTopics,
  }
}

/** Splits a section `overview` string into prose paragraphs and bullet items. */
function parseOverview(markdown) {
  const lines = String(markdown ?? '').split('\n')
  const paragraphs = []
  const bullets = []
  let buf = []

  const flush = () => {
    if (buf.length) {
      paragraphs.push(buf.join(' '))
      buf = []
    }
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    if (/^#{1,6}\s+/.test(line)) {
      flush()
      continue
    }
    const item = line.match(/^[-*+]\s+(.*)$/)
    if (item) {
      flush()
      bullets.push(item[1])
      continue
    }
    buf.push(line)
  }
  flush()

  return { paragraphs, bullets }
}

/* ═══════════════════════════════════════════════════════════════════
   RENDERERS
   ═══════════════════════════════════════════════════════════════════ */

function renderCover() {
  const logo = fs
    .readFileSync(path.join(ROOT, 'public/lilium-logo.svg'), 'utf8')
    .replace(/<\?xml[^>]*\?>/i, '')
    .replace(/<style>[\s\S]*?<\/style>/i, '')
    .replace(/class="cls-1"/g, 'fill="currentColor"')
    .replace(/<svg([^>]*)>/, '<svg$1 class="logo-mark">')

  const dateLabel = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return `<section class="cover">
  <div class="cover-top">
    <span class="cover-brand">${logo}<span class="wordmark">LILIUM</span></span>
    <span class="cover-tag">PLAYBOOK · EDICIÓN CONDENSADA</span>
  </div>

  <div class="cover-body">
    <div class="cover-eyebrow cover-eyebrow--names"><span class="accent-dot"></span>Integrantes: Josefina Marsala, Santiago Mir</div>
    <h1 class="cover-title">Playbook de<br>ciberseguridad<br>para PYMEs</h1>
    <p class="cover-sub">Lilium es un playbook enfocado en construir una arquitectura digital segura para tu PyME con prácticas interactivas, basado en los conocimientos adquiridos en la Diplomatura en Ciberseguridad.</p>
  </div>

  <div class="cover-foot">
    <a class="cover-link" href="https://lilium-cyber.vercel.app" target="_blank" rel="noopener noreferrer">lilium-cyber.vercel.app</a>
    <span class="cover-rule"></span>
    <span>Edición condensada · ${esc(dateLabel)}</span>
  </div>
</section>`
}

/* ── "Nota para el profesor" page ───────────────────── */

const STATEMENT_PARAGRAPHS = [
  'Lilium es un proyecto que surgió con la idea de acercar la ciberseguridad a pequeñas y medianas empresas - similar al caso ficticio que aplicamos en la diplomatura-, así como a personas como nosotros, que están dando sus primeros pasos en esta área. Lo planteamos como un playbook educativo (o mini-curso de seguridad digital) que reúne conceptos, metodologías, herramientas y procedimientos para comprender, diseñar e implementar buenas prácticas de seguridad informática de manera progresiva.',
  'El proyecto completo lo desarrollamos a través de una **página web**, que funciona como plataforma de aprendizaje. Allí se encuentra la documentación completa (que es más extensa de lo que se presenta en este documento), junto con laboratorios interactivos que permiten poner en práctica los conceptos abordados mediante un sistema operativo simulado y una terminal de Linux emulada.',
  'Esta es la versión en PDF de la documentación. Debido a la extensión del material original (que comprende el desarrollo de un recorrido completo de aprendizaje) y al límite de 2 MB establecido para la entrega, se optó por generar un documento con una versión resumida de los contenidos. Se mantienen los temas y ejes principales desarrollados en la plataforma, aunque con un nivel de detalle menor.',
  'Se puede acceder a la versión completa del proyecto a través del siguiente enlace: **[Lilium — Plataforma de aprendizaje en ciberseguridad](https://lilium-cyber.vercel.app)**',
]

const STATEMENT_SIGNOFF = 'Muchas gracias por leer!'

function renderStatementInline(text) {
  let html = String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a class="note-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  return html
}

function renderStatement() {
  return `<section class="statement" id="nota">
  <header class="statement-head">
    <span class="statement-eyebrow">Nota</span>
    <h1 class="statement-title">Nota para el profesor</h1>
  </header>
  <div class="statement-body">
    ${STATEMENT_PARAGRAPHS.map((text) => `<p>${renderStatementInline(text)}</p>`).join('\n')}
    <p class="statement-signoff">${renderStatementInline(STATEMENT_SIGNOFF)}</p>
  </div>
</section>`
}

function renderTOC(sections) {
  const rows = sections
    .map((section, idx) => {
      const subs = (section.subsections || []).filter(hasContent)
      const subRows = subs
        .map((sub) => {
          const nested = (sub.subsections || []).filter(hasContent)
          return `<div class="toc-sub">
  <a class="toc-sub-link" href="#ss-${section.id}-${sub.id}">${esc(sub.displayTitle || sub.title)}</a>
  ${nested
    .map(
      (ss) =>
        `<a class="toc-subsub-link" href="#sss-${section.id}-${sub.id}-${ss.id}">${esc(
          ss.displayTitle || ss.title
        )}</a>`
    )
    .join('')}
</div>`
        })
        .join('')

      return `<div class="toc-section">
  <a class="toc-sec-link" href="#s-${section.id}">
    <span class="toc-num">${String(idx).padStart(2, '0')}</span>
    <span class="toc-sec-title">${esc(section.title)}</span>
  </a>
  ${subRows}
</div>`
    })
    .join('\n')

  return `<section class="toc" id="toc">
  <div class="toc-head">
    <span class="toc-eyebrow">Contenido</span>
    <h2 class="toc-title">Índice general</h2>
  </div>
  <div class="toc-grid">${rows}</div>
  <p class="toc-note">Cada título es un enlace navegable. Esta edición resume cada apartado en una idea de apertura y los temas que lo componen; los procedimientos, comandos y tablas completas viven en la versión web.</p>
</section>`
}

function renderColophon(stats) {
  const dateLabel = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return `<section class="colophon" id="colofon">
  <div class="colo-head">
    <span class="toc-eyebrow">Cierre</span>
    <h2 class="colo-title">Sobre esta edición</h2>
  </div>
  <p>Esta edición condensada conserva la estructura completa del playbook: ${stats.modules} módulos, ${stats.subsections} secciones y los apartados que las componen. Cada página resume una sección en una idea de apertura, sus temas principales y, cuando corresponde, las claves y advertencias críticas.</p>
  <p>Los procedimientos paso a paso, comandos, tablas de referencia, diagramas y laboratorios interactivos se mantienen íntegros en la versión web de LILIUM. Esta edición está pensada para lectura ejecutiva, planificación y estudio rápido.</p>
  <div class="colo-meta">
    <div><span class="colo-k">Documento</span><span class="colo-v">LILIUM · Playbook de ciberseguridad — Edición condensada</span></div>
    <div><span class="colo-k">Fecha</span><span class="colo-v">${esc(dateLabel)}</span></div>
    <div><span class="colo-k">Documentación completa</span><span class="colo-v">lilium.playbook</span></div>
  </div>
</section>`
}

function renderSectionPage(section, idx) {
  const subs = (section.subsections || []).filter(hasContent)
  if (!subs.length && !hasContent(section)) return ''

  const overview = section.overview
    ? parseOverview(section.overview)
    : { paragraphs: [], bullets: [] }

  const leadText = summarize(
    overview.paragraphs.join(' '),
    CFG.sectionLeadSentences,
    CFG.sectionLeadChars
  )
  const lead = leadText ? `<p class="sec-lead">${inline(leadText)}</p>` : ''

  const learn = overview.bullets
    .slice(0, 6)
    .map((item) => summarize(item, 1, 150))
    .filter(Boolean)

  const learnBlock = learn.length
    ? `<div class="sec-points">
    <span class="sec-points-label">Aspectos clave</span>
    <ul>${learn.map((item) => `<li><span class="dot"></span><span>${inline(item)}</span></li>`).join('')}</ul>
  </div>`
    : ''

  const map = subs.length
    ? `<div class="map">
    <h2 class="map-title">Contenido del módulo</h2>
    ${subs
      .map((sub, i) => {
        const nested = (sub.subsections || []).filter(hasContent)
        return `<a class="map-row" href="#ss-${section.id}-${sub.id}">
      <span class="map-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="map-text">
        <span class="map-name">${esc(sub.displayTitle || sub.title)}</span>
        ${sub.description ? `<span class="map-desc">${inline(summarize(sub.description, 1, 200))}</span>` : ''}
      </span>
      ${nested.length ? `<span class="map-count">+${nested.length}</span>` : ''}
    </a>`
      })
      .join('\n')}
  </div>`
    : ''

  return `<section class="sec-page" id="s-${section.id}">
  <header class="sec-head">
    <span class="sec-eyebrow">Módulo ${String(idx).padStart(2, '0')}</span>
    <h1 class="sec-title">${esc(section.title)}</h1>
    ${lead}
  </header>
  ${learnBlock}
  ${map}
</section>`
}

function renderSubsection(section, sub, parent, anchorOverride) {
  if (!hasContent(sub)) return ''

  const anchor =
    anchorOverride ||
    (parent ? `sss-${section.id}-${parent.id}-${sub.id}` : `ss-${section.id}-${sub.id}`)
  const crumbs = parent
    ? `${esc(section.title)} <span class="crumb-sep">/</span> ${esc(parent.displayTitle || parent.title)}`
    : esc(section.title)

  const data = extractSubsection(sub)

  const lead = data.lead ? `<p class="lead">${inline(data.lead)}</p>` : ''
  const desc =
    data.description && !data.lead ? `<p class="lead">${inline(data.description)}</p>` : ''

  const topics = data.topics.length
    ? `<div class="topics">${data.topics
        .map(
          (topic) => `<div class="topic">
      <h3 class="topic-title">${inline(topic.title)}</h3>
      ${topic.text ? `<p class="topic-text">${inline(topic.text)}</p>` : ''}
      ${
        topic.bullets.length
          ? `<ul class="topic-points">${topic.bullets
              .map((item) => `<li><span class="dot"></span><span>${inline(item)}</span></li>`)
              .join('')}</ul>`
          : ''
      }
    </div>`
        )
        .join(
          '\n'
        )}${data.extraTopics ? `<p class="topic-more">… y ${data.extraTopics} apartados más en la versión completa.</p>` : ''}</div>`
    : ''

  const fallback = data.fallback.length
    ? `<ul class="points">${data.fallback
        .map((item) => `<li><span class="dot"></span><span>${inline(item)}</span></li>`)
        .join('')}</ul>`
    : ''

  const alerts = data.alerts.length
    ? `<div class="alerts">${data.alerts
        .map(
          (alert) => `<div class="alert ${alert.variant}">
      <span class="alert-label">${alert.variant === 'critical' ? 'Crítico' : 'Atención'}</span>
      <p>${inline(alert.text)}</p>
    </div>`
        )
        .join('')}</div>`
    : ''

  return `<section class="chapter" id="${anchor}">
  <header class="doc-head">
    <div class="crumbs">${crumbs}</div>
    <h1 class="doc-title">${esc(sub.displayTitle || sub.title)}</h1>
  </header>
  <div class="body">
    ${desc}
    ${lead}
    ${topics}
    ${fallback}
    ${alerts}
  </div>
</section>`
}

/* ═══════════════════════════════════════════════════════════════════
   PRINT STYLESHEET
   ═══════════════════════════════════════════════════════════════════ */

const CSS = String.raw`
:root{
  --accent:#ff3366;
  --ink:#111111;
  --text:#555555;
  --muted:#999999;
  --line:rgba(0,0,0,.08);
  --line-soft:rgba(0,0,0,.05);
  --surface:#fafafa;
  --mono:'SF Mono',ui-monospace,'Cascadia Code',Menlo,Consolas,monospace;
}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
@page{size:A4;margin:14mm 15.75mm 16mm 15.75mm;}
html{font-size:9.6pt;}
body{
  margin:0;
  font-family:Helvetica,'Helvetica Neue',Arial,sans-serif;
  color:var(--text);line-height:1.62;letter-spacing:-.004em;background:#fff;
  overflow-wrap:break-word;
}
a{color:inherit;text-decoration:none;}
p{margin:0;}
h1,h2,h3,h4{color:var(--ink);margin:0;font-weight:750;letter-spacing:-.02em;}
svg{display:block;max-width:100%;}
.ic{font-family:var(--mono);font-size:.86em;background:rgba(0,0,0,.05);color:var(--ink);padding:.06em .32em;border-radius:3px;border:1px solid rgba(0,0,0,.07);}

/* ── Cover ─────────────────────────────────────────── */
.cover{height:247mm;display:flex;flex-direction:column;break-after:page;}
.cover-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:14mm;border-bottom:1px solid rgba(0,0,0,.09);}
.cover-brand{display:flex;align-items:center;gap:8pt;color:var(--ink);}
.logo-mark{width:19pt;height:19pt;}
.wordmark{font-size:11pt;font-weight:800;letter-spacing:.24em;}
.cover-tag{font-family:var(--mono);font-size:7.2pt;letter-spacing:.14em;color:var(--muted);}
.cover-body{margin-top:44mm;}
.cover-eyebrow{display:flex;align-items:center;gap:6pt;font-size:8.4pt;font-weight:650;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);}
.cover-eyebrow--names{text-transform:none;letter-spacing:.01em;font-size:9.2pt;font-weight:600;color:#6b6b6b;}
.accent-dot{width:5.5pt;height:5.5pt;border-radius:50%;background:var(--accent);flex:none;}
.cover-title{font-size:35pt;font-weight:800;letter-spacing:-.035em;line-height:1.06;margin:12pt 0 0;color:#0d0d0d;}
.cover-sub{margin-top:14pt;max-width:132mm;font-size:10.6pt;line-height:1.62;color:var(--text);}
.cover-foot{display:flex;align-items:center;gap:8pt;font-size:8pt;color:var(--muted);margin-top:auto;}
.cover-link{font-weight:650;color:var(--accent);border-bottom:.5px solid rgba(255,51,102,.4);letter-spacing:.01em;}
.cover-rule{flex:1;height:1px;background:rgba(0,0,0,.09);}

/* ── Statement page ────────────────────────────────── */
.statement{break-before:page;break-after:page;padding-top:8mm;}
.statement-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:10pt;margin-bottom:16pt;}
.statement-eyebrow{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);}
.statement-title{font-size:26pt;font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-top:6pt;color:#0d0d0d;}
.statement-body p{font-size:10.6pt;line-height:1.7;color:var(--text);margin-bottom:11pt;max-width:166mm;}
.statement-body strong{font-weight:650;color:var(--ink);}
.statement-body .note-link{color:#b3254b;font-weight:600;border-bottom:.5px solid rgba(179,37,75,.4);}
.statement-signoff{font-size:11pt;font-weight:700;color:var(--ink);margin-top:16pt;}

/* ── TOC ───────────────────────────────────────────── */
.toc{break-after:page;}
.toc-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:9pt;margin-bottom:12pt;}
.toc-eyebrow{font-size:8pt;font-weight:650;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);}
.toc-title{font-size:22pt;font-weight:800;letter-spacing:-.03em;margin-top:4pt;}
.toc-grid{columns:2;column-gap:10mm;}
.toc-section{margin-bottom:9pt;break-inside:avoid;padding-bottom:2pt;}
.toc-sec-link{display:flex;align-items:baseline;gap:6pt;padding-bottom:3pt;border-bottom:1px solid rgba(0,0,0,.07);}
.toc-num{font-family:var(--mono);font-size:7.6pt;font-weight:700;color:var(--accent);}
.toc-sec-title{font-size:9.8pt;font-weight:750;color:var(--ink);letter-spacing:-.012em;}
.toc-sub{padding-left:14pt;}
.toc-sub-link{display:block;font-size:8.2pt;color:var(--text);padding:1.6pt 0;line-height:1.36;}
.toc-subsub-link{display:block;font-size:7.6pt;color:var(--muted);padding:1.2pt 0 1.2pt 9pt;line-height:1.3;}
.toc-note{column-span:all;margin-top:14pt;font-size:7.8pt;color:var(--muted);font-style:italic;line-height:1.5;}

/* ── Section divider + module map ──────────────────── */
.sec-page{break-before:page;}
.sec-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:10pt;margin-bottom:14pt;}
.sec-eyebrow{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);}
.sec-title{font-size:25pt;font-weight:800;letter-spacing:-.03em;line-height:1.1;margin-top:6pt;}
.sec-lead{margin-top:9pt;font-size:9.6pt;line-height:1.6;color:var(--text);max-width:160mm;}
.map-title{font-size:7.6pt;font-weight:650;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:7pt;}
.map-row{display:flex;align-items:flex-start;gap:8pt;padding:6pt 8pt;margin-bottom:4pt;border:1px solid var(--line);border-radius:6px;break-inside:avoid;}
.map-num{font-family:var(--mono);font-size:7.6pt;font-weight:700;color:var(--accent);min-width:14pt;padding-top:1pt;}
.map-text{flex:1;min-width:0;}
.map-name{display:block;font-size:9pt;font-weight:650;color:var(--ink);line-height:1.3;}
.map-desc{display:block;font-size:8pt;color:var(--muted);line-height:1.42;margin-top:1.5pt;}
.map-count{font-family:var(--mono);font-size:7pt;color:var(--muted);}

/* ── Chapter (subsection) ──────────────────────────── */
.chapter{break-before:page;}
.doc-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:8pt;margin-bottom:12pt;}
.crumbs{font-size:7.2pt;font-weight:650;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:4pt;}
.crumbs::before{content:'';display:inline-block;width:4pt;height:4pt;border-radius:50%;background:var(--accent);margin-right:5pt;vertical-align:1pt;}
.crumb-sep{color:#cfcfcf;padding:0 2pt;}
.doc-title{font-size:18pt;font-weight:800;letter-spacing:-.026em;line-height:1.16;color:#0d0d0d;}
.lead{font-size:10.4pt;line-height:1.62;color:#3f3f3f;margin-bottom:11pt;}
.lead strong{font-weight:650;color:var(--ink);}

/* ── Topic rows ────────────────────────────────────── */
.topics{display:block;margin-top:2pt;}
.topic{padding:5.5pt 0 5.5pt 9pt;border-left:1.5px solid rgba(0,0,0,.09);margin-bottom:3pt;break-inside:avoid;}
.topic-title{font-size:10pt;font-weight:700;line-height:1.36;color:var(--ink);margin-bottom:2pt;}
.topic-title::before{content:'';display:inline-block;width:3.4pt;height:3.4pt;border-radius:50%;background:var(--accent);margin-right:6pt;vertical-align:2pt;}
.topic-text{font-size:9.5pt;line-height:1.56;color:var(--text);}
.topic-text strong{font-weight:650;color:var(--ink);}
.topic-more{font-size:8.2pt;font-style:italic;color:var(--muted);margin-top:4pt;padding-left:9pt;}

/* ── Fallback bullet points ────────────────────────── */
.points{list-style:none;margin:6pt 0 0;padding:0;}
.points li{display:flex;align-items:flex-start;gap:6pt;font-size:9.5pt;line-height:1.56;padding:2pt 0;break-inside:avoid;}
.points .dot{flex:none;width:3.6pt;height:3.6pt;border-radius:50%;background:var(--ink);opacity:.45;margin-top:5.6pt;}
.points strong{font-weight:650;color:var(--ink);}

/* ── Topic bullets ─────────────────────────────────── */
.topic-points{list-style:none;margin:3.5pt 0 0;padding:0;}
.topic-points li{display:flex;align-items:flex-start;gap:5.5pt;font-size:8.9pt;line-height:1.5;padding:1.4pt 0;color:var(--text);}
.topic-points .dot{flex:none;width:3pt;height:3pt;border-radius:50%;background:var(--muted);margin-top:5pt;}
.topic-points strong{font-weight:650;color:var(--ink);}

/* ── Section key aspects ───────────────────────────── */
.sec-points{margin:0 0 14pt;padding:8pt 10pt;border:1px solid var(--line);border-radius:6px;background:#fcfcfc;break-inside:avoid;}
.sec-points-label{display:block;font-size:6.9pt;font-weight:750;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4pt;}
.sec-points ul{list-style:none;margin:0;padding:0;columns:2;column-gap:10mm;}
.sec-points li{display:flex;align-items:flex-start;gap:5.5pt;font-size:8.8pt;line-height:1.48;padding:1.6pt 0;color:var(--text);break-inside:avoid;}
.sec-points .dot{flex:none;width:3.2pt;height:3.2pt;border-radius:50%;background:var(--accent);opacity:.7;margin-top:5pt;}
.sec-points strong{font-weight:650;color:var(--ink);}

/* ── Alerts ────────────────────────────────────────── */
.alerts{margin-top:10pt;}
.alert{display:flex;align-items:flex-start;gap:7pt;padding:6pt 8pt;border:1px solid rgba(0,0,0,.075);border-left:2px solid #b03030;border-radius:5px;background:var(--surface);margin-top:5pt;break-inside:avoid;}
.alert.warning{border-left-color:#b07a10;}
.alert-label{flex:none;font-size:6.8pt;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:#b03030;padding-top:1.5pt;}
.alert.warning .alert-label{color:#b07a10;}
.alert p{font-size:8.6pt;line-height:1.5;color:var(--text);}
.alert p strong{font-weight:650;color:var(--ink);}

/* ── Colophon ──────────────────────────────────────── */
.colophon{break-before:page;padding-top:34mm;}
.colo-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:9pt;margin-bottom:14pt;}
.colo-title{font-size:23pt;font-weight:800;letter-spacing:-.03em;margin-top:4pt;}
.colophon p{font-size:10.2pt;line-height:1.66;color:var(--text);margin-bottom:10pt;max-width:158mm;}
.colo-meta{margin-top:20pt;border-top:1px solid rgba(0,0,0,.08);padding-top:10pt;}
.colo-meta > div{display:flex;gap:12pt;padding:3.5pt 0;border-bottom:1px solid var(--line-soft);}
.colo-meta > div:last-child{border-bottom:none;}
.colo-k{width:46mm;flex:none;font-size:7.4pt;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding-top:1.5pt;}
.colo-v{font-size:9.2pt;color:var(--ink);}
`

/* ═══════════════════════════════════════════════════════════════════
   DOCUMENT ASSEMBLY
   ═══════════════════════════════════════════════════════════════════ */

function buildHtml() {
  const all = JSON.parse(fs.readFileSync(DOCS_JSON, 'utf8'))
  const sections = all.filter((s) => INCLUDE_SHOWCASE || s.id !== 'showcase')

  const chapters = []
  let topicTotal = 0

  sections.forEach((section, idx) => {
    const sectionPage =
      section.overview || (section.subsections || []).filter(hasContent).length > 1
        ? renderSectionPage(section, idx)
        : ''
    if (sectionPage) chapters.push(sectionPage)

    let needsSectionAnchor = !sectionPage

    for (const sub of section.subsections || []) {
      const data = extractSubsection(sub)
      topicTotal += data.topics.length || data.fallback.length

      let subPage = renderSubsection(section, sub, undefined)
      if (needsSectionAnchor && subPage) {
        subPage = subPage.replace(
          /<section class="chapter" id="([^"]+)">/,
          `<section class="chapter" id="$1"><span class="anchor" id="s-${section.id}"></span>`
        )
        needsSectionAnchor = false
      }
      if (subPage) chapters.push(subPage)

      for (const ss of sub.subsections || []) {
        const nested = renderSubsection(section, ss, sub)
        if (nested) chapters.push(nested)
      }
    }
  })

  const subTotal = sections.reduce((acc, s) => {
    const walk = (node) => (node.subsections || []).reduce((n, sub) => n + 1 + walk(sub), 0)
    return acc + walk(s)
  }, 0)
  const moduleCount = sections.filter((s) => s.id !== 'showcase').length
  const stats = { modules: moduleCount, subsections: subTotal, topics: topicTotal }

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>LILIUM — Documentación condensada</title>
<meta name="author" content="LILIUM">
<meta name="description" content="Edición condensada del playbook de ciberseguridad por capas para PyMEs.">
<style>${CSS}</style>
</head>
<body>
${renderCover()}
${renderStatement()}
${renderTOC(sections)}
${chapters.join('\n')}
${renderColophon(stats)}
</body>
</html>`

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(HTML_OUT, html, 'utf8')
  console.log(
    `   📝 HTML condensado: ${path.relative(ROOT, HTML_OUT)} (${stats.modules} módulos · ${stats.subsections} secciones · ${stats.topics} temas)`
  )
  return { stats }
}

/* ═══════════════════════════════════════════════════════════════════
   CHROME / CDP  →  A4 PDF
   ═══════════════════════════════════════════════════════════════════ */

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean)

  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) return c
    } catch {
      /* ignore */
    }
  }
  throw new Error('No se encontró Chrome/Chromium. Define CHROME_PATH.')
}

class CDP {
  constructor(url) {
    this.url = url
    this.id = 0
    this.pending = new Map()
    this.listeners = new Map()
  }

  async connect() {
    this.ws = new WebSocket(this.url)
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true })
      this.ws.addEventListener(
        'error',
        () => reject(new Error('No se pudo abrir el WebSocket CDP')),
        {
          once: true,
        }
      )
    })
    this.ws.addEventListener('message', (event) => {
      let msg
      try {
        msg = JSON.parse(event.data)
      } catch {
        return
      }
      if (msg.id !== undefined) {
        const entry = this.pending.get(msg.id)
        if (!entry) return
        this.pending.delete(msg.id)
        if (msg.error) entry.reject(new Error(`${entry.method}: ${msg.error.message}`))
        else entry.resolve(msg.result)
        return
      }
      if (msg.method) {
        const key = `${msg.sessionId ?? ''}|${msg.method}`
        ;(this.listeners.get(key) || []).forEach((fn) => fn(msg.params))
      }
    })
  }

  send(method, params = {}, sessionId) {
    const id = ++this.id
    const payload = { id, method, params }
    if (sessionId) payload.sessionId = sessionId
    this.ws.send(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method })
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`CDP timeout: ${method}`))
        }
      }, 180000)
    })
  }

  once(method, sessionId, timeoutMs = 180000) {
    return new Promise((resolve, reject) => {
      const key = `${sessionId ?? ''}|${method}`
      const handler = (params) => {
        clearTimeout(timer)
        this.listeners.set(
          key,
          (this.listeners.get(key) || []).filter((fn) => fn !== handler)
        )
        resolve(params)
      }
      const timer = setTimeout(() => {
        this.listeners.set(
          key,
          (this.listeners.get(key) || []).filter((fn) => fn !== handler)
        )
        reject(new Error(`Timeout esperando ${method}`))
      }, timeoutMs)
      this.listeners.set(key, [...(this.listeners.get(key) || []), handler])
    })
  }

  close() {
    try {
      this.ws.close()
    } catch {
      /* ignore */
    }
  }
}

function launchChrome() {
  const chrome = findChrome()
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lilium-pdfc-'))
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank',
  ]

  const proc = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] })

  return new Promise((resolve, reject) => {
    let buffer = ''
    const timer = setTimeout(
      () => reject(new Error('Chrome no expuso el puerto CDP a tiempo')),
      30000
    )

    const onData = (chunk) => {
      buffer += chunk.toString()
      const m = buffer.match(/DevTools listening on (ws:\/\/[^\s]+)/)
      if (m) {
        clearTimeout(timer)
        proc.stderr.off('data', onData)
        resolve({ proc, browserWs: m[1], profile })
      }
    }
    proc.stderr.on('data', onData)
    proc.on('exit', (code) => {
      clearTimeout(timer)
      reject(new Error(`Chrome terminó antes de iniciar (código ${code})`))
    })
  })
}

async function printPdf() {
  const { proc, browserWs, profile } = await launchChrome()
  const cdp = new CDP(browserWs)
  let targetId

  try {
    await cdp.connect()

    const { targetId: id } = await cdp.send('Target.createTarget', { url: 'about:blank' })
    targetId = id
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })

    await cdp.send('Page.enable', {}, sessionId)
    await cdp.send('Emulation.setEmulatedMedia', { media: 'print' }, sessionId)

    const loaded = cdp.once('Page.loadEventFired', sessionId)
    await cdp.send('Page.navigate', { url: 'file://' + HTML_OUT }, sessionId)
    await loaded

    await cdp.send(
      'Runtime.evaluate',
      {
        expression: `(async () => {
          if (document.fonts && document.fonts.ready) { try { await document.fonts.ready } catch (e) {} }
          return document.body.scrollHeight
        })()`,
        awaitPromise: true,
      },
      sessionId
    )

    const footer = `<div style="width:100%;padding:0 14mm;font-family:Helvetica,'Helvetica Neue',Arial,sans-serif;font-size:7.5px;color:#9a9a9a;display:flex;align-items:center;justify-content:space-between;">
  <span style="letter-spacing:.08em;">LILIUM · PLAYBOOK DE CIBERSEGURIDAD · EDICIÓN CONDENSADA</span>
  <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`

    const baseParams = {
      printBackground: true,
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.55,
      marginBottom: 0.62,
      marginLeft: 0.62,
      marginRight: 0.62,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: footer,
      preferCSSPageSize: true,
      transferMode: 'ReturnAsBase64',
    }

    let result
    try {
      result = await cdp.send(
        'Page.printToPDF',
        { ...baseParams, generateDocumentOutline: true, generateTaggedPDF: true },
        sessionId
      )
    } catch {
      result = await cdp.send('Page.printToPDF', baseParams, sessionId)
    }

    const buf = Buffer.from(result.data, 'base64')
    fs.writeFileSync(PDF_OUT, buf)
    return { bytes: buf.length }
  } finally {
    // Best-effort shutdown: never let a stuck CDP call keep Node alive.
    const settle = (promise, ms = 1500) =>
      Promise.race([
        promise.catch(() => {}),
        new Promise((resolve) => {
          const timer = setTimeout(resolve, ms)
          timer.unref?.()
        }),
      ])

    if (targetId) await settle(cdp.send('Target.closeTarget', { targetId }))
    await settle(cdp.send('Browser.close'))
    cdp.close()
    proc.kill('SIGKILL')
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
    } catch {
      /* temp profile cleanup is best-effort */
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════ */

async function main() {
  console.log('📚 Compilando la edición condensada a PDF A4…')
  await buildHtml()
  console.log('   🖨️  Renderizando con Chrome headless…')
  const { bytes } = await printPdf()

  if (!KEEP_HTML) fs.rmSync(HTML_OUT, { force: true })

  console.log(
    `\n✅ PDF condensado: ${path.relative(ROOT, PDF_OUT)} (${(bytes / 1024 / 1024).toFixed(1)} MB)`
  )
  process.exit(0)
}

main().catch((err) => {
  console.error('\n❌ Error generando el PDF condensado:', err)
  process.exit(1)
})
