/**
 * DocsSteps — numbered implementation step list.
 *
 * Usage:
 *   <DocsSteps>
 *     <DocsStep title="Install dependencies">
 *       Run the installer from the project root.
 *     </DocsStep>
 *
 *     <DocsStep
 *       title="Start dev server"
 *       code={{ lang: 'bash', content: 'npm run dev' }}
 *       outcome="App available at http://localhost:5173"
 *       completed
 *     />
 *   </DocsSteps>
 */
import type { ReactNode } from 'react'
import CodeBlock from './CodeBlock'
import { renderInline } from '@/utils/renderInline'
import styles from './DocsSteps.module.css'

/* ── Individual step data ── */
export interface StepCode {
  /** Language label shown in the code block header */
  lang?: string
  content: string
}

export type StepElement =
  | { type: 'paragraph'; text: string }
  | { type: 'code'; lang?: string; content: string }
  | { type: 'list'; ordered?: boolean; items: string[]; start?: number }

interface StepProps {
  title: ReactNode
  /** Optional prose description (supports inline `code` via children) */
  children?: ReactNode
  /** Optional bullet list items rendered below the description */
  bullets?: string[]
  /** Optional embedded code block */
  code?: StepCode
  /** Short expected-outcome string shown as a green pill */
  outcome?: ReactNode
  /** Renders the number bubble as filled/checked */
  completed?: boolean
  /** Ordered sequence of step elements (paragraphs, code blocks, lists) */
  elements?: StepElement[]
}

/* ── Wrapper ── */
interface StepsProps {
  children: ReactNode
}

/** Container — wraps ordered steps */
export function DocsSteps({ children }: StepsProps) {
  return <ol className={styles.steps}>{children}</ol>
}

/** Individual step */
export function DocsStep({
  title,
  children,
  bullets,
  code,
  outcome,
  completed = false,
  elements,
}: StepProps) {
  const hasElements = Boolean(elements && elements.length > 0)

  return (
    <li className={`${styles.step}${completed ? ` ${styles.completed}` : ''}`}>
      {/* Counter bubble */}
      <span className={styles.number} aria-hidden="true">
        {completed ? (
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2 6 5 9 10 3" />
          </svg>
        ) : null}
      </span>

      {/* Step body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{typeof title === 'string' ? renderInline(title) : title}</h3>

        {hasElements ? (
          elements!.map((el, elIdx) => {
            if (el.type === 'paragraph') {
              return (
                <p key={elIdx} className={styles.description}>
                  {renderInline(el.text, `step-el-${elIdx}`)}
                </p>
              )
            }
            if (el.type === 'code') {
              return (
                <CodeBlock
                  key={elIdx}
                  code={el.content}
                  lang={el.lang ?? 'shell'}
                  className={styles.stepCodeBlock}
                />
              )
            }
            if (el.type === 'list') {
              if (el.ordered) {
                const start = el.start ?? 1
                return (
                  <ol key={elIdx} className={styles.numberedList} start={start}>
                    {el.items.map((item, lIdx) => (
                      <li key={lIdx} className={styles.numberedItem}>
                        <span className={styles.orderNumber}>{start + lIdx}.</span>
                        <span className={styles.bulletText}>
                          {renderInline(item, `step-num-${elIdx}-${lIdx}`)}
                        </span>
                      </li>
                    ))}
                  </ol>
                )
              }
              return (
                <ul key={elIdx} className={styles.bulletList}>
                  {el.items.map((item, lIdx) => (
                    <li key={lIdx} className={styles.bulletItem}>
                      <span className={styles.bulletDot} aria-hidden="true" />
                      <span className={styles.bulletText}>
                        {renderInline(item, `step-bullet-${elIdx}-${lIdx}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              )
            }
            return null
          })
        ) : (
          <>
            {children && <p className={styles.description}>{children}</p>}

            {bullets && bullets.length > 0 && (
              <ul className={styles.bulletList}>
                {bullets.map((item, idx) => (
                  <li key={idx} className={styles.bulletItem}>
                    <span className={styles.bulletDot} aria-hidden="true" />
                    <span className={styles.bulletText}>{renderInline(item, `step-bullet-${idx}`)}</span>
                  </li>
                ))}
              </ul>
            )}

            {code && (
              <CodeBlock
                code={code.content}
                lang={code.lang ?? 'shell'}
                className={styles.stepCodeBlock}
              />
            )}
          </>
        )}

        {outcome && (
          <div className={styles.outcome}>
            <svg
              className={styles.outcomeIcon}
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2 6 5 9 10 3" />
            </svg>
            {typeof outcome === 'string' ? renderInline(outcome) : outcome}
          </div>
        )}
      </div>
    </li>
  )
}
