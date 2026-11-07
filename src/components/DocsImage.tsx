import React, {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
  type HTMLAttributes,
} from 'react'
import { createPortal } from 'react-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { Maximize02Icon, Cancel01Icon, Image01Icon } from '@hugeicons/core-free-icons'
import styles from './DocsImage.module.css'

export interface DocsImageProps extends HTMLAttributes<HTMLElement> {
  /** Primary URL or path for the image */
  src: string
  /** Fallback URL or local asset path if primary image fails to load */
  fallbackSrc?: string
  /** Accessible alternative text */
  alt?: string
  /** Optional caption or explanatory note displayed beneath the image */
  caption?: ReactNode
  /** Optional window or tab title displayed in a clean top bar */
  title?: string
  /** Border radius preset ('none' | 'sm' | 'md' | 'lg' | 'xl') */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  /** Explicit or maximum width (e.g. '100%', '750px', 800) */
  width?: string | number
  /** Maximum height (e.g. '500px', 600) */
  maxHeight?: string | number
  /** CSS aspect-ratio string (e.g. '16/9', '4/3') */
  aspectRatio?: string
  /** Enable subtle outer border (default: true) */
  border?: boolean
  /** Enable subtle drop shadow (default: true) */
  shadow?: boolean
  /** Allow clicking image to view in enlarged lightbox modal (default: true) */
  zoomable?: boolean
  /** CSS object-fit property (default: 'contain') */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none'
  /** Custom wrapper CSS class name */
  className?: string
  /** Custom inline styles */
  style?: CSSProperties
}

const RADIUS_CLASS_MAP: Record<string, string> = {
  none: styles.radiusNone,
  sm: styles.radiusSm,
  md: styles.radiusMd,
  lg: styles.radiusLg,
  xl: styles.radiusXl,
}

export default function DocsImage({
  src,
  fallbackSrc,
  alt = 'Documentación visual',
  caption,
  title,
  rounded = 'xl',
  width = '100%',
  maxHeight,
  aspectRatio,
  border = true,
  shadow = true,
  zoomable = true,
  objectFit = 'contain',
  className = '',
  style,
  ...rest
}: DocsImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src)
  const [hasFailed, setHasFailed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Sync state if src prop changes
  useEffect(() => {
    setCurrentSrc(src)
    setHasFailed(false)
  }, [src])

  // Handle escape key and lock body scroll when lightbox is open
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleImageError = useCallback(() => {
    // If fallbackSrc exists and hasn't been tried yet, try it
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      return
    }

    // Default fallback check for Wireshark screenshot if remote URL blocked
    if (src.includes('ws-main.png') && currentSrc !== '/images/docs/wireshark-main.png') {
      setCurrentSrc('/images/docs/wireshark-main.png')
      return
    }

    setHasFailed(true)
  }, [currentSrc, fallbackSrc, src])

  const radiusClass = RADIUS_CLASS_MAP[rounded] || styles.radiusXl

  const wrapperClasses = [
    styles.wrapper,
    radiusClass,
    border ? styles.hasBorder : '',
    shadow ? styles.hasShadow : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const imageStyles: CSSProperties = {
    maxWidth: typeof width === 'number' ? `${width}px` : width,
    maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    aspectRatio,
    objectFit,
  }

  // Lightbox element portaled directly to document.body to prevent stacking context overlap
  const lightboxModal =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={styles.lightboxOverlay}
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            {/* Top Navigation Bar with dedicated safe area */}
            <header className={styles.lightboxHeader} onClick={(e) => e.stopPropagation()}>
              <div className={styles.lightboxTitle} title={title || alt}>
                <HugeiconsIcon icon={Image01Icon} size={16} />
                <span>{title || alt}</span>
              </div>
              <div className={styles.lightboxActions}>
                <button
                  type="button"
                  className={`${styles.lightboxBtn} ${styles.lightboxCloseBtn}`}
                  onClick={() => setIsOpen(false)}
                  title="Cerrar vista ampliada (Esc)"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  <span>Cerrar</span>
                </button>
              </div>
            </header>

            {/* Scrollable / centered image canvas */}
            <div className={styles.lightboxBody} onClick={() => setIsOpen(false)}>
              <div className={styles.lightboxImgWrapper} onClick={(e) => e.stopPropagation()}>
                <img
                  src={currentSrc}
                  alt={alt}
                  className={styles.lightboxImg}
                  referrerPolicy="no-referrer"
                />
              </div>

              {caption ? (
                <p className={styles.lightboxCaption} onClick={(e) => e.stopPropagation()}>
                  {caption}
                </p>
              ) : null}
            </div>
          </div>,
          document.body
        )
      : null

  return (
    <>
      <figure className={styles.figure} style={style} {...rest}>
        <div className={wrapperClasses}>
          {/* Optional Title / Window Bar */}
          {title ? (
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.dots} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className={styles.titleText}>{title}</span>
              </div>
            </div>
          ) : null}

          {/* Image Canvas Frame */}
          <div
            className={`${styles.imageFrame} ${zoomable && !hasFailed ? styles.zoomable : ''}`}
            onClick={zoomable && !hasFailed ? () => setIsOpen(true) : undefined}
            role={zoomable && !hasFailed ? 'button' : undefined}
            tabIndex={zoomable && !hasFailed ? 0 : undefined}
            onKeyDown={
              zoomable && !hasFailed
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setIsOpen(true)
                    }
                  }
                : undefined
            }
            aria-label={zoomable && !hasFailed ? `Ampliar imagen: ${alt}` : undefined}
          >
            {hasFailed ? (
              <div className={styles.fallback}>
                <HugeiconsIcon icon={Image01Icon} size={28} />
                <p>No se pudo cargar la imagen.</p>
                <a href={src} target="_blank" rel="noopener noreferrer">
                  {src}
                </a>
              </div>
            ) : (
              <>
                <img
                  className={styles.image}
                  src={currentSrc}
                  alt={alt}
                  style={imageStyles}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />
                {zoomable ? (
                  <span className={styles.zoomBadge} aria-hidden="true">
                    <HugeiconsIcon icon={Maximize02Icon} size={12} />
                    Ampliar
                  </span>
                ) : null}
              </>
            )}
          </div>
        </div>

        {/* Optional Caption */}
        {caption ? (
          <figcaption className={styles.caption}>
            <HugeiconsIcon icon={Image01Icon} size={13} className={styles.captionIcon} />
            <span>{caption}</span>
          </figcaption>
        ) : null}
      </figure>

      {/* Lightbox rendered in document.body */}
      {lightboxModal}
    </>
  )
}
