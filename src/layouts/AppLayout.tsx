/**
 * AppLayout — wraps every page with the shared shell:
 * top navigation + main content area.
 * Add persistent UI (sidebar, footer, breadcrumbs) here.
 */
import { Outlet } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import styles from './AppLayout.module.css'

export default function AppLayout() {
  return (
    <div className={styles.shell}>
      <NavBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
