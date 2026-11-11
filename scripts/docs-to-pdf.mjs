#!/usr/bin/env node
/**
 * scripts/docs-to-pdf.mjs
 *
 * Compiles the documentation (src/data/docs.json) into a single A4 PDF that
 * mirrors the in-app docs reading design:
 *   DocsContent · DocsTable · DocsCallout · CodeBlock · DocsSteps · DocsList
 *
 * Usage:
 *   npm run docs:pdf
 *   node scripts/docs-to-pdf.mjs                 # all sections
 *   node scripts/docs-to-pdf.mjs --no-showcase   # skip the component showcase
 *   node scripts/docs-to-pdf.mjs --keep-html     # keep the intermediate HTML
 *
 * Pipeline:
 *   1. docs.json  ->  self-contained print HTML (dist-pdf/*.html)
 *   2. headless Chrome (CDP Page.printToPDF) -> A4 PDF with headers/footers,
 *      page numbers and a navigable document outline.
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
const ASSET_DIR = path.join(OUT_DIR, 'assets')
const HTML_OUT = path.join(OUT_DIR, 'lilium-documentacion.html')
const PDF_OUT = path.join(OUT_DIR, 'LILIUM-Documentacion.pdf')

const argv = new Set(process.argv.slice(2))
const INCLUDE_SHOWCASE = !argv.has('--no-showcase')
const KEEP_HTML = argv.has('--keep-html')

/* ═══════════════════════════════════════════════════════════════════
   TEXT / INLINE MARKDOWN  (port of src/utils/renderInline.tsx)
   ═══════════════════════════════════════════════════════════════════ */

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function normalizeUrl(url) {
  const trimmed = String(url ?? '').trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed
  }
  return `https://${trimmed}`
}

/** Map in-app routes to the anchors used in this document. */
function resolveHref(url) {
  const clean = String(url ?? '')
    .split('#')[0]
    .replace(/\/+$/, '')
  const m = clean.match(/^\/docs(?:\/([^/]+))?(?:\/([^/]+))?(?:\/([^/]+))?$/)
  if (!m) return normalizeUrl(url)
  const [, section, sub, subsub] = m
  if (!section) return '#toc'
  if (subsub) return `#sss-${section}-${sub}-${subsub}`
  if (sub) return `#ss-${section}-${sub}`
  return `#s-${section}`
}

function parseMarkdownLinkTarget(raw) {
  const trimmed = raw.trim()
  const titleMatch = trimmed.match(/\s+['"]([^'"]*)['"]$/)
  if (titleMatch) {
    return {
      url: trimmed.slice(0, titleMatch.index).trim(),
      title: titleMatch[1].trim(),
    }
  }
  return { url: trimmed }
}

function findLinkEnd(text, startIdx) {
  let bracketDepth = 1
  let j = startIdx + 1
  while (j < text.length && bracketDepth > 0) {
    if (text[j] === '`') {
      const nextTick = text.indexOf('`', j + 1)
      j = nextTick !== -1 ? nextTick + 1 : j + 1
      continue
    }
    if (text[j] === '\\' && j + 1 < text.length) {
      j += 2
      continue
    }
    if (text[j] === '[') bracketDepth++
    else if (text[j] === ']') bracketDepth--
    if (bracketDepth === 0) break
    j++
  }
  if (bracketDepth === 0 && j + 1 < text.length && text[j + 1] === '(') {
    let parenDepth = 1
    let k = j + 2
    let inQuote = null
    while (k < text.length && parenDepth > 0) {
      const ch = text[k]
      if (inQuote) {
        if (ch === inQuote && text[k - 1] !== '\\') inQuote = null
      } else if (ch === '"' || ch === "'") {
        inQuote = ch
      } else if (ch === '(') {
        parenDepth++
      } else if (ch === ')') {
        parenDepth--
        if (parenDepth === 0) return k + 1
      }
      k++
    }
  }
  return -1
}

function tokenizeInline(text) {
  const tokens = []
  let i = 0
  let textBuf = ''

  const flushText = () => {
    if (textBuf) {
      tokens.push({ type: 'text', text: textBuf })
      textBuf = ''
    }
  }

  const findClosing = (from, marker) => {
    let j = from
    while (j < text.length) {
      if (text[j] === '`') {
        const nextTick = text.indexOf('`', j + 1)
        j = nextTick !== -1 ? nextTick + 1 : j + 1
        continue
      }
      if (text.startsWith(marker, j)) {
        if (marker === '**') return j
        if (marker === '***') return j
        return j
      }
      j++
    }
    return -1
  }

  while (i < text.length) {
    if (text[i] === '\\' && i + 1 < text.length && /[*_`[\]\\]/.test(text[i + 1])) {
      textBuf += text[i + 1]
      i += 2
      continue
    }

    const brMatch = text.slice(i).match(/^<br\s*\/?>/i)
    if (brMatch) {
      flushText()
      tokens.push({ type: 'br' })
      i += brMatch[0].length
      continue
    }

    if (text[i] === '`') {
      const closeIdx = text.indexOf('`', i + 1)
      if (closeIdx !== -1) {
        flushText()
        tokens.push({ type: 'code', code: text.slice(i + 1, closeIdx) })
        i = closeIdx + 1
        continue
      }
    }

    if (text[i] === '[') {
      const linkEnd = findLinkEnd(text, i)
      if (linkEnd !== -1) {
        const fullLink = text.slice(i, linkEnd)
        const splitIdx = fullLink.indexOf('](')
        const label = fullLink.slice(1, splitIdx)
        const rawTarget = fullLink.slice(splitIdx + 2, -1)
        const { url, title } = parseMarkdownLinkTarget(rawTarget)
        flushText()
        tokens.push({ type: 'link', label, url, title })
        i = linkEnd
        continue
      }
    }

    if (text.startsWith('***', i)) {
      const closeIdx = findClosing(i + 3, '***')
      if (closeIdx !== -1) {
        flushText()
        tokens.push({ type: 'bold_italic', inner: text.slice(i + 3, closeIdx) })
        i = closeIdx + 3
        continue
      }
    }

    if (text.startsWith('**', i)) {
      const closeIdx = findClosing(i + 2, '**')
      if (closeIdx !== -1) {
        flushText()
        tokens.push({ type: 'bold', inner: text.slice(i + 2, closeIdx) })
        i = closeIdx + 2
        continue
      }
    }

    if (text.startsWith('__', i)) {
      const prevChar = i > 0 ? text[i - 1] : ''
      const nextChar = i + 2 < text.length ? text[i + 2] : ''
      if ((i === 0 || !/[a-zA-Z0-9]/.test(prevChar)) && !/\s/.test(nextChar)) {
        let closeIdx = -1
        let j = i + 2
        while (j < text.length) {
          if (text[j] === '`') {
            const nextTick = text.indexOf('`', j + 1)
            j = nextTick !== -1 ? nextTick + 1 : j + 1
            continue
          }
          if (text.startsWith('__', j)) {
            const cPrev = text[j - 1]
            const cNext = j + 2 < text.length ? text[j + 2] : ''
            if (!/\s/.test(cPrev) && (j + 2 === text.length || !/[a-zA-Z0-9]/.test(cNext))) {
              closeIdx = j
              break
            }
          }
          j++
        }
        if (closeIdx !== -1) {
          flushText()
          tokens.push({ type: 'bold', inner: text.slice(i + 2, closeIdx) })
          i = closeIdx + 2
          continue
        }
      }
    }

    if (text[i] === '*' && text[i + 1] !== '*') {
      const nextChar = i + 1 < text.length ? text[i + 1] : ''
      if (!/\s/.test(nextChar)) {
        let closeIdx = -1
        let j = i + 1
        while (j < text.length) {
          if (text[j] === '`') {
            const nextTick = text.indexOf('`', j + 1)
            j = nextTick !== -1 ? nextTick + 1 : j + 1
            continue
          }
          if (text[j] === '*' && text[j - 1] !== '*' && text[j + 1] !== '*') {
            if (!/\s/.test(text[j - 1])) {
              closeIdx = j
              break
            }
          }
          j++
        }
        if (closeIdx !== -1) {
          flushText()
          tokens.push({ type: 'italic', inner: text.slice(i + 1, closeIdx) })
          i = closeIdx + 1
          continue
        }
      }
    }

    if (text[i] === '_' && text[i + 1] !== '_') {
      const prevChar = i > 0 ? text[i - 1] : ''
      const nextChar = i + 1 < text.length ? text[i + 1] : ''
      const canOpen = (i === 0 || !/[a-zA-Z0-9]/.test(prevChar)) && !/\s/.test(nextChar)
      if (canOpen) {
        let closeIdx = -1
        let j = i + 1
        while (j < text.length) {
          if (text[j] === '`') {
            const nextTick = text.indexOf('`', j + 1)
            j = nextTick !== -1 ? nextTick + 1 : j + 1
            continue
          }
          if (text[j] === '[') {
            const lEnd = findLinkEnd(text, j)
            if (lEnd !== -1) {
              j = lEnd
              continue
            }
          }
          if (text[j] === '_') {
            const cPrev = text[j - 1]
            const cNext = j + 1 < text.length ? text[j + 1] : ''
            if (!/\s/.test(cPrev) && (j + 1 === text.length || !/[a-zA-Z0-9]/.test(cNext))) {
              closeIdx = j
              break
            }
          }
          j++
        }
        if (closeIdx !== -1) {
          flushText()
          tokens.push({ type: 'italic', inner: text.slice(i + 1, closeIdx) })
          i = closeIdx + 1
          continue
        }
      }
    }

    textBuf += text[i]
    i++
  }

  flushText()
  return tokens
}

function inline(text) {
  if (!text) return ''
  const src = String(text)

  const fast =
    !src.includes('`') &&
    !src.includes('**') &&
    !src.includes('_') &&
    !src.includes('*') &&
    !src.includes('[') &&
    !src.includes('\\') &&
    !src.toLowerCase().includes('<br')
  if (fast) return esc(src)

  return tokenizeInline(src)
    .map((token) => {
      switch (token.type) {
        case 'text':
          return esc(token.text)
        case 'br':
          return '<br>'
        case 'code':
          return `<code class="ic">${esc(token.code)}</code>`
        case 'bold_italic':
          return `<strong><em>${inline(token.inner)}</em></strong>`
        case 'bold':
          return `<strong>${inline(token.inner)}</strong>`
        case 'italic':
          return `<em>${inline(token.inner)}</em>`
        case 'link': {
          const href = resolveHref(token.url)
          const label = inline(token.label)
          const isExternal =
            /^https?:\/\//i.test(href) || href.startsWith('//') || href.startsWith('mailto:')
          const isRef = Boolean(token.title) || /referencia/i.test(token.label)

          if (isRef) {
            return `<a class="ref" href="${esc(href)}"${
              isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
            }>${label}${token.title ? `<span class="ref-badge">${esc(token.title)}</span>` : ''}</a>`
          }

          return `<a class="lnk${isExternal ? ' lnk-ext' : ''}" href="${esc(href)}"${
            isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
          }>${label}${isExternal ? '<span class="ext">↗</span>' : ''}</a>`
        }
        default:
          return ''
      }
    })
    .join('')
}

/* ═══════════════════════════════════════════════════════════════════
   CODE HIGHLIGHTING  (port of src/components/CodeBlock.tsx)
   ═══════════════════════════════════════════════════════════════════ */

const JS_KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'const',
  'let',
  'var',
  'function',
  'return',
  'default',
  'class',
  'interface',
  'type',
  'extends',
  'implements',
  'as',
  'new',
  'if',
  'else',
  'while',
  'for',
  'in',
  'of',
  'await',
  'async',
  'try',
  'catch',
  'throw',
  'finally',
  'typeof',
  'instanceof',
  'switch',
  'case',
  'break',
  'continue',
])

const SHELL_KEYWORDS = new Set([
  'git',
  'clone',
  'npm',
  'npx',
  'pnpm',
  'yarn',
  'node',
  'run',
  'dev',
  'build',
  'test',
  'start',
  'install',
  'i',
  'add',
  'cd',
  'cp',
  'mv',
  'rm',
  'mkdir',
  'echo',
  'cat',
  'curl',
  'export',
  'sudo',
  'preview',
  'init',
  'push',
  'pull',
  'checkout',
  'commit',
  'status',
])

const TYPES = new Set([
  'string',
  'number',
  'boolean',
  'void',
  'any',
  'never',
  'unknown',
  'Promise',
  'Record',
  'Array',
  'ReactNode',
  'DocSection',
  'DocSubSection',
  'Objective',
  'LabManifest',
])

const LITERALS = new Set(['true', 'false', 'null', 'undefined'])

function highlightLine(line, lang) {
  const isShell = /^(bash|shell|sh|zsh)$/i.test(lang)
  const trimmed = line.trim()

  if (trimmed.startsWith('//') || (isShell && trimmed.startsWith('#'))) {
    return `<span class="tok-comment">${esc(line)}</span>`
  }

  const tokenRegex =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*|#.*|--[a-zA-Z0-9_-]+|-[a-zA-Z0-9]+|\b\d+(?:\.\d+)?\b|[a-zA-Z_$][a-zA-Z0-9_$-]*(?:\/[a-zA-Z0-9_$-]+)*|[^\s\w]+|\s+)/g

  const matches = line.match(tokenRegex) || [line]

  return matches
    .map((token) => {
      const t = esc(token)
      if (
        (token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'")) ||
        (token.startsWith('`') && token.endsWith('`'))
      ) {
        return `<span class="tok-string">${t}</span>`
      }
      if (token.startsWith('//') || (isShell && token.startsWith('#'))) {
        return `<span class="tok-comment">${t}</span>`
      }
      if (token.startsWith('-') && token.length > 1) {
        return `<span class="tok-flag">${t}</span>`
      }
      if (/^\d+(\.\d+)?$/.test(token)) {
        return `<span class="tok-number">${t}</span>`
      }
      if (JS_KEYWORDS.has(token) || (isShell && SHELL_KEYWORDS.has(token))) {
        return `<span class="tok-keyword">${t}</span>`
      }
      if (TYPES.has(token) || LITERALS.has(token)) {
        return `<span class="tok-type">${t}</span>`
      }
      if (token.includes('/') && !token.startsWith('//')) {
        return `<span class="tok-path">${t}</span>`
      }
      return t
    })
    .join('')
}

function codeBlock(content, lang = 'shell', filename) {
  const lines = String(content ?? '').split('\n')
  const langLabel = (lang || 'shell').toLowerCase()
  const long = lines.length > 34

  return `<div class="code${long ? ' code-long' : ''}">
  <div class="code-head">
    <span class="dots"><i></i><i></i><i></i></span>
    <span class="code-meta"><span class="lang">${esc(langLabel)}</span>${
      filename ? `<span class="fname">${esc(filename)}</span>` : ''
    }</span>
  </div>
  <pre>${lines
    .map((line) => (line === '' ? '&nbsp;' : highlightLine(line, langLabel)))
    .join('\n')}</pre>
</div>`
}

/** Splits raw prose that embeds fenced code (```lang) into text/code segments. */
function richSegments(text) {
  const src = String(text ?? '')
  const re = /```([^\n`]*)\n([\s\S]*?)```/g
  const out = []
  let last = 0
  let m

  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push({ type: 'text', value: src.slice(last, m.index) })
    const rawLang = (m[1] || '').trim()
    out.push({
      type: 'code',
      lang: rawLang.split(':')[0] || 'shell',
      code: m[2].replace(/\n$/, ''),
    })
    last = re.lastIndex
  }
  if (last < src.length) out.push({ type: 'text', value: src.slice(last) })
  return out
}

/** Renders prose that may embed fenced code, wrapped in the given paragraph tag. */
function renderProse(text, className = 'p') {
  const src = String(text ?? '')
  if (!src.includes('```')) return `<p class="${className}">${inline(src)}</p>`

  return richSegments(src)
    .map((seg) => {
      if (seg.type === 'code') return codeBlock(seg.code, seg.lang)
      const value = seg.value.trim()
      return value ? `<p class="${className}">${inline(value)}</p>` : ''
    })
    .join('\n')
}

/* ═══════════════════════════════════════════════════════════════════
   CALLOUT ICONS
   ═══════════════════════════════════════════════════════════════════ */

const CALLOUT_META = {
  note: {
    label: 'Note',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none"/></svg>',
  },
  tip: {
    label: 'Tip',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h4M8 2a4 4 0 0 1 2.83 6.83L10 10H6l-.83-1.17A4 4 0 0 1 8 2z"/><path d="M6.5 12v1a1.5 1.5 0 0 0 3 0v-1"/></svg>',
  },
  warning: {
    label: 'Warning',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5 1.2 13.5h13.6z"/><line x1="8" y1="6.5" x2="8" y2="9.5"/><circle cx="8" cy="11.5" r="0.6" fill="currentColor" stroke="none"/></svg>',
  },
  critical: {
    label: 'Critical',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11" r="0.6" fill="currentColor" stroke="none"/></svg>',
  },
}

/* ═══════════════════════════════════════════════════════════════════
   BLOCK RENDERERS
   ═══════════════════════════════════════════════════════════════════ */

function renderList(block) {
  const ordered = Boolean(block.ordered)
  const items = block.items || []
  let l1 = block.start ?? 1
  let l2 = 1
  const out = []

  for (const item of items) {
    const isObj = typeof item === 'object' && item !== null
    const text = isObj ? item.text : item
    const level = isObj && item.level ? item.level : 1
    const cls = level === 2 ? 'lv2' : 'lv1'

    if (ordered) {
      let num
      if (level === 2) {
        num = l2++
      } else {
        num = l1++
        l2 = 1
      }
      out.push(
        `<li class="li ${cls}"><span class="num">${num}.</span><span class="li-body">${inline(
          text
        )}</span></li>`
      )
    } else {
      out.push(
        `<li class="li ${cls}"><span class="bullet${level === 2 ? ' hollow' : ''}"></span><span class="li-body">${inline(
          text
        )}</span></li>`
      )
    }
  }

  return `<${ordered ? 'ol' : 'ul'} class="dl ${ordered ? 'dl-ol' : 'dl-ul'}">${out.join('\n')}</${
    ordered ? 'ol' : 'ul'
  }>`
}

function tableColWidths(columns, rows) {
  const n = columns.length
  if (!n) return []

  const plain = (s) =>
    String(s ?? '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`#]/g, '')

  const weights = columns.map((col, i) => {
    const header = plain(col).length * 1.4
    const lens = rows.map((row) => plain(row[i]).length)
    const avg = lens.length ? lens.reduce((a, b) => a + b, 0) / lens.length : 0
    const max = lens.length ? Math.max(...lens) : 0
    return Math.max(10, header + avg * 0.55 + max * 0.25)
  })

  const total = weights.reduce((a, b) => a + b, 0) || 1
  const min = Math.max(4, Math.min(12, Math.floor(100 / n) - 4))
  let widths = weights.map((w) => (w / total) * 100)
  const clamped = new Array(n).fill(false)

  // Water-filling: give every column at least `min`% and renormalize the rest.
  for (let pass = 0; pass < 6; pass++) {
    const fixedSum = widths.reduce((acc, v, i) => acc + (clamped[i] ? v : 0), 0)
    const freeSum = widths.reduce((acc, v, i) => acc + (clamped[i] ? 0 : v), 0)
    let changed = false

    for (let i = 0; i < n; i++) {
      if (clamped[i]) continue
      const scaled = freeSum > 0 ? (widths[i] / freeSum) * (100 - fixedSum) : 0
      if (scaled < min) {
        widths[i] = min
        clamped[i] = true
        changed = true
      }
    }
    if (!changed) break
  }

  const sum = widths.reduce((a, b) => a + b, 0)
  widths = widths.map((w) => Math.round((w / sum) * 1000) / 10)

  const drift = Math.round((100 - widths.reduce((a, b) => a + b, 0)) * 10) / 10
  const widest = widths.indexOf(Math.max(...widths))
  widths[widest] = Math.round((widths[widest] + drift) * 10) / 10

  return widths
}

function renderTable(block) {
  const cols = block.columns || []
  const rows = block.rows || []
  const n = cols.length
  const widths = tableColWidths(cols, rows)
  const wide = n >= 7

  return `<div class="tblock${wide ? ' wide' : ''}">
  <div class="table-wrap cols-${n}">
    <table class="dt">
      <colgroup>${widths.map((w) => `<col style="width:${w}%">`).join('')}</colgroup>
      <thead><tr>${cols.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>
      <tbody>${rows
        .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`)
        .join('\n')}</tbody>
    </table>
  </div>
  ${block.caption ? `<div class="tcap">${inline(block.caption)}</div>` : ''}
</div>`
}

function renderCallout(block) {
  const variant = CALLOUT_META[block.variant] ? block.variant : 'note'
  const meta = CALLOUT_META[variant]
  const items = block.items || []

  const list = items.length
    ? `<ul class="co-list">${items
        .map((item) => {
          const isObj = typeof item === 'object' && item !== null
          const text = isObj ? item.text : item
          const level = isObj && item.level ? item.level : 1
          return `<li class="co-item${level === 2 ? ' lv2' : ''}"><span class="co-dot${
            level === 2 ? ' hollow' : ''
          }"></span><span>${inline(text)}</span></li>`
        })
        .join('')}</ul>`
    : ''

  return `<div class="callout ${variant}">
  <span class="co-icon">${meta.icon}</span>
  <div class="co-body">
    <span class="co-label">${esc(block.label ?? meta.label)}</span>
    ${block.text ? renderCalloutBody(block.text) : ''}
    ${list}
  </div>
</div>`
}

function renderCalloutBody(text) {
  const src = String(text ?? '')
  if (!src.includes('```')) return `<div class="co-text">${inline(src)}</div>`

  return richSegments(src)
    .map((seg) => {
      if (seg.type === 'code') return codeBlock(seg.code, seg.lang)
      const value = seg.value.trim()
      return value ? `<div class="co-text">${inline(value)}</div>` : ''
    })
    .join('\n')
}

function renderStepElements(step) {
  const elements = step.elements
  if (elements && elements.length) {
    return elements
      .map((el) => {
        if (el.type === 'paragraph') return `<p class="step-desc">${inline(el.text)}</p>`
        if (el.type === 'code')
          return `<div class="step-code">${codeBlock(el.content, el.lang ?? 'shell')}</div>`
        if (el.type === 'list') {
          const start = el.start ?? 1
          if (el.ordered) {
            return `<ol class="step-num-list">${el.items
              .map(
                (item, i) =>
                  `<li><span class="sn">${start + i}.</span><span>${inline(item)}</span></li>`
              )
              .join('')}</ol>`
          }
          return `<ul class="step-bullets">${el.items
            .map((item) => `<li><span class="sd"></span><span>${inline(item)}</span></li>`)
            .join('')}</ul>`
        }
        return ''
      })
      .join('\n')
  }

  let html = ''
  if (step.description) html += `<p class="step-desc">${inline(step.description)}</p>`
  if (step.bullets && step.bullets.length) {
    html += `<ul class="step-bullets">${step.bullets
      .map((item) => `<li><span class="sd"></span><span>${inline(item)}</span></li>`)
      .join('')}</ul>`
  }
  if (step.code)
    html += `<div class="step-code">${codeBlock(step.code.content, step.code.lang ?? 'shell')}</div>`
  return html
}

function renderSteps(block) {
  const items = block.items || []
  return `<ol class="steps">${items
    .map(
      (step) => `<li class="step${step.completed ? ' done' : ''}">
  <span class="step-num"></span>
  <div class="step-body">
    <h3 class="step-title">${inline(step.title)}</h3>
    ${renderStepElements(step)}
    ${step.outcome ? `<div class="step-outcome">${inline(step.outcome)}</div>` : ''}
  </div>
</li>`
    )
    .join('\n')}</ol>`
}

function renderGroup(block) {
  return `<div class="group">
  <div class="group-head">
    <span class="group-title">${inline(block.title)}</span>
    ${block.description ? `<span class="group-desc">${inline(block.description)}</span>` : ''}
  </div>
  <div class="group-body">${(block.rows || [])
    .map(
      (row) => `<div class="g-row">
    <div class="g-key">${esc(row.keyLabel)}${
      row.badge ? `<span class="g-tag">${esc(row.badge)}</span>` : ''
    }</div>
    <div class="g-val">${inline(row.text)}</div>
  </div>`
    )
    .join('\n')}</div>
</div>`
}

function renderSubindex(block, section) {
  if (!section || !section.subsections || section.subsections.length === 0) return ''
  return `<div class="subindex">
  <div class="si-head">
    <span class="si-title">${esc(block.title ?? 'Índice del módulo')}</span>
    <span class="si-count">${section.subsections.length} subíndices</span>
  </div>
  <div class="si-list">${section.subsections
    .map(
      (sub, idx) => `<div class="si-card">
    <span class="si-num">${String(idx + 1).padStart(2, '0')}</span>
    <span class="si-text">
      <span class="si-name">${esc(sub.displayTitle || sub.title)}</span>
      ${sub.description ? `<span class="si-desc">${inline(sub.description)}</span>` : ''}
    </span>
  </div>`
    )
    .join('')}</div>
</div>`
}

function renderDiagram(block) {
  return `<figure class="diagram">
  <div class="diagram-head">
    ${block.badge ? `<span class="diagram-badge">${esc(block.badge)}</span>` : ''}
    <span class="diagram-title">${esc(block.title ?? 'Diagrama')}</span>
    ${block.description ? `<span class="diagram-desc">${inline(block.description)}</span>` : ''}
  </div>
  ${block.caption ? `<figcaption>${inline(block.caption)}</figcaption>` : ''}
  <div class="diagram-note">Diagrama interactivo disponible en la versión web de la documentación.</div>
</figure>`
}

function renderImage(block) {
  const src = block.localSrc || block.src
  return `<figure class="figure">
  <img src="${esc(src)}" alt="${esc(block.alt ?? '')}">
  ${block.caption ? `<figcaption>${inline(block.caption)}</figcaption>` : ''}
</figure>`
}

function renderComponentPreview(block) {
  return `<div class="preview-note">
  <span class="preview-label">Componente interactivo</span>
  <p>Este bloque (<code class="ic">${esc(block.component ?? 'preview')}</code>) se renderiza en vivo en la versión web de LILIUM y no puede reproducirse en un documento impreso.</p>
</div>`
}

function renderBlocks(blocks, section) {
  return (blocks || [])
    .map((block) => {
      switch (block.type) {
        case 'paragraph': {
          if ((block.text || '').includes('```')) return renderProse(block.text)
          const t = (block.text || '').trim()
          const isRef = t.startsWith('[') && t.endsWith(')') && /referencia/i.test(block.text)
          return `<p class="p${isRef ? ' ref-p' : ''}">${inline(block.text)}</p>`
        }
        case 'heading':
          if (block.level === 3) return `<h3 class="h3">${inline(block.text)}</h3>`
          if (block.level === 4) return `<h4 class="h4">${inline(block.text)}</h4>`
          return `<h2 class="h2">${inline(block.text)}</h2>`
        case 'callout':
          return renderCallout(block)
        case 'code':
          return codeBlock(block.content, block.lang ?? 'shell', block.filename)
        case 'steps':
          return renderSteps(block)
        case 'table':
          return renderTable(block)
        case 'list':
          return renderList(block)
        case 'group':
          return renderGroup(block)
        case 'subindex':
          return renderSubindex(block, section)
        case 'fileTree':
          return `<div class="ftree">
  <div class="ftree-head">${esc(block.title ?? 'Project Structure')}</div>
  <pre>${esc(block.content)}</pre>
</div>`
        case 'diagram':
          return renderDiagram(block)
        case 'image':
          return renderImage(block)
        case 'componentPreview':
          return renderComponentPreview(block)
        default:
          return ''
      }
    })
    .join('\n')
}

/* ═══════════════════════════════════════════════════════════════════
   ASSETS
   ═══════════════════════════════════════════════════════════════════ */

const imageCache = new Map()

async function cacheRemoteImage(url, idx) {
  if (imageCache.has(url)) return imageCache.get(url)

  const ext = (url.split('?')[0].match(/\.(png|jpe?g|gif|webp|svg)$/i) || ['.png'])[0]
  const file = path.join(ASSET_DIR, `img-${idx}${ext}`)

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(file, buf)
    const local = 'assets/' + path.basename(file)
    imageCache.set(url, local)
    return local
  } catch (err) {
    console.warn(`   ⚠️  No se pudo descargar ${url}: ${err.message}`)
    imageCache.set(url, null)
    return null
  }
}

/* ═══════════════════════════════════════════════════════════════════
   DOCUMENT ASSEMBLY
   ═══════════════════════════════════════════════════════════════════ */

function hasContent(node) {
  if (!node) return false
  if (node.blocks && node.blocks.length > 0) return true
  if (node.subsections && node.subsections.length > 0) return true
  if (typeof node.content === 'string' && node.content.trim()) return true
  if (typeof node.overview === 'string' && node.overview.trim()) return true
  return false
}

function sectionNumber(index) {
  return String(index).padStart(2, '0')
}

function renderCover(sections, stats) {
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
  </div>

  <div class="cover-body">
    <div class="cover-eyebrow"><span class="accent-dot"></span>Edición ${esc(dateLabel)}</div>
    <h1 class="cover-title">Playbook de<br>ciberseguridad</h1>
    <p class="cover-sub">LILIUM es un playbook enfocado en construir una arquitectura digital segura para tu PyME con prácticas interactivas, basado en los conocimientos adquiridos en la Diplomatura en Ciberseguridad.</p>
  </div>

  <div class="cover-stats">
    <div class="stat"><span class="stat-n">${stats.modules}</span><span class="stat-l">Módulos</span></div>
    <div class="stat"><span class="stat-n">100%</span><span class="stat-l">Open Source</span></div>
    <div class="stat"><span class="stat-n">De 0 a 100</span><span class="stat-l">Experiencia</span></div>
  </div>

  <div class="cover-foot">
    <span>Documentación y laboratorios completos en la web:</span>
    <span class="cover-rule"></span>
    <span>lilium-cyber.vercel.app</span>
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
    <span class="toc-num">${sectionNumber(idx)}</span>
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
  ${rows}
  <p class="toc-note">Los títulos de este documento son enlaces navegables. En la versión web, cada módulo incluye además laboratorios interactivos.</p>
</section>`
}

function renderSectionPage(section, idx) {
  const blocks = (section.blocks || []).filter((b) => b.type !== 'subindex')
  const subs = (section.subsections || []).filter(hasContent)
  if (blocks.length === 0 && subs.length === 0) return ''

  return `<section class="section-page" id="s-${section.id}">
  <div class="sec-head">
    <span class="sec-eyebrow">Módulo ${sectionNumber(idx)}</span>
    <h1 class="sec-title">${esc(section.title)}</h1>
  </div>
  <div class="body">${renderBlocks(blocks, section)}</div>
  ${
    subs.length
      ? `<div class="subindex">
    <div class="si-head">
      <span class="si-title">Índice del módulo</span>
      <span class="si-count">${subs.length} subíndices</span>
    </div>
    <div class="si-list">${subs
      .map(
        (sub, i) => `<a class="si-card" href="#ss-${section.id}-${sub.id}">
      <span class="si-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="si-text">
        <span class="si-name">${esc(sub.displayTitle || sub.title)}</span>
        ${sub.description ? `<span class="si-desc">${inline(sub.description)}</span>` : ''}
      </span>
    </a>`
      )
      .join('')}</div>
  </div>`
      : ''
  }
</section>`
}

function renderSubsection(section, sub, idx, parent, extraAnchor) {
  if (!hasContent(sub)) return ''

  const anchor = parent ? `sss-${section.id}-${parent.id}-${sub.id}` : `ss-${section.id}-${sub.id}`
  const crumbs = parent
    ? `${esc(section.title)} <span class="crumb-sep">/</span> ${esc(
        parent.displayTitle || parent.title
      )}`
    : esc(section.title)

  return `<section class="chapter" id="${anchor}">
  ${extraAnchor ? `<span class="anchor" id="${extraAnchor}"></span>` : ''}
  <header class="doc-head">
    <div class="crumbs">${crumbs}</div>
    <h1 class="doc-title">${esc(sub.displayTitle || sub.title)}</h1>
  </header>
  <div class="body">${
    sub.blocks && sub.blocks.length
      ? renderBlocks(sub.blocks, section)
      : sub.content
        ? `<pre class="raw-content">${esc(sub.content)}</pre>`
        : ''
  }</div>
  ${
    sub.subsections && sub.subsections.filter(hasContent).length
      ? `<div class="subindex">
    <div class="si-head">
      <span class="si-title">Subsecciones</span>
      <span class="si-count">${sub.subsections.filter(hasContent).length} apartados</span>
    </div>
    <div class="si-list">${sub.subsections
      .filter(hasContent)
      .map(
        (ss, i) => `<a class="si-card" href="#sss-${section.id}-${sub.id}-${ss.id}">
      <span class="si-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="si-text">
        <span class="si-name">${esc(ss.displayTitle || ss.title)}</span>
        ${ss.description ? `<span class="si-desc">${inline(ss.description)}</span>` : ''}
      </span>
    </a>`
      )
      .join('')}</div>
  </div>`
      : ''
  }
</section>`
}

/* ═══════════════════════════════════════════════════════════════════
   PRINT STYLESHEET  (mirrors Docs* modules)
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
html{font-size:10.4pt;}
body{
  margin:0;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:var(--text);
  line-height:1.74;
  letter-spacing:-.006em;
  background:#fff;
  overflow-x:hidden;
}
html{overflow-x:hidden;}
a{color:inherit;text-decoration:none;}
p{margin:0;}
h1,h2,h3,h4{color:var(--ink);margin:0;font-weight:750;letter-spacing:-.02em;}
svg{display:block;max-width:100%;}
img{max-width:100%;}
.li,.co-text,.g-val,.step-desc,.si-name,.si-desc,.diagram-title,.tcap{overflow-wrap:break-word;}

/* ── Block typography ───────────────────────────────── */
.body{font-size:10.3pt;color:var(--text);line-height:1.78;overflow-wrap:break-word;}
.p{margin:0 0 11pt;overflow-wrap:break-word;}
.p strong{font-weight:650;color:var(--ink);}
.p em{font-style:italic;color:#1a1a1a;}
.ref-p{margin:6pt 0 13pt;line-height:1.5;font-size:9.6pt;}
.h2{font-size:15pt;font-weight:800;margin:22pt 0 10pt;line-height:1.28;break-after:avoid;}
.h3{font-size:12.4pt;font-weight:700;margin:18pt 0 7pt;line-height:1.35;break-after:avoid;}
.h4{font-size:10.8pt;font-weight:650;margin:13pt 0 5pt;line-height:1.45;break-after:avoid;}
.body > .h2:first-child,.body > .h3:first-child,.body > .h4:first-child{margin-top:0;}

.ic{
  font-family:var(--mono);
  font-size:.84em;
  background:rgba(0,0,0,.055);
  color:var(--ink);
  padding:.1em .38em;
  border-radius:4px;
  border:1px solid rgba(0,0,0,.075);
  letter-spacing:0;
  white-space:normal;
  overflow-wrap:anywhere;
  word-break:break-word;
}
.lnk{color:#b3254b;border-bottom:.5px solid rgba(179,37,75,.35);}
.lnk-ext .ext{font-size:.72em;vertical-align:super;color:#b3254b;}
.ref{
  display:inline;
  font-weight:600;
  color:var(--ink);
  border-bottom:.5px solid rgba(0,0,0,.25);
}
.ref-badge{
  font-family:var(--mono);
  font-size:.66em;
  font-weight:600;
  color:var(--text);
  background:rgba(0,0,0,.045);
  border:1px solid rgba(0,0,0,.09);
  border-radius:999px;
  padding:.12em .5em;
  margin-left:.35em;
  white-space:nowrap;
}

/* ── Callouts ───────────────────────────────────────── */
.callout{
  display:flex;
  gap:8pt;
  padding:9pt 10pt;
  border:1px solid rgba(0,0,0,.075);
  border-radius:7px;
  background:var(--surface);
  margin:14pt 0;
  line-height:1.62;
  break-inside:avoid;
}
.co-icon{flex:none;width:11pt;height:11pt;margin-top:1.5pt;color:#5a70a0;}
.co-icon svg{width:11pt;height:11pt;}
.co-body{min-width:0;flex:1;}
.co-label{display:block;font-size:7.4pt;font-weight:750;letter-spacing:.09em;text-transform:uppercase;color:#5a70a0;margin-bottom:2.5pt;}
.co-text{font-size:9.6pt;color:var(--text);line-height:1.68;}
.co-text strong{font-weight:650;color:var(--ink);}
.co-list{list-style:none;margin:5pt 0 0;padding:0;}
.co-item{display:flex;gap:6pt;font-size:9.4pt;line-height:1.6;padding:1.5pt 0;}
.co-item.lv2{margin-left:14pt;font-size:9pt;}
.co-dot{flex:none;width:4pt;height:4pt;border-radius:50%;background:#5a70a0;opacity:.7;margin-top:6pt;}
.co-dot.hollow{background:transparent;border:1.2px solid #5a70a0;border-radius:50%;}
.note .co-icon,.note .co-label{color:#5a70a0;}
.note .co-dot{background:#5a70a0;}
.tip .co-icon,.tip .co-label{color:#2d7d52;}
.tip .co-dot{background:#2d7d52;}
.warning .co-icon,.warning .co-label{color:#b07a10;}
.warning .co-dot{background:#b07a10;}
.critical .co-icon,.critical .co-label{color:#b03030;}
.critical .co-dot{background:#b03030;}

/* ── Code blocks ────────────────────────────────────── */
.code{
  margin:11pt 0;
  border:1px solid rgba(0,0,0,.075);
  border-radius:7px;
  background:#fff;
  overflow:hidden;
  break-inside:avoid;
}
.code-long{break-inside:auto;}
.code-head{
  display:flex;align-items:center;gap:6pt;
  padding:4pt 7pt;
  background:#fafafb;
  border-bottom:1px solid rgba(0,0,0,.05);
}
.dots{display:flex;gap:3pt;}
.dots i{width:5pt;height:5pt;border-radius:50%;display:block;}
.dots i:nth-child(1){background:#ff5f56;opacity:.85;}
.dots i:nth-child(2){background:#ffbd2e;opacity:.85;}
.dots i:nth-child(3){background:#27c93f;opacity:.85;}
.code-meta{display:flex;gap:5pt;align-items:baseline;}
.code .lang{font-family:var(--mono);font-size:6.6pt;font-weight:600;color:var(--muted);letter-spacing:.07em;text-transform:uppercase;}
.code .fname{font-family:var(--mono);font-size:7pt;color:var(--muted);}
.code pre{
  margin:0;
  padding:8pt 9pt 9pt;
  font-family:var(--mono);
  font-size:8.1pt;
  line-height:1.56;
  color:#1e293b;
  white-space:pre-wrap;
  word-break:break-word;
  overflow-wrap:anywhere;
}
.tok-keyword{color:#e3587f;font-weight:600;}
.tok-string{color:#059669;}
.tok-comment{color:#64748b;font-style:italic;}
.tok-flag{color:#0284c7;font-weight:500;}
.tok-type{color:#5aa568;font-weight:600;}
.tok-number{color:#d97706;font-weight:500;}
.tok-path{color:#5aa568;}

/* ── Tables ─────────────────────────────────────────── */
.tblock{margin:13pt 0;break-inside:avoid;}
.table-wrap{
  margin:13pt 0 4pt;
  border:1px solid var(--line);
  border-radius:8px;
  overflow:hidden;
  background:#fff;
}
.dt{width:100%;max-width:100%;table-layout:fixed;border-collapse:collapse;font-size:8.7pt;line-height:1.5;}
.dt th{
  background:#fafafa;
  border-bottom:1px solid rgba(0,0,0,.09);
  padding:7pt 8pt;
  font-size:7.4pt;font-weight:750;color:var(--ink);
  letter-spacing:.055em;text-transform:uppercase;text-align:left;line-height:1.35;
  overflow-wrap:break-word;
}
.dt td{padding:7pt 8pt;border-bottom:1px solid var(--line-soft);vertical-align:top;color:var(--text);overflow-wrap:break-word;hyphens:auto;}
.dt tr:last-child td{border-bottom:none;}
.dt tr{break-inside:avoid;}
.dt td:first-child{color:var(--ink);font-weight:500;}
.dt td strong{font-weight:650;color:var(--ink);}
.dt td br{display:block;content:'';margin-top:3pt;}
.dt td .ic,.dt th .ic{font-size:.84em;white-space:normal;}
.cols-4 .dt,.cols-5 .dt,.cols-6 .dt{font-size:8pt;}
.cols-5 .dt th,.cols-6 .dt th{font-size:6.9pt;}
.cols-7 .dt,.cols-8 .dt{font-size:7.3pt;line-height:1.42;}
.cols-7 .dt th,.cols-8 .dt th{font-size:6.2pt;letter-spacing:.015em;}
.cols-7 .dt td,.cols-8 .dt td{padding:5.5pt 5pt;}
.cols-7 .dt th,.cols-8 .dt th{padding:5.5pt 5pt;}
.tcap{font-size:8pt;color:var(--muted);font-style:italic;margin:3pt 1.5pt 13pt;line-height:1.45;}

/* ── Steps ──────────────────────────────────────────── */
.steps{list-style:none;margin:15pt 0;padding:0;counter-reset:step;}
.step{display:grid;grid-template-columns:20pt 1fr;column-gap:8pt;position:relative;counter-increment:step;}
.step:not(:last-child)::after{
  content:'';position:absolute;left:9.5pt;top:22pt;bottom:-2pt;width:.6pt;background:rgba(0,0,0,.12);
}
.step-num{
  width:20pt;height:20pt;border-radius:50%;
  border:1.2px solid rgba(0,0,0,.13);
  background:#fff;
  display:flex;align-items:center;justify-content:center;
  font-size:7.4pt;font-weight:750;color:var(--ink);
  position:relative;z-index:1;
}
.step-num::before{content:counter(step);}
.step.done .step-num{background:var(--accent);border-color:var(--accent);color:#fff;}
.step-body{padding-bottom:15pt;min-width:0;}
.step:last-child .step-body{padding-bottom:0;}
.step-title{font-size:9.8pt;font-weight:700;color:var(--ink);margin:1pt 0 4pt;line-height:1.4;break-after:avoid;}
.step-desc{font-size:9.2pt;line-height:1.65;color:var(--text);margin:0 0 7pt;}
.step-desc strong{font-weight:650;color:var(--ink);}
.step-code .code{margin:6pt 0 8pt;}
.step-code .code pre{font-size:7.8pt;}
.step-bullets,.step-num-list{list-style:none;margin:2pt 0 7pt;padding:0;}
.step-bullets li,.step-num-list li{display:flex;gap:5pt;font-size:9pt;line-height:1.6;padding:1.5pt 0;color:var(--text);}
.step-bullets li strong,.step-num-list li strong{font-weight:650;color:var(--ink);}
.sd{flex:none;width:4pt;height:4pt;border-radius:50%;background:var(--accent);opacity:.75;margin-top:5.6pt;}
.sn{font-family:var(--mono);font-size:8pt;font-weight:700;color:var(--ink);min-width:12pt;}
.step-outcome{
  display:inline-block;margin-top:5pt;padding:3pt 8pt;
  border:1px solid rgba(45,125,82,.35);border-radius:999px;
  background:rgba(45,125,82,.05);
  font-size:8.2pt;font-weight:600;color:#2d7d52;line-height:1.45;
}

/* ── Lists ──────────────────────────────────────────── */
.dl{list-style:none;margin:12pt 0 15pt;padding:0;display:block;}
.li{display:flex;align-items:flex-start;gap:7pt;font-size:10.2pt;line-height:1.72;color:var(--text);padding:2.5pt 0;break-inside:avoid;}
.li.lv2{margin-left:16pt;font-size:9.7pt;}
.li .bullet{flex:none;width:4pt;height:4pt;border-radius:50%;background:var(--ink);opacity:.42;margin-top:7.3pt;}
.li .bullet.hollow{background:transparent;border:1.1px solid var(--ink);opacity:.55;}
.li .num{flex:none;font-family:var(--mono);font-size:8.6pt;font-weight:700;color:var(--ink);min-width:14pt;padding-top:2.2pt;}
.li .li-body{flex:1;min-width:0;}
.li strong{font-weight:650;color:var(--ink);}
.li .ic{white-space:normal;}

/* ── Groups ─────────────────────────────────────────── */
.group{margin:13pt 0;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff;break-inside:avoid;}
.group-head{display:flex;align-items:baseline;gap:7pt;padding:6pt 9pt;background:#fafafa;border-bottom:1px solid rgba(0,0,0,.07);}
.group-title{font-size:7.6pt;font-weight:750;color:var(--ink);letter-spacing:.05em;text-transform:uppercase;}
.group-desc{font-size:7.6pt;color:var(--muted);margin-left:auto;}
.g-row{display:flex;align-items:flex-start;gap:10pt;padding:6pt 9pt;border-bottom:1px solid var(--line-soft);}
.g-row:last-child{border-bottom:none;}
.g-key{
  font-family:var(--mono);font-size:7.8pt;font-weight:500;color:var(--ink);
  width:34%;flex:none;line-height:1.4;overflow-wrap:break-word;
}
.g-tag{
  display:inline-block;margin-top:3pt;font-family:-apple-system,sans-serif;
  font-size:6.5pt;font-weight:600;color:var(--text);
  background:rgba(0,0,0,.045);border:1px solid rgba(0,0,0,.08);
  border-radius:999px;padding:1pt 5pt;
}
.g-val{flex:1;min-width:0;font-size:8.8pt;line-height:1.55;color:var(--text);}
.g-val strong{font-weight:650;color:var(--ink);}

/* ── File tree ──────────────────────────────────────── */
.ftree{margin:13pt 0;border:1px solid var(--line);border-radius:8px;overflow:hidden;break-inside:avoid;}
.ftree-head{padding:5pt 9pt;background:#f5f5f5;border-bottom:1px solid rgba(0,0,0,.07);font-size:7.4pt;font-weight:650;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;}
.ftree pre{margin:0;padding:8pt 10pt;font-family:var(--mono);font-size:7.6pt;line-height:1.62;color:var(--text);white-space:pre-wrap;word-break:break-word;}

/* ── Sub-index cards ────────────────────────────────── */
.subindex{margin-top:20pt;padding-top:14pt;border-top:1px solid rgba(0,0,0,.07);break-inside:avoid;}
.si-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:7pt;}
.si-title{font-size:7.6pt;font-weight:650;color:var(--muted);text-transform:uppercase;letter-spacing:.09em;}
.si-count{font-family:var(--mono);font-size:7.2pt;color:var(--muted);}
.si-list{display:block;}
.si-card{
  display:flex;gap:9pt;align-items:flex-start;
  padding:7pt 9pt;margin-bottom:5pt;
  border:1px solid var(--line);border-radius:7px;background:#fff;
  break-inside:avoid;
}
.si-num{font-family:var(--mono);font-size:8pt;font-weight:700;color:var(--muted);min-width:15pt;padding-top:1pt;}
.si-text{flex:1;min-width:0;}
.si-name{display:block;font-size:9.2pt;font-weight:650;color:var(--ink);line-height:1.35;}
.si-desc{display:block;font-size:8.3pt;color:var(--muted);line-height:1.5;margin-top:2pt;}

/* ── Figures ────────────────────────────────────────── */
.figure{margin:13pt 0;break-inside:avoid;}
.figure img{width:100%;max-height:360pt;object-fit:contain;border:1px solid var(--line);border-radius:8px;background:#fff;}
.figure figcaption,.diagram figcaption{font-size:8pt;color:var(--muted);font-style:italic;margin-top:4pt;line-height:1.5;}
.diagram{margin:13pt 0;border:1px solid var(--line);border-radius:8px;overflow:hidden;break-inside:avoid;background:#fff;}
.diagram-head{display:flex;align-items:center;gap:7pt;padding:6pt 9pt;background:#fafafa;border-bottom:1px solid rgba(0,0,0,.06);}
.diagram-badge{font-family:var(--mono);font-size:6.6pt;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);border:1px solid rgba(255,51,102,.3);background:rgba(255,51,102,.06);border-radius:999px;padding:1pt 5pt;}
.diagram-title{font-size:8.6pt;font-weight:650;color:var(--ink);}
.diagram-desc{font-size:7.6pt;color:var(--muted);margin-left:auto;}
.diagram-canvas{padding:10pt;background-color:#fcfcfc;background-image:radial-gradient(rgba(0,0,0,.10) .7px,transparent .7px);background-size:9pt 9pt;}
.diagram-canvas svg{width:100%;height:62pt;}
.diagram figcaption{margin:0;padding:8pt 9pt 0;}
.diagram-note{padding:4pt 9pt 7pt;font-size:7.2pt;color:#b5b5b5;}
.preview-note{margin:13pt 0;padding:9pt 10pt;border:1px dashed rgba(0,0,0,.18);border-radius:8px;background:#fcfcfc;}
.preview-label{display:block;font-size:7.2pt;font-weight:750;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:3pt;}
.preview-note p{font-size:9pt;line-height:1.6;margin:0;}

/* ── Cover ──────────────────────────────────────────── */
.cover{
  height:247mm;
  display:flex;flex-direction:column;
  break-after:page;
  position:relative;
}
.cover-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:14mm;border-bottom:1px solid rgba(0,0,0,.09);}
.cover-brand{display:flex;align-items:center;gap:8pt;color:var(--ink);}
.logo-mark{width:19pt;height:19pt;}
.wordmark{font-size:11pt;font-weight:800;letter-spacing:.24em;}
.cover-tag{font-family:var(--mono);font-size:7.2pt;letter-spacing:.14em;color:var(--muted);}
.cover-body{margin-top:52mm;}
.cover-eyebrow{display:flex;align-items:center;gap:6pt;font-size:8.4pt;font-weight:650;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);}
.accent-dot{width:5.5pt;height:5.5pt;border-radius:50%;background:var(--accent);}
.cover-title{font-size:37pt;font-weight:800;letter-spacing:-.035em;line-height:1.06;margin:12pt 0 0;color:#0d0d0d;}
.cover-sub{margin-top:14pt;max-width:118mm;font-size:11pt;line-height:1.65;color:var(--text);}
.cover-stats{display:flex;gap:0;margin-top:auto;margin-bottom:10mm;border-top:1px solid rgba(0,0,0,.09);border-bottom:1px solid rgba(0,0,0,.09);}
.stat{flex:1;padding:10pt 0;border-right:1px solid rgba(0,0,0,.07);}
.stat:last-child{border-right:none;}
.stat-n{display:block;font-size:21pt;font-weight:800;color:var(--ink);letter-spacing:-.03em;line-height:1;}
.stat-l{display:block;margin-top:4pt;font-size:7.6pt;text-transform:uppercase;letter-spacing:.11em;color:var(--muted);}
.cover-foot{display:flex;align-items:center;gap:8pt;font-size:8pt;color:var(--muted);}
.cover-rule{flex:1;height:1px;background:rgba(0,0,0,.09);}

/* ── Table of contents ──────────────────────────────── */
.toc{break-after:page;}
.toc-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:9pt;margin-bottom:14pt;}
.toc-eyebrow{font-size:8pt;font-weight:650;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);}
.toc-title{font-size:23pt;font-weight:800;letter-spacing:-.03em;margin-top:4pt;}
.toc-section{margin-bottom:11pt;break-inside:avoid;}
.toc-sec-link{display:flex;align-items:baseline;gap:9pt;text-decoration:none;padding-bottom:4pt;border-bottom:1px solid rgba(0,0,0,.07);}
.toc-num{font-family:var(--mono);font-size:8.4pt;font-weight:700;color:var(--accent);}
.toc-sec-title{font-size:11.4pt;font-weight:750;color:var(--ink);letter-spacing:-.015em;}
.toc-sub{padding-left:24pt;}
.toc-sub-link{display:block;font-size:9.2pt;color:var(--text);padding:2pt 0;line-height:1.45;}
.toc-subsub-link{display:block;font-size:8.4pt;color:var(--muted);padding:1.5pt 0 1.5pt 14pt;line-height:1.4;}
.toc-note{margin-top:16pt;font-size:8pt;color:var(--muted);font-style:italic;line-height:1.55;}

/* ── Section divider / chapter headers ──────────────── */
.section-page{break-before:page;}
.sec-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:12pt;margin-bottom:18pt;}
.sec-eyebrow{font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--accent);}
.sec-title{font-size:26pt;font-weight:800;letter-spacing:-.03em;line-height:1.12;margin-top:7pt;}
.chapter{break-before:page;}
.doc-head{border-bottom:1px solid rgba(0,0,0,.09);padding-bottom:10pt;margin-bottom:16pt;}
.crumbs{font-size:7.6pt;font-weight:650;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:5pt;}
.crumbs::before{content:'';display:inline-block;width:4pt;height:4pt;border-radius:50%;background:var(--accent);margin-right:5pt;vertical-align:1pt;}
.crumb-sep{color:#cfcfcf;padding:0 2pt;}
.doc-title{font-size:20pt;font-weight:800;letter-spacing:-.028em;line-height:1.16;color:#0d0d0d;}
.body{font-size:10.3pt;}

/* Keep code/callout/headings from stranding */
.callout,.ftree,.figure,.diagram{break-inside:avoid;}
.raw-content{white-space:pre-wrap;font-family:inherit;}
.anchor{display:block;height:0;overflow:hidden;}
`

/* ═══════════════════════════════════════════════════════════════════
   BUILD HTML
   ═══════════════════════════════════════════════════════════════════ */

async function buildHtml() {
  const all = JSON.parse(fs.readFileSync(DOCS_JSON, 'utf8'))
  const sections = all.filter((s) => INCLUDE_SHOWCASE || s.id !== 'showcase')

  fs.mkdirSync(ASSET_DIR, { recursive: true })

  // Resolve remote images up-front so the PDF is self-contained.
  let imgIdx = 0
  const allNodes = [sections]
  const queue = []
  const collect = (node) => {
    if (!node || typeof node !== 'object') return
    if (node.type === 'image' && /^https?:\/\//i.test(node.src || '')) queue.push(node)
    for (const key of Object.keys(node)) {
      const v = node[key]
      if (Array.isArray(v)) v.forEach(collect)
      else if (v && typeof v === 'object') collect(v)
    }
  }
  collect(allNodes)
  for (const node of queue) {
    const local = await cacheRemoteImage(node.src, imgIdx++)
    if (local) node.localSrc = local
  }

  const chapters = []
  sections.forEach((section, idx) => {
    const hasSectionBlocks = Boolean(section.blocks && section.blocks.length)
    const sectionPage = hasSectionBlocks ? renderSectionPage(section, idx) : ''
    if (sectionPage) chapters.push(sectionPage)

    let needsSectionAnchor = !sectionPage

    for (const sub of section.subsections || []) {
      const subPage = renderSubsection(
        section,
        sub,
        idx,
        undefined,
        needsSectionAnchor ? `s-${section.id}` : undefined
      )
      if (subPage) {
        chapters.push(subPage)
        needsSectionAnchor = false
      }

      for (const ss of sub.subsections || []) {
        const nested = renderSubsection(section, ss, idx, sub)
        if (nested) chapters.push(nested)
      }
    }
  })

  const countBlocks = (node) => {
    let n = 0
    if (node.blocks) n += node.blocks.length
    for (const sub of node.subsections || []) n += countBlocks(sub)
    return n
  }
  const blockTotal = sections.reduce((acc, s) => acc + countBlocks(s), 0)
  const subTotal = sections.reduce((acc, s) => {
    const walk = (node) => (node.subsections || []).reduce((n, sub) => n + 1 + walk(sub), 0)
    return acc + walk(s)
  }, 0)
  const moduleCount = sections.filter((s) => s.id !== 'showcase').length

  const stats = { modules: moduleCount, subsections: subTotal, blocks: blockTotal }

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>LILIUM — Documentación de ciberseguridad</title>
<meta name="author" content="LILIUM">
<meta name="description" content="Playbook de ciberseguridad por capas para PyMEs.">
<style>${CSS}</style>
</head>
<body>
${renderCover(sections, stats)}
${renderTOC(sections)}
${chapters.join('\n')}
</body>
</html>`

  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(HTML_OUT, html, 'utf8')
  console.log(
    `   📝 HTML generado: ${path.relative(ROOT, HTML_OUT)} (${stats.modules} módulos · ${stats.subsections} subsecciones · ${stats.blocks} bloques)`
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
        const handlers = this.listeners.get(key) || []
        handlers.forEach((fn) => fn(msg.params))
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
      const timer = setTimeout(() => {
        const list = this.listeners.get(key) || []
        this.listeners.set(
          key,
          list.filter((fn) => fn !== handler)
        )
        reject(new Error(`Timeout esperando ${method}`))
      }, timeoutMs)

      const handler = (params) => {
        clearTimeout(timer)
        const list = this.listeners.get(key) || []
        this.listeners.set(
          key,
          list.filter((fn) => fn !== handler)
        )
        resolve(params)
      }
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
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lilium-pdf-'))
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

    // Wait for fonts + images to settle.
    await cdp.send(
      'Runtime.evaluate',
      {
        expression: `(async () => {
          if (document.fonts && document.fonts.ready) { try { await document.fonts.ready } catch (e) {} }
          await Promise.all(Array.from(document.images).filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r })))
          return document.body.scrollHeight
        })()`,
        awaitPromise: true,
      },
      sessionId
    )

    const footer = `<div style="width:100%;padding:0 14mm;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:7.5px;color:#9a9a9a;display:flex;align-items:center;justify-content:space-between;">
  <span style="letter-spacing:.08em;">LILIUM · PLAYBOOK DE CIBERSEGURIDAD</span>
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
    try {
      if (targetId) await cdp.send('Target.closeTarget', { targetId })
      await cdp.send('Browser.close')
    } catch {
      /* ignore */
    }
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
  console.log('📚 Compilando documentación a PDF A4…')
  await buildHtml()
  console.log('   🖨️  Renderizando con Chrome headless…')
  const { bytes } = await printPdf()

  if (!KEEP_HTML) fs.rmSync(HTML_OUT, { force: true })

  console.log(
    `\n✅ PDF generado: ${path.relative(ROOT, PDF_OUT)} (${(bytes / 1024 / 1024).toFixed(1)} MB)`
  )
}

main().catch((err) => {
  console.error('\n❌ Error generando el PDF:', err)
  process.exit(1)
})
