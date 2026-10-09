import { useState, type ReactNode } from 'react'
import DeploymentGraphic from './DeploymentGraphic'
import CablesGraphic from './CablesGraphic'
import MultiplayerGraphic from './MultiplayerGraphic'
import SearchPreviewGraphic from './SearchPreviewGraphic'
import styles from './BentoGrid.module.css'

export interface BentoItem {
  title: string
  subtitle: string
  graphic?: ReactNode
}

export interface BentoGridProps {
  id?: string
  title?: ReactNode
  subtitle?: ReactNode
  items?: BentoItem[]
}

const DEFAULT_ITEMS: BentoItem[] = [
  {
    title: 'Playbook',
    subtitle:
      'Documentación con principios y buenas prácticas que te ayudan a entender qué proteger y cómo.',
  },
  {
    title: 'Laboratorios prácticos',
    subtitle: 'Pon a prueba lo aprendido con simulaciones interactivas.',
  },
  {
    title: '100% Open-Source',
    subtitle: 'Todo el software enseñado es gratuito y de código abierto.',
  },
  {
    title: 'Aprendizaje, capa por capa',
    subtitle:
      'Construye tu conocimiento de forma progresiva: Comprende tu entorno, implementa defensas y aprende a responder ante amenazas.',
  },
]

export default function BentoGrid({
  id = 'about',
  title = (
    <>
      Explora lo que
      <br />
      tulip te ofrece
    </>
  ),
  subtitle = (
    <>
      Más que un playbook,
      <br />
      Una forma de entender y construir seguridad.
    </>
  ),
  items = DEFAULT_ITEMS,
}: BentoGridProps) {
  const [cell1Hovered, setCell1Hovered] = useState(false)
  const [cell2Hovered, setCell2Hovered] = useState(false)
  const [cell3Hovered, setCell3Hovered] = useState(false)
  const [cell4Hovered, setCell4Hovered] = useState(false)
  const bentoItems = items.length >= 4 ? items : DEFAULT_ITEMS

  return (
    <section className={styles.bentoSection} id={id}>
      {/* Header and Subheader styled exactly like reference image */}
      <div className={styles.bentoHeader}>
        <h2 className={styles.bentoTitle}>{title}</h2>
        <p className={styles.bentoSubtitle}>{subtitle}</p>
      </div>

      {/* Bento Grid with exact wireframe dividers */}
      <div className={styles.bentoGrid}>
        {/* ── CELL 1: Top-Left (Playbook with search preview magnifier graphic) ── */}
        <div
          className={`${styles.cell} ${styles.cell1}`}
          onMouseEnter={() => setCell1Hovered(true)}
          onMouseLeave={() => setCell1Hovered(false)}
        >
          <div className={styles.cellTextGroup}>
            <h3 className={styles.itemTitle}>{bentoItems[0].title}</h3>
            <p className={styles.itemSubtitle}>{bentoItems[0].subtitle}</p>
          </div>
          <div className={styles.cellGraphic}>
            {bentoItems[0].graphic ?? <SearchPreviewGraphic isExternalHovered={cell1Hovered} />}
          </div>
        </div>

        {/* ── CELL 2: Top-Middle (with multiplayer collaborative cursor graphic) ── */}
        <div
          className={`${styles.cell} ${styles.cell2}`}
          onMouseEnter={() => setCell2Hovered(true)}
          onMouseLeave={() => setCell2Hovered(false)}
        >
          <div className={styles.cellTextGroup}>
            <h3 className={styles.itemTitle}>{bentoItems[1].title}</h3>
            <p className={styles.itemSubtitle}>{bentoItems[1].subtitle}</p>
          </div>
          <div className={styles.cellGraphic}>
            {bentoItems[1].graphic ?? <MultiplayerGraphic isExternalHovered={cell2Hovered} />}
          </div>
        </div>

        {/* ── CELL 3: Bottom-Left (spans columns 1 and 2, with flowing cables graphic) ── */}
        <div
          className={`${styles.cell} ${styles.cell3}`}
          onMouseEnter={() => setCell3Hovered(true)}
          onMouseLeave={() => setCell3Hovered(false)}
        >
          <div className={styles.cellTextGroup}>
            <h3 className={styles.itemTitle}>{bentoItems[2].title}</h3>
            <p className={styles.itemSubtitle}>{bentoItems[2].subtitle}</p>
          </div>
          <div className={styles.cellGraphic}>
            {bentoItems[2].graphic ?? <CablesGraphic isExternalHovered={cell3Hovered} />}
          </div>
        </div>

        {/* ── CELL 4: Right (spans rows 1 and 2 full height, Aprendizaje with 3D isometric layers graphic) ── */}
        <div
          className={`${styles.cell} ${styles.cell4}`}
          onMouseEnter={() => setCell4Hovered(true)}
          onMouseLeave={() => setCell4Hovered(false)}
        >
          <div className={styles.cellTextGroup}>
            <h3 className={styles.itemTitle}>{bentoItems[3].title}</h3>
            <p className={styles.itemSubtitle}>{bentoItems[3].subtitle}</p>
          </div>
          <div className={styles.cellGraphic}>
            {bentoItems[3].graphic ?? <DeploymentGraphic isExternalHovered={cell4Hovered} />}
          </div>
        </div>
      </div>
    </section>
  )
}
