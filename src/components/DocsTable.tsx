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
import type { ReactNode } from 'react'
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

export default function DocsTable({ columns, rows, caption }: Props) {
  return (
    <div className={styles.container}>
      <div
        className={styles.wrapper}
        role="region"
        aria-label={typeof caption === 'string' ? caption : undefined}
      >
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={styles.th} scope="col">
                  {renderCell(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((row, ri) => (
              <tr key={ri} className={styles.tr}>
                {columns.map((_, ci) => (
                  <td key={ci} className={styles.td}>
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
