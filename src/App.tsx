import { Navigate, Route, Routes } from 'react-router-dom'
import { DocsLayout } from './components/layout/DocsLayout'
import { SearchModal } from './components/search/SearchModal'
import { useSearchModal } from './hooks/useSearchModal'
import { DocPage, DocPageToc } from './pages/DocPage'
import { DocsLanding } from './pages/DocsLanding'
import { NotFound } from './pages/NotFound'

function DocsShell({
  children,
  showToc = true,
  onSearchOpen,
}: {
  children: React.ReactNode
  showToc?: boolean
  onSearchOpen: () => void
}) {
  return (
    <DocsLayout onSearchOpen={onSearchOpen} toc={showToc ? <DocPageToc /> : undefined}>
      {children}
    </DocsLayout>
  )
}

export default function App() {
  const { open, openSearch, closeSearch } = useSearchModal()

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/docs" replace />} />
        <Route
          path="/docs"
          element={
            <DocsShell onSearchOpen={openSearch} showToc={false}>
              <DocsLanding onSearchOpen={openSearch} />
            </DocsShell>
          }
        />
        <Route
          path="/docs/*"
          element={
            <DocsShell onSearchOpen={openSearch}>
              <DocPage />
            </DocsShell>
          }
        />
        <Route
          path="/status"
          element={
            <DocsShell onSearchOpen={openSearch} showToc={false}>
              <DocPage />
            </DocsShell>
          }
        />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SearchModal open={open} onClose={closeSearch} />
    </>
  )
}
