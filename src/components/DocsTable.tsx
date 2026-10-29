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

function getColText(node: ReactNode): string {
  if (node === null || node === undefined) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getColText).join(' ')
  if (
    typeof node === 'object' &&
    'props' in node &&
    (node as { props?: { children?: ReactNode } }).props?.children
  ) {
    return getColText((node as { props: { children?: ReactNode } }).props.children)
  }
  return ''
}

export default function DocsTable({ columns, rows, caption }: Props) {
  // Analyze character count distribution per column to provide optimal horizontal space
  const colStats = useMemo(() => {
    return columns.map((col, colIdx) => {
      const headerLength = getColText(col).length
      let maxCellLength = headerLength
      let totalLength = headerLength

      for (const row of rows) {
        const cellText = getColText(row[colIdx])
        const len = cellText.length
        totalLength += len
        if (len > maxCellLength) {
          maxCellLength = len
        }
      }

      const avgCellLength = rows.length > 0 ? totalLength / (rows.length + 1) : headerLength
      return {
        colIdx,
        maxCellLength,
        avgCellLength,
      }
    })
  }, [columns, rows])

  // Derive column width weighting
  const colStyles = useMemo(() => {
    const totalCols = columns.length
    if (totalCols === 0) return []

    // Calculate raw weight for each column based on content volume
    // Short badges/codes (<=12 chars) get compact min-width, large text get proportional space
    return colStats.map((stat, i) => {
      const maxLen = stat.maxCellLength
      const avgLen = stat.avgCellLength

      let minWidthPx = 140
      let flexWeight = 1

      if (maxLen <= 10 && avgLen <= 8) {
        // Very short column (e.g. "/24", "Port 80", "Ring 0", "HTTP")
        minWidthPx = 95
        flexWeight = 0.8
      } else if (maxLen <= 25 && avgLen <= 18) {
        // Short identifier/name (e.g. "Capa Modelo OSI", "Ubuntu", "Confidencialidad")
        minWidthPx = 140
        flexWeight = 1.3
      } else if (maxLen <= 60 && avgLen <= 45) {
        // Medium column (e.g. "Máscara de subred decimal", "Tipo de Licencia y Soporte")
        minWidthPx = 190
        flexWeight = 2.2
      } else if (maxLen > 100 || avgLen > 70) {
        // High density / expansive text column (> 100 characters) - extra breathing space
        minWidthPx = 420
        flexWeight = 6.2
      } else {
        // Standard description column (60 - 100 characters)
        minWidthPx = 280
        flexWeight = 3.6
      }

      // If it's a 2-column key-value table:
      if (totalCols === 2) {
        if (i === 0) {
          minWidthPx = Math.min(240, Math.max(140, maxLen * 10))
          flexWeight = 1.2
        } else {
          minWidthPx = maxLen > 100 ? 460 : 340
          flexWeight = maxLen > 100 ? 5.6 : 3.6
        }
      }

      return {
        minWidth: `${minWidthPx}px`,
        width: `${flexWeight * 100}%`,
      }
    })
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
              <col key={i} style={style} />
            ))}
          </colgroup>
          <thead className={styles.thead}>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={styles.th}
                  scope="col"
                  style={{
                    minWidth: colStyles[i]?.minWidth,
                    width: colStyles[i]?.width,
                  }}
                >
                  {renderCell(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((row, ri) => (
              <tr key={ri} className={styles.tr}>
                {columns.map((_, ci) => (
                  <td
                    key={ci}
                    className={styles.td}
                    style={{
                      minWidth: colStyles[ci]?.minWidth,
                      width: colStyles[ci]?.width,
                    }}
                  >
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
