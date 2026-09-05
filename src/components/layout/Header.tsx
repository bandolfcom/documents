import { ExternalLink, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { GITHUB_REPO } from '../../lib/github'
import { Button } from '../ui/Button'
import { ThemeToggle } from '../ui/ThemeToggle'

interface HeaderProps {
  onSearchOpen: () => void
}

export function Header({ onSearchOpen }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-[#0b0f17]/90">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 lg:px-6">
        <Link to="/docs" className="flex shrink-0 items-center" aria-label="BANDOLF Dokümantasyon">
          <Logo withIcon />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchOpen}
            className="hidden items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-800 sm:flex"
            aria-label="Dokümantasyonda ara"
          >
            <Search className="h-4 w-4" />
            <span>Dokümantasyonda ara...</span>
            <kbd className="ml-4 hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500 lg:inline">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onSearchOpen}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 sm:hidden"
            aria-label="Ara"
          >
            <Search className="h-5 w-5" />
          </button>

          <a
            href="https://app.bandolf.com/user/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-bandolf-primary dark:text-gray-300 dark:hover:text-blue-300 sm:flex"
          >
            Panel
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white md:flex"
            aria-label="GitHub"
          >
            GitHub
          </a>

          <ThemeToggle />

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
            aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-[#0b0f17] md:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              GitHub
            </a>
            <a
              href="https://app.bandolf.com/user/login"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Panel
            </a>
          </div>
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => { setMobileOpen(false); onSearchOpen() }} className="w-full">
              <Search className="h-4 w-4" />
              Dokümantasyonda ara
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
