/**
 * scripts/generate-seo.mjs
 * Generates public/sitemap.xml from project routes and documentation data.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const BASE_URL = 'https://lilium-playbook.com'
const TODAY = new Date().toISOString().split('T')[0]

// 1. Static Core Routes
const routes = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/labs', changefreq: 'weekly', priority: '0.9' },
]

// 2. Parse Labs Data
try {
  const labsContent = fs.readFileSync(path.resolve(rootDir, 'src/data/labsData.ts'), 'utf-8')
  const idMatches = [...labsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map((m) => m[1])
  idMatches.forEach((labId) => {
    routes.push({
      url: `/lab/${labId}`,
      changefreq: 'monthly',
      priority: '0.8',
    })
  })
} catch (err) {
  console.warn('[generate-seo] Could not read labsData.ts:', err.message)
}

// 3. Parse Docs Data
try {
  const docsRaw = fs.readFileSync(path.resolve(rootDir, 'src/data/docs.json'), 'utf-8')
  const docs = JSON.parse(docsRaw)
  docs.forEach((section) => {
    routes.push({
      url: `/docs/${section.id}`,
      changefreq: 'monthly',
      priority: '0.8',
    })
    if (Array.isArray(section.subsections)) {
      section.subsections.forEach((sub) => {
        routes.push({
          url: `/docs/${section.id}/${sub.id}`,
          changefreq: 'monthly',
          priority: '0.8',
        })
      })
    }
  })
} catch (err) {
  console.warn('[generate-seo] Could not read docs.json:', err.message)
}

// Build XML
const xmlEntries = routes
  .map((route) => {
    return `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  })
  .join('\n')

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`

const sitemapPath = path.resolve(rootDir, 'public/sitemap.xml')
fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8')
console.log(`[generate-seo] Successfully generated ${sitemapPath} with ${routes.length} URLs.`)
