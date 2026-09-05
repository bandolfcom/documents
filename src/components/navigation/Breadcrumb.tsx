import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400" aria-hidden />}
            {item.href ? (
              <Link
                to={item.href}
                className={clsx(
                  'hover:text-bandolf-primary transition-colors',
                  index === items.length - 1 && 'text-gray-900 font-medium dark:text-gray-100',
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium dark:text-gray-100">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
