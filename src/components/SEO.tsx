/**
 * SEO.tsx — Dynamic SEO, Metatags, Open Graph, and Structured Data management.
 *
 * Updates document.title, meta tags, Open Graph, Twitter Cards, canonical links,
 * and JSON-LD structured data for Single Page Application navigation in React.
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export interface SEOProps {
  /** Page specific title. If provided, formatted as `${title} | Lilium` (unless it already contains 'Lilium'). */
  title?: string
  /** Custom title template, defaults to '%s | Lilium' */
  titleTemplate?: string
  /** Overrides description tag and social cards */
  description?: string
  /** Comma-separated SEO keywords */
  keywords?: string
  /** Canonical URL. Defaults to current path */
  canonical?: string
  /** Open Graph type, e.g. 'website' or 'article' */
  ogType?: 'website' | 'article' | 'book'
  /** Social card image URL */
  ogImage?: string
  /** Alt text for social card image */
  ogImageAlt?: string
  /** Twitter card style */
  twitterCard?: 'summary' | 'summary_large_image'
  /** Prevent search engines from indexing this page */
  noIndex?: boolean
  /** Schema.org structured data object or array */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

const DEFAULT_TITLE = 'Lilium — Playbook de Ciberseguridad & Cyber Range para PyMEs'
const DEFAULT_DESCRIPTION =
  'Lilium es un playbook interactivo de ciberseguridad enfocado en construir una arquitectura digital segura para tu PyME con prácticas interactivas y laboratorios en el navegador.'
const DEFAULT_KEYWORDS =
  'ciberseguridad, cybersecurity, pyme, cyber range, playbook ciberseguridad, laboratorios interactivos, nist csf, cis controls, owasp, mitre attack, zero trust, simulador linux, lilium'
const DEFAULT_OG_IMAGE = '/og-image.png'
const DEFAULT_OG_IMAGE_ALT = 'Lilium — Security Playbook & Cyber Range para PyMEs'
const SITE_NAME = 'Lilium Playbook'

function setOrCreateMeta(selector: string, attributeName: string, attributeValue: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attributeName, attributeValue)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setOrCreateLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export default function SEO({
  title,
  titleTemplate = '%s | Lilium',
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
  twitterCard = 'summary_large_image',
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const location = useLocation()

  useEffect(() => {
    // 1. Calculate dynamic title
    let fullTitle = DEFAULT_TITLE
    if (title) {
      if (title.includes('Lilium')) {
        fullTitle = title
      } else {
        fullTitle = titleTemplate.replace('%s', title)
      }
    }
    document.title = fullTitle

    // 2. Canonical URL calculation
    const currentOrigin =
      typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://lilium-playbook.com'
    const fullCanonical = canonical || `${currentOrigin}${location.pathname}`

    // 3. Resolve absolute image URL for OG
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${currentOrigin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`

    // 4. Standard Metatags
    setOrCreateMeta('meta[name="description"]', 'name', 'description', description)
    setOrCreateMeta('meta[name="keywords"]', 'name', 'keywords', keywords)
    setOrCreateMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )

    // 5. Canonical link
    setOrCreateLink('canonical', fullCanonical)

    // 6. Open Graph
    setOrCreateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME)
    setOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setOrCreateMeta('meta[property="og:type"]', 'property', 'og:type', ogType)
    setOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', fullCanonical)
    setOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', fullOgImage)
    setOrCreateMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', ogImageAlt)
    setOrCreateMeta('meta[property="og:locale"]', 'property', 'og:locale', 'es_LA')

    // 7. Twitter Card
    setOrCreateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard)
    setOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', fullOgImage)
    setOrCreateMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', ogImageAlt)

    // 8. JSON-LD structured data
    const jsonLdId = 'lilium-dynamic-jsonld'
    let scriptElement = document.head.querySelector<HTMLScriptElement>(`#${jsonLdId}`)

    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script')
        scriptElement.id = jsonLdId
        scriptElement.type = 'application/ld+json'
        document.head.appendChild(scriptElement)
      }
      scriptElement.textContent = JSON.stringify(jsonLd)
    } else if (scriptElement) {
      scriptElement.remove()
    }

    return () => {
      // Optional cleanup on route transition
    }
  }, [
    title,
    titleTemplate,
    description,
    keywords,
    canonical,
    ogType,
    ogImage,
    ogImageAlt,
    twitterCard,
    noIndex,
    jsonLd,
    location.pathname,
  ])

  return null
}
