import clsx from 'clsx'
import { ArrowRight, FileText, Hash, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCommandPaletteActions } from '../../lib/markdown'
import { searchDocs } from '../../lib/search'
import type { SearchResult } from '../../lib/types'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const commandPaletteActions = getCommandPaletteActions()

  const docResults = searchDocs(query)
  const showActions = !query.trim()

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const totalItems = showActions ? commandPaletteActions.length : docResults.length

  const navigateToResult = (result: SearchResult) => {
    const path = result.anchor ? `${result.slug}#${result.anchor}` : result.slug
    navigate(path)
    onClose()

    if (result.anchor) {
      setTimeout(() => {
        document.getElementById(result.anchor!)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleSelect = (index: number) => {
    if (showActions) {
      const action = commandPaletteActions[index]
      if ('action' in action && action.action === 'search') {
        inputRef.current?.focus()
        return
      }
      if ('slug' in action && action.slug) {
        navigate(action.slug)
        onClose()
      }
    } else {
      const result = docResults[index]
      if (result) navigateToResult(result)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % totalItems)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + totalItems) % totalItems)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(selectedIndex)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="BANDOLF dokümantasyonunda ara"
        className="relative z-10 w-full max-w-2xl animate-fade-in rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-700">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Başlık, içerik veya anahtar kelime ara..."
            className="search-modal-input w-full border-0 bg-transparent py-4 text-base text-gray-900 shadow-none outline-none placeholder:text-gray-400 focus:outline-none focus-visible:outline-none focus-visible:ring-0 dark:text-gray-100 dark:placeholder:text-gray-500"
            aria-label="Ara"
          />
          <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-[min(28rem,60vh)] overflow-y-auto p-2">
          {showActions ? (
            <ul role="listbox">
              {commandPaletteActions.map((action, index) => (
                <li key={action.label}>
                  <button
                    role="option"
                    aria-selected={selectedIndex === index}
                    onClick={() => handleSelect(index)}
                    className={clsx(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                      selectedIndex === index ? 'bg-bandolf-secondary/40 text-bandolf-primary dark:bg-blue-400/10 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                    )}
                  >
                    <span>{action.label}</span>
                    {'slug' in action && action.slug && <ArrowRight className="h-4 w-4 text-gray-400" />}
                  </button>
                </li>
              ))}
            </ul>
          ) : docResults.length > 0 ? (
            <ul role="listbox" className="space-y-0.5">
              {docResults.map((result: SearchResult, index) => (
                <li key={result.id}>
                  <button
                    role="option"
                    aria-selected={selectedIndex === index}
                    onClick={() => navigateToResult(result)}
                    className={clsx(
                      'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      selectedIndex === index ? 'bg-bandolf-secondary/40 dark:bg-blue-400/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                    )}
                  >
                    {result.resultType === 'heading' ? (
                      <Hash className="mt-0.5 h-4 w-4 shrink-0 text-bandolf-primary/70" />
                    ) : (
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.title}</p>
                        {result.resultType === 'heading' && result.pageTitle && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            Başlık
                          </span>
                        )}
                      </div>
                      {result.resultType === 'heading' && result.pageTitle && (
                        <p className="mt-0.5 text-xs text-bandolf-primary">{result.pageTitle}</p>
                      )}
                      {result.resultType === 'page' && result.category && (
                        <p className="mt-0.5 text-xs text-bandolf-primary">{result.category}</p>
                      )}
                      {result.excerpt && (
                        <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400">
                          {result.excerpt}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">Sonuç bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  )
}
