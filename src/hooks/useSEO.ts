/**
 * useSEO hook — imperative helper for setting page SEO, titles, and metatags.
 */
import { useEffect } from 'react'
import type { SEOProps } from '@/components/SEO'

export type UseSEOResult = void

export function useSEO(props: SEOProps): UseSEOResult {
  const {
    title,
    titleTemplate = '%s | Lilium',
    description = 'Lilium es un playbook interactivo de ciberseguridad enfocado en construir una arquitectura digital segura para tu PyME con prácticas interactivas.',
    keywords = 'ciberseguridad, cybersecurity, pyme, cyber range, playbook ciberseguridad, laboratorios interactivos, nist csf, cis controls, owasp',
    canonical,
    ogType = 'website',
    ogImage = '/og-image.png',
    ogImageAlt = 'Lilium — Security Playbook & Cyber Range para PyMEs',
    twitterCard = 'summary_large_image',
    noIndex = false,
    jsonLd,
  } = props

  useEffect(() => {
    let fullTitle = 'Lilium — Playbook de Ciberseguridad & Cyber Range para PyMEs'
    if (title) {
      if (title.includes('Lilium')) {
        fullTitle = title
      } else {
        fullTitle = titleTemplate.replace('%s', title)
      }
    }
    document.title = fullTitle

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lilium-playbook.com'
    const fullCanonical = canonical || `${origin}${window.location.pathname}`
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${origin}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`

    // Helpers
    const setMeta = (selector: string, attr: string, val: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, val)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[name="keywords"]', 'name', 'keywords', keywords)
    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )

    let canEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canEl) {
      canEl = document.createElement('link')
      canEl.setAttribute('rel', 'canonical')
      document.head.appendChild(canEl)
    }
    canEl.setAttribute('href', fullCanonical)

    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Lilium Playbook')
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', ogType)
    setMeta('meta[property="og:url"]', 'property', 'og:url', fullCanonical)
    setMeta('meta[property="og:image"]', 'property', 'og:image', fullOgImage)
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', ogImageAlt)

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', fullOgImage)

    const jsonLdId = 'lilium-dynamic-jsonld'
    let scriptEl = document.head.querySelector<HTMLScriptElement>(`#${jsonLdId}`)
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.id = jsonLdId
        scriptEl.type = 'application/ld+json'
        document.head.appendChild(scriptEl)
      }
      scriptEl.textContent = JSON.stringify(jsonLd)
    } else if (scriptEl) {
      scriptEl.remove()
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
  ])
}

export default useSEO
