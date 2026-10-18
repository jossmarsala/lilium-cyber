/**
 * Application-wide router.
 * Add new top-level routes here; feature routes live in their own route files.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import HomePage from '@/pages/HomePage'
import DocsPage from '@/pages/DocsPage'
import LabsPage from '@/pages/LabsPage'
import DesktopPage from '@/pages/desktop/DesktopPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Fullscreen React UI OS Desktop environment */}
        <Route path="desktop" element={<DesktopPage />} />
        <Route path="os" element={<DesktopPage />} />

        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="labs" element={<LabsPage />} />
          <Route path="docs" element={<DocsPage />}>
            {/* Nested: /docs/:sectionId/:subSectionId? */}
            <Route path=":sectionId" element={<DocsPage />} />
            <Route path=":sectionId/:subSectionId" element={<DocsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
