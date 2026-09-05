import { useEffect, useState } from 'react'

export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpen()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onOpen])
}

export function useSearchModal() {
  const [open, setOpen] = useState(false)

  useSearchShortcut(() => setOpen(true))

  return {
    open,
    openSearch: () => setOpen(true),
    closeSearch: () => setOpen(false),
  }
}
