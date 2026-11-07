/**
 * DocsTable — a minimal, scrollable data table for documentation.
 *
 * Usage:
 *
 *   <DocsTable
 *     columns={['Command', 'Description', 'When to use']}
 *     rows={[
 *       ['npm run dev',   'Start the development server',  'Local development'],
 *       ['npm run build', 'Build the production bundle',   'Staging / CI'],
 *       ['npm run preview','Preview the production build', 'Final checks'],
 *     ]}
 *     caption="Available npm scripts"
 *   />
 *
 * Cells support any ReactNode (string, <code>, <strong>, etc.).
 * Column headers are rendered bold + uppercase by default.
 */
import { useMemo, type ReactNode } from 'react'
import { renderInline } from '@/utils/renderInline'
import styles from './DocsTable.module.css'

interface Props {
  /** Header labels — one per column */
  columns: ReactNode[]
  /** Row data — each inner array must match column count */
  rows: ReactNode[][]
  /** Optional muted caption below the table */
  caption?: string
}

function renderCell(cell: ReactNode): ReactNode {
  if (typeof cell !== 'string') return cell
  return renderInline(cell)
}

function getNodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join(' ')
  if (
    typeof node === 'object' &&
    'props' in node &&
    (node as { props?: { children?: ReactNode } }).props?.children
  ) {
    return getNodeText((node as { props: { children?: ReactNode } }).props.children)
  }
  return ''
}

function cleanMarkdownAndHtml(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, ' ') // Strip HTML tags (<br>, <span>, <code>, etc.)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link text](url) -> link text
    .replace(/[*_`#~]/g, '') // Strip markdown formatting symbols (*, _, `, etc.)
    .replace(/\s+/g, ' ')
    .trim()
}

function getCellMetrics(node: ReactNode): { maxLineLength: number; totalCleanLength: number } {
  const raw = getNodeText(node)
  if (!raw) return { maxLineLength: 0, totalCleanLength: 0 }

  const lines = raw
    .split(/<br\s*\/?>|\n/i)
    .map(cleanMarkdownAndHtml)
    .filter(Boolean)
  const totalClean = cleanMarkdownAndHtml(raw)

  const maxLine = lines.length > 0 ? Math.max(...lines.map((l) => l.length)) : totalClean.length

  return {
    maxLineLength: maxLine,
    totalCleanLength: totalClean.length,
  }
}

export default function DocsTable({ columns, rows, caption }: Props) {
  // Analyze character count and line distribution per column to provide optimal horizontal space
  const colStats = useMemo(() => {
    return columns.map((col, colIdx) => {
      const headMetrics = getCellMetrics(col)
      let maxLineLength = headMetrics.maxLineLength
      let maxCellLength = headMetrics.totalCleanLength
      let totalLength = headMetrics.totalCleanLength

      for (const row of rows) {
        const cellMetrics = getCellMetrics(row[colIdx])
        if (cellMetrics.maxLineLength > maxLineLength) {
          maxLineLength = cellMetrics.maxLineLength
        }
        if (cellMetrics.totalCleanLength > maxCellLength) {
          maxCellLength = cellMetrics.totalCleanLength
        }
        totalLength += cellMetrics.totalCleanLength
      }

      const avgCellLength =
        rows.length > 0 ? totalLength / (rows.length + 1) : headMetrics.totalCleanLength
      return {
        colIdx,
        maxLineLength,
        maxCellLength,
        avgCellLength,
      }
    })
  }, [columns, rows])

  // Derive column width weighting: the first column (label/subject) is kept compact and snug,
  // allowing descriptive and multi-sentence columns to claim the expansive space.
  const colStyles = useMemo(() => {
    const totalCols = columns.length
    if (totalCols === 0) return []

    // 1-column table
    if (totalCols === 1) {
      return [{ width: '100%' }]
    }

    // 2-column key-value table: key on column 0, full description on column 1
    if (totalCols === 2) {
      const stat0 = colStats[0]
      const stat1 = colStats[1]

      let minWidthPx: number
      let widthPx: number
      let maxWidthPx: number

      if (stat0.maxLineLength <= 12) {
        minWidthPx = 95
        widthPx = 115
        maxWidthPx = 140
      } else if (stat0.maxLineLength <= 25) {
        minWidthPx = 130
        widthPx = 160
        maxWidthPx = 200
      } else if (stat0.maxLineLength <= 40) {
        minWidthPx = 170
        widthPx = 200
        maxWidthPx = 240
      } else {
        minWidthPx = 200
        widthPx = Math.min(250, Math.max(210, Math.round(stat0.maxLineLength * 4)))
        maxWidthPx = 260
      }

      return [
        {
          minWidth: `${minWidthPx}px`,
          width: `${widthPx}px`,
          maxWidth: `${maxWidthPx}px`,
        },
        {
          minWidth: stat1.maxCellLength > 120 ? '380px' : '280px',
          width: '100%',
        },
      ]
    }

    // Multi-column table (totalCols >= 3):
    // 1. Column 0 (Row key / label / category) - keep it snug and bound its maximum width
    const stat0 = colStats[0]
    let col0MinWidth: number
    let col0Width: number
    let col0MaxWidth: number

    if (stat0.maxLineLength <= 10) {
      // Very short identifiers (e.g. "HTTP", "Ring 0", "/24", "nano", "T-01")
      col0MinWidth = 90
      col0Width = 110
      col0MaxWidth = 130
    } else if (stat0.maxLineLength <= 22) {
      // Short labels (e.g. "Ubuntu", "Perfil", "Principio", "Confidencialidad")
      col0MinWidth = 130
      col0Width = 155
      col0MaxWidth = 190
    } else if (stat0.maxLineLength <= 38) {
      // Medium labels (e.g. "Framework (Marco de trabajo)", "Tiempo de arranque")
      col0MinWidth = 165
      col0Width = 195
      col0MaxWidth = 230
    } else {
      // Longer labels or labels with subtitles (e.g. "Nivel de Madurez (CIS IG1)", "Momento de acción")
      col0MinWidth = Math.min(230, Math.max(180, Math.round(stat0.maxLineLength * 3.6)))
      col0Width = Math.min(250, Math.max(200, Math.round(stat0.maxLineLength * 3.8)))
      col0MaxWidth = 260
    }

    const col0Style = {
      minWidth: `${col0MinWidth}px`,
      width: `${col0Width}px`,
      maxWidth: `${col0MaxWidth}px`,
    }

    // 2. Remaining columns (1..N): content & description columns
    const otherWeights = colStats.slice(1).map((stat) => {
      let minWidthPx: number
      let flexWeight: number

      if (stat.maxCellLength <= 12 && stat.avgCellLength <= 10) {
        minWidthPx = 95
        flexWeight = 0.8
      } else if (stat.maxCellLength <= 30 && stat.avgCellLength <= 25) {
        minWidthPx = 135
        flexWeight = 1.2
      } else if (stat.maxCellLength <= 75 && stat.avgCellLength <= 50) {
        minWidthPx = 180
        flexWeight = 2.2
      } else if (stat.maxCellLength > 160 || stat.avgCellLength > 95) {
        minWidthPx = 320
        flexWeight = 5.5
      } else {
        minWidthPx = 250
        flexWeight = 3.5
      }

      return { minWidthPx, flexWeight }
    })

    const totalOtherWeight = otherWeights.reduce((sum, item) => sum + item.flexWeight, 0)

    const otherStyles = otherWeights.map((item) => {
      const sharePct = ((item.flexWeight / totalOtherWeight) * 100).toFixed(1)
      return {
        minWidth: `${item.minWidthPx}px`,
        width: `${sharePct}%`,
      }
    })

    return [col0Style, ...otherStyles]
  }, [columns.length, colStats])

  return (
    <div className={styles.container}>
      <div
        className={styles.wrapper}
        role="region"
        aria-label={typeof caption === 'string' ? caption : undefined}
      >
        <table className={styles.table} data-columns={columns.length}>
          <colgroup>
            {colStyles.map((style, i) => (
              <col key={i} style={{ width: style.width }} />
            ))}
          </colgroup>
          <thead className={styles.thead}>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={styles.th} scope="col" style={colStyles[i]}>
                  {renderCell(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((row, ri) => (
              <tr key={ri} className={styles.tr}>
                {columns.map((_, ci) => (
                  <td key={ci} className={styles.td} style={colStyles[ci]}>
                    {renderCell(row[ci] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <p className={styles.caption}>{renderInline(caption)}</p> : null}
    </div>
  )
}
