/**
 * DocsContent — renders the active section overview or subsection content.
 *
 * All content structures are dynamically driven by `src/data/docs.json`:
 *  - Tables (DocsTable)
 *  - Numbered Steps (DocsSteps, DocsStep) with CodeBlocks
 *  - Fenced & standalone Code Blocks with light theme + keyword color accents
 *  - Grouped key-value containers (DocsGroup, DocsGroupRow)
 *  - Unordered lists (DocsList, DocsListItem)
 *  - Contextual callouts (DocsCallout)
 *  - File trees & prose
 */
import type { ReactNode } from 'react'
import type { DocSection, DocSubSection, DocBlock } from '@/data/docs'
import styles from './DocsContent.module.css'
import DocsCallout from './DocsCallout'
import { DocsSteps, DocsStep } from './DocsSteps'
import { DocsList, DocsListItem, DocsGroup, DocsGroupRow } from './DocsList'
import DocsTable from './DocsTable'
import CodeBlock from './CodeBlock'

interface Props {
  section?: DocSection
  subSection?: DocSubSection
}

/* ── Inline `code` highlighter ── */
function renderInline(text: string, key: string | number) {
  const parts = text.split(/(`[^`]+`)/g)
  return (
    <span key={key}>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          part
        ),
      )}
    </span>
  )
}

/* ── Body parser for plain-text / Markdown fallback ── */
function renderBody(text: string) {
  if (!text.trim()) return null

  const lines = text.split('\n')
  const nodes: ReactNode[] = []
  let i = 0

  // Detect file-tree block: starts with "src/" and contains indented paths
  const isFileTree =
    lines.some((l) => l.trim().startsWith('src/')) &&
    lines.some((l) => l.startsWith(' ') || l.startsWith('\t'))

  if (isFileTree) {
    const treeStart = lines.findIndex((l) => l.trim().startsWith('src/'))
    const prose = lines.slice(0, treeStart).join('\n').trim()
    const tree = lines.slice(treeStart).join('\n')

    return (
      <>
        {prose && <p className={styles.pre}>{renderInline(prose, 'prose')}</p>}
        <div className={styles.fileTree}>
          <div className={styles.fileTreeHeader}>Project Structure</div>
          <pre className={styles.fileTreeBody}>{tree}</pre>
        </div>
      </>
    )
  }

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block -> uses light CodeBlock with keyword accents
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'shell'
      const blockLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        blockLines.push(lines[i])
        i++
      }
      nodes.push(
        <CodeBlock
          key={i}
          lang={lang}
          code={blockLines.join('\n')}
        />,
      )
      i++
      continue
    }

    if (!line.trim()) {
      i++
      continue
    }

    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```')
    ) {
      paraLines.push(lines[i])
      i++
    }

    nodes.push(
      <p className={styles.pre} key={i}>
        {renderInline(paraLines.join(' '), 'p')}
      </p>,
    )
  }

  return <>{nodes}</>
}

/* ── Dynamic Block Renderer ── */
function renderBlock(block: DocBlock, index: number): ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={styles.pre} key={index}>
          {renderInline(block.text, index)}
        </p>
      )

    case 'callout':
      return (
        <DocsCallout
          key={index}
          variant={block.variant ?? 'note'}
          label={block.label}
        >
          {renderInline(block.text, index)}
        </DocsCallout>
      )

    case 'code':
      return (
        <CodeBlock
          key={index}
          lang={block.lang ?? 'shell'}
          filename={block.filename}
          code={block.content}
        />
      )

    case 'steps':
      return (
        <DocsSteps key={index}>
          {block.items.map((step, sIdx) => (
            <DocsStep
              key={sIdx}
              title={step.title}
              code={step.code}
              outcome={step.outcome}
              completed={step.completed}
            >
              {step.description ? renderInline(step.description, sIdx) : null}
            </DocsStep>
          ))}
        </DocsSteps>
      )

    case 'table':
      return (
        <DocsTable
          key={index}
          columns={block.columns}
          rows={block.rows}
          caption={block.caption}
        />
      )

    case 'list':
      return (
        <DocsList key={index}>
          {block.items.map((item, lIdx) => (
            <DocsListItem key={lIdx}>
              {renderInline(item, lIdx)}
            </DocsListItem>
          ))}
        </DocsList>
      )

    case 'group':
      return (
        <DocsGroup
          key={index}
          title={block.title}
          description={block.description}
        >
          {block.rows.map((row, rIdx) => (
            <DocsGroupRow
              key={rIdx}
              keyLabel={row.keyLabel}
              badge={row.badge}
            >
              {renderInline(row.text, rIdx)}
            </DocsGroupRow>
          ))}
        </DocsGroup>
      )

    case 'fileTree':
      return (
        <div className={styles.fileTree} key={index}>
          <div className={styles.fileTreeHeader}>
            {block.title ?? 'Project Structure'}
          </div>
          <pre className={styles.fileTreeBody}>{block.content}</pre>
        </div>
      )

    default:
      return null
  }
}

export default function DocsContent({ section, subSection }: Props) {
  if (!section) {
    return (
      <div className={styles.content}>
        <div className={styles.inner}>
          <p className={styles.empty}>Select a section from the sidebar.</p>
        </div>
      </div>
    )
  }

  const title = subSection ? subSection.title : section.title
  const target = subSection ?? section

  const hasBlocks = target.blocks && target.blocks.length > 0
  const fallbackText = subSection ? subSection.content : section.overview

  return (
    <article className={styles.content}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.breadcrumb}>
            {subSection ? section.title : 'Documentation'}
          </span>
          <h1 className={styles.title}>{title}</h1>
        </header>

        <div className={styles.body}>
          {/* Dynamically render JSON blocks if configured */}
          {hasBlocks ? (
            target.blocks!.map((block, idx) => renderBlock(block, idx))
          ) : fallbackText ? (
            /* Fallback to plain-text / markdown renderer */
            renderBody(fallbackText)
          ) : (
            <p className={styles.empty}>No content yet.</p>
          )}

          {/* Section overview → subsection quick-nav cards */}
          {!subSection && section.subsections.length > 0 && (
            <div className={styles.subIndex}>
              <h2 className={styles.subIndexHeading}>In this section</h2>
              <ul className={styles.subIndexList}>
                {section.subsections.map((sub) => (
                  <li key={sub.id}>
                    <a href={`#${sub.id}`} className={styles.subIndexLink}>
                      {sub.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
