import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { NavItem } from '../../lib/types'

interface PrevNextNavProps {
  prev?: NavItem
  next?: NavItem
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-2">
      {prev ? (
        <Link
          to={prev.slug}
          className="group flex flex-col gap-1 rounded-lg border border-gray-200 p-4 transition-colors hover:border-bandolf-primary/30 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-400/30 dark:hover:bg-gray-900/50"
        >
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <ArrowLeft className="h-4 w-4" />
            Önceki
          </span>
          <span className="font-medium text-bandolf-primary group-hover:underline dark:text-blue-300">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={next.slug}
          className="group flex flex-col items-end gap-1 rounded-lg border border-gray-200 p-4 text-right transition-colors hover:border-bandolf-primary/30 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-400/30 dark:hover:bg-gray-900/50 sm:col-start-2"
        >
          <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            Sonraki
            <ArrowRight className="h-4 w-4" />
          </span>
          <span className="font-medium text-bandolf-primary group-hover:underline dark:text-blue-300">
            {next.title}
          </span>
        </Link>
      ) : null}
    </div>
  )
}
