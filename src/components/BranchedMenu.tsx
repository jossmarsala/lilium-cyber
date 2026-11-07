'use client'

import React, {
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import LiliumIcon from './LiliumIcon'
import './BranchedMenu.css'

export interface BranchedMenuChild {
  value: string
  label: string
  icon?: ReactNode | IconSvgElement
  redirectTo?: string
  children?: BranchedMenuChild[]
}

export interface BranchedMenuItem {
  label: string
  value?: string
  redirectTo?: string
  icon?: ReactNode | IconSvgElement
  children?: BranchedMenuChild[]
}

export interface BranchedMenuProps {
  items?: BranchedMenuItem[]
  defaultOpen?: number | number[]
  defaultActive?: string
  active?: string
  onSelect?: (value: string, item: BranchedMenuChild | BranchedMenuItem) => void
  onToggle?: (index: number, open: boolean) => void
  color?: string
  accentColor?: string
  lineColor?: string
  width?: number | string
  rowHeight?: number
  indent?: number
  trunk?: number
  radius?: number
  lineWidth?: number
  fontSize?: number
  drawDuration?: number
  foldDuration?: number
  className?: string
}

const PAD = 6
const MARK = 16

const renderIcon = (icon: ReactNode | IconSvgElement, size = 16) => {
  if (isValidElement(icon)) return icon
  if (icon) {
    return <HugeiconsIcon icon={icon as IconSvgElement} size={size} strokeWidth={1.8} />
  }
  return <LiliumIcon size={size} />
}

const toSet = (open: number | number[]) =>
  new Set(Array.isArray(open) ? open : open >= 0 ? [open] : [])

const BranchedMenu: React.FC<BranchedMenuProps> = ({
  items = [],
  defaultOpen = 0,
  defaultActive = '',
  active: activeProp,
  onSelect,
  onToggle,
  color = '#f5f5f5',
  accentColor = '#f5f5f5',
  lineColor = '#3f3f46',
  width = 240,
  rowHeight = 36,
  indent = 40,
  trunk = 14,
  radius = 10,
  lineWidth = 1.5,
  fontSize = 14,
  drawDuration = 400,
  foldDuration = 300,
  className = '',
}) => {
  const [open, setOpen] = useState<Set<number>>(() => toSet(defaultOpen))
  const [internalActive, setInternalActive] = useState(() => {
    if (activeProp !== undefined) return activeProp
    if (defaultActive) return defaultActive
    const first = items.find((it, i) => it.children && toSet(defaultOpen).has(i))
    return first?.children?.[0]?.value ?? ''
  })

  const active = activeProp !== undefined ? activeProp : internalActive

  // Track user overrides for expanded subsections with children
  const [userToggledSubs, setUserToggledSubs] = useState<Record<string, boolean>>({})

  const isKidSubOpen = (kid: BranchedMenuChild) => {
    if (userToggledSubs[kid.value] !== undefined) {
      return userToggledSubs[kid.value]
    }
    return Boolean(
      kid.value === active ||
      kid.children?.some((c) => c.value === active) ||
      kid.value === defaultActive ||
      kid.children?.some((c) => c.value === defaultActive)
    )
  }

  const toggleSub = (val: string, currentOpen: boolean) => {
    setUserToggledSubs((prev) => ({
      ...prev,
      [val]: !currentOpen,
    }))
  }

  // Sync internal active if defaultActive or activeProp changes in uncontrolled usage
  useEffect(() => {
    if (activeProp === undefined && defaultActive) {
      setInternalActive(defaultActive)
    }
  }, [activeProp, defaultActive])

  const navRef = useRef<HTMLElement>(null)
  const heads = useRef<(HTMLButtonElement | null)[]>([])
  const markerRef = useRef<HTMLSpanElement>(null)
  const latest = useRef<{
    onSelect?: BranchedMenuProps['onSelect']
    onToggle?: BranchedMenuProps['onToggle']
  }>({})

  useLayoutEffect(() => {
    latest.current = { onSelect, onToggle }
  })

  const isItemActive = (it: BranchedMenuItem) => {
    if (it.value === active) return true
    return it.children?.some((kid) => {
      if (kid.value === active) return true
      return kid.children?.some((subKid) => subKid.value === active)
    })
  }

  const activeSection = items.findIndex(isItemActive)
  const markerShown =
    activeSection >= 0 && (open.has(activeSection) || items[activeSection]?.value === active)

  // Automatically ensure the active section is open when activeSection changes
  useEffect(() => {
    if (activeSection >= 0) {
      setOpen((prev) => {
        if (prev.has(activeSection)) return prev
        const next = new Set(prev)
        next.add(activeSection)
        return next
      })
    }
  }, [activeSection])

  // Gently scroll active element into view if not visible
  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => {
      const activeEl = navRef.current?.querySelector('[data-active]') as HTMLElement | null
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }, 60)
    return () => clearTimeout(timer)
  }, [active])

  useLayoutEffect(() => {
    const place = (glide: boolean) => {
      const m = markerRef.current
      const el = heads.current[activeSection]
      if (!m) return
      const on = markerShown && el
      if (!glide) m.style.transition = 'none'
      if (on) m.style.top = `${el.offsetTop + (el.offsetHeight - MARK) / 2}px`
      m.toggleAttribute('data-on', Boolean(on))
      if (!glide) {
        void m.offsetHeight
        m.style.transition = ''
      }
    }
    place(true)
    let first = true
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false
        return
      }
      place(false)
    })
    if (navRef.current) ro.observe(navRef.current)
    return () => ro.disconnect()
  }, [activeSection, markerShown, items, fontSize, rowHeight, open, userToggledSubs])

  const select = (value: string, item: BranchedMenuChild | BranchedMenuItem) => {
    if (activeProp === undefined) {
      setInternalActive(value)
    }
    latest.current.onSelect?.(value, item)
  }

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      const isOpen = !next.has(i)
      if (isOpen) next.add(i)
      else next.delete(i)
      latest.current.onToggle?.(i, isOpen)
      return next
    })
  }

  const r = Math.min(radius, rowHeight / 2 - 2)
  const endX = indent - 8
  const subRowHeight = Math.max(26, rowHeight - 6)
  const subTrunk = trunk + 12
  const subR = Math.max(4, Math.min(6, subRowHeight / 2 - 2))
  const subEndX = indent + 6

  return (
    <nav
      ref={navRef}
      className={`branched-menu${className ? ` ${className}` : ''}`}
      style={
        {
          '--bm-w': typeof width === 'number' ? `${width}px` : width || '100%',
          '--bm-ink': color,
          '--bm-accent': accentColor,
          '--bm-line': lineColor,
          '--bm-font': `${fontSize}px`,
          '--bm-row': `${rowHeight}px`,
          '--bm-indent': `${indent}px`,
          '--bm-line-w': lineWidth,
          '--bm-draw': `${drawDuration}ms`,
          '--bm-fold': `${foldDuration}ms`,
        } as CSSProperties
      }
    >
      <span ref={markerRef} className="branched-menu__marker" aria-hidden="true" />
      {items.map((item, i) => {
        const kids = item.children
        const isOpen = kids ? open.has(i) : false
        const leafValue = item.value ?? item.label
        const isHeadActive = !kids
          ? leafValue === active
          : item.value
            ? item.value === active
            : false

        // Compute dynamic vertical metrics based on expanded subsections
        const kidHeights = kids
          ? kids.map((kid) => {
              const isSubOpen = isKidSubOpen(kid)
              const subCount = kid.children?.length ?? 0
              const subH = isSubOpen && subCount > 0 ? subCount * subRowHeight + 6 : 0
              return rowHeight + subH
            })
          : []

        const getKidCenterY = (k: number) => {
          let y = PAD
          for (let j = 0; j < k; j++) {
            y += kidHeights[j]
          }
          return y + rowHeight / 2
        }

        const bodyH = kids ? PAD * 2 + kidHeights.reduce((sum, h) => sum + h, 0) : 0

        const branch = (k: number) => {
          const y = getKidCenterY(k)
          return `M ${trunk} ${y - r} A ${r} ${r} 0 0 0 ${trunk + r} ${y} H ${endX}`
        }

        const reach = (k: number) => {
          const y = getKidCenterY(k)
          return `M ${trunk} 0 V ${y - r} A ${r} ${r} 0 0 0 ${trunk + r} ${y} H ${endX}`
        }

        const length = (k: number) => {
          const y = getKidCenterY(k)
          return y - r + (Math.PI * r) / 2 + (endX - trunk - r)
        }

        return (
          <div
            key={item.value ?? item.label}
            className="branched-menu__section"
            data-open={isOpen ? '' : undefined}
          >
            <button
              ref={(el) => {
                heads.current[i] = el
              }}
              type="button"
              className="branched-menu__head"
              aria-expanded={kids ? isOpen : undefined}
              aria-current={isHeadActive ? 'true' : undefined}
              data-active={isHeadActive ? '' : undefined}
              onClick={() => {
                if (kids) {
                  const target = item.redirectTo ?? item.value
                  if (target) {
                    select(target, item)
                  }
                  if (isHeadActive) {
                    toggle(i)
                  } else if (!isOpen) {
                    toggle(i)
                  }
                } else {
                  select(leafValue, item)
                }
              }}
              title={item.label}
            >
              {item.label}
            </button>
            {kids ? (
              <div className="branched-menu__body">
                <div className="branched-menu__fold">
                  <div className="branched-menu__tree" style={{ height: bodyH }}>
                    <svg
                      className="branched-menu__lines"
                      width={indent}
                      height={bodyH}
                      aria-hidden="true"
                    >
                      <path
                        className="branched-menu__base"
                        d={`M ${trunk} 0 V ${getKidCenterY(kids.length - 1) - r}`}
                      />
                      {kids.map((kid, k) => (
                        <path key={kid.value} className="branched-menu__base" d={branch(k)} />
                      ))}
                      {kids.map((kid, k) => {
                        const isKidActiveOrDescendant =
                          kid.value === active || kid.children?.some((c) => c.value === active)

                        return (
                          <path
                            key={kid.value}
                            className="branched-menu__reach"
                            d={reach(k)}
                            style={{
                              strokeDasharray: length(k),
                              strokeDashoffset: isKidActiveOrDescendant ? 0 : length(k),
                            }}
                          />
                        )
                      })}
                    </svg>
                    {kids.map((kid) => {
                      const hasSubKids = Boolean(kid.children && kid.children.length > 0)
                      const isSubOpen = isKidSubOpen(kid)
                      const subKids = kid.children ?? []
                      const subHeight =
                        isSubOpen && hasSubKids ? subKids.length * subRowHeight + 6 : 0
                      const isKidDirectActive = kid.value === active
                      const isKidParentOfActive = Boolean(
                        hasSubKids && subKids.some((c) => c.value === active)
                      )

                      const subRowY = (sk: number) => 3 + sk * subRowHeight + subRowHeight / 2
                      const subBranch = (sk: number) =>
                        `M ${subTrunk} ${subRowY(sk) - subR} A ${subR} ${subR} 0 0 0 ${subTrunk + subR} ${subRowY(sk)} H ${subEndX}`
                      const subReach = (sk: number) =>
                        `M ${subTrunk} 0 V ${subRowY(sk) - subR} A ${subR} ${subR} 0 0 0 ${subTrunk + subR} ${subRowY(sk)} H ${subEndX}`
                      const subLength = (sk: number) =>
                        subRowY(sk) - subR + (Math.PI * subR) / 2 + (subEndX - subTrunk - subR)

                      return (
                        <div key={kid.value} className="branched-menu__item-wrapper">
                          <button
                            type="button"
                            className="branched-menu__item"
                            aria-current={isKidDirectActive ? 'true' : undefined}
                            data-active={isKidDirectActive ? '' : undefined}
                            data-parent-active={isKidParentOfActive ? '' : undefined}
                            tabIndex={isOpen ? 0 : -1}
                            onClick={() => {
                              select(kid.value, kid)
                              if (hasSubKids) {
                                toggleSub(kid.value, isSubOpen)
                              }
                            }}
                            title={kid.label}
                          >
                            {kid.icon ? (
                              <span className="branched-menu__icon" aria-hidden="true">
                                {renderIcon(kid.icon)}
                              </span>
                            ) : null}
                            <span className="branched-menu__label">{kid.label}</span>
                            {hasSubKids && (
                              <span
                                className="branched-menu__chevron"
                                data-open={isSubOpen ? '' : undefined}
                                aria-label={
                                  isSubOpen ? 'Contraer subíndices' : 'Desplegar subíndices'
                                }
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSub(kid.value, isSubOpen)
                                }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </span>
                            )}
                          </button>

                          {hasSubKids && (
                            <div
                              className="branched-menu__sub-body"
                              data-open={isSubOpen ? '' : undefined}
                            >
                              <div className="branched-menu__sub-fold">
                                <div
                                  className="branched-menu__sub-tree"
                                  style={{ height: subHeight }}
                                >
                                  <svg
                                    className="branched-menu__sub-lines"
                                    width={subEndX}
                                    height={subHeight}
                                    aria-hidden="true"
                                  >
                                    <path
                                      className="branched-menu__base"
                                      d={`M ${subTrunk} 0 V ${subRowY(subKids.length - 1) - subR}`}
                                    />
                                    {subKids.map((subKid, sk) => (
                                      <path
                                        key={subKid.value}
                                        className="branched-menu__base"
                                        d={subBranch(sk)}
                                      />
                                    ))}
                                    {subKids.map((subKid, sk) => (
                                      <path
                                        key={subKid.value}
                                        className="branched-menu__reach"
                                        d={subReach(sk)}
                                        style={{
                                          strokeDasharray: subLength(sk),
                                          strokeDashoffset:
                                            subKid.value === active ? 0 : subLength(sk),
                                        }}
                                      />
                                    ))}
                                  </svg>

                                  {subKids.map((subKid) => (
                                    <button
                                      key={subKid.value}
                                      type="button"
                                      className="branched-menu__sub-item"
                                      aria-current={subKid.value === active ? 'true' : undefined}
                                      data-active={subKid.value === active ? '' : undefined}
                                      style={{
                                        height: subRowHeight,
                                        paddingLeft: subEndX + 8,
                                      }}
                                      tabIndex={isOpen && isSubOpen ? 0 : -1}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        select(subKid.value, subKid)
                                      }}
                                      title={subKid.label}
                                    >
                                      {subKid.icon ? (
                                        <span
                                          className="branched-menu__sub-icon"
                                          aria-hidden="true"
                                        >
                                          {renderIcon(subKid.icon, 13)}
                                        </span>
                                      ) : null}
                                      <span className="branched-menu__sub-label">
                                        {subKid.label}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

export default BranchedMenu
