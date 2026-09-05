import { useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface DocsLayoutProps {
  children: ReactNode
  toc?: ReactNode
  onSearchOpen: () => void
}

export function DocsLayout({ children, toc, onSearchOpen }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0b0f17]">
      <Header onSearchOpen={onSearchOpen} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-gray-200 bg-white pt-14 transition-transform duration-200 dark:border-gray-800 dark:bg-[#0b0f17] lg:static lg:z-auto lg:w-[280px] lg:shrink-0 lg:translate-x-0 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-3 rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Kenar çubuğunu kapat"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="h-full overflow-y-auto">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>

        <main className="min-w-0 flex-1">
          <div className="flex">
            <div className="min-w-0 flex-1 px-4 py-8 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="mb-4 flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
                aria-label="Navigasyonu aç"
              >
                <Menu className="h-4 w-4" />
                Navigasyon
              </button>
              {children}
            </div>

            {toc && (
              <aside className="hidden w-56 shrink-0 py-8 pr-6 xl:block">
                <div className="sticky top-20">{toc}</div>
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
