/** 404 catch-all page */
import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <SEO
        title="404 — Página no encontrada"
        description="La página que buscas no existe o ha sido movida."
        noIndex={true}
      />
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Página no encontrada.</p>
      <Link to="/" className={styles.link}>
        ← Volver al Inicio
      </Link>
    </div>
  )
}
