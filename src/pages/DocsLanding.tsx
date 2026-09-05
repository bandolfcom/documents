import { ArrowRight, Code, CreditCard, Route, Rocket, Shield, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDocsCategories } from '../lib/markdown'
import { usePageMeta } from '../hooks/usePageMeta'

const iconMap: Record<string, typeof Rocket> = {
  'Başlangıç': Rocket,
  'Ödemeler': CreditCard,
  'Akıllı Yönlendirme': Route,
  'Dolandırıcılık': Shield,
  'API': Code,
}

interface DocsLandingProps {
  onSearchOpen: () => void
}

export function DocsLanding({ onSearchOpen }: DocsLandingProps) {
  usePageMeta(
    'BANDOLF Dokümantasyon',
    'BANDOLF ile ödeme altyapınızı kurun, entegre edin ve yönetin.',
  )

  const docsCategories = getDocsCategories()

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-bandolf-primary dark:text-indigo-300 sm:text-4xl">
          BANDOLF Dokümantasyon
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          BANDOLF ile ödeme altyapınızı kurun, entegre edin ve yönetin.
        </p>
      </div>

      <button
        onClick={onSearchOpen}
        className="mb-12 flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-left text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-900"
      >
        <Search className="h-5 w-5" />
        <span>Dokümantasyonda ara...</span>
        <kbd className="ml-auto hidden rounded border border-gray-200 bg-white px-2 py-0.5 font-mono text-xs dark:border-gray-700 dark:bg-gray-800 sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        {docsCategories.map((category) => {
          const Icon = iconMap[category.title] ?? Rocket
          return (
            <Link
              key={category.slug}
              to={category.slug}
              className="group rounded-lg border border-gray-200 p-6 transition-colors hover:border-bandolf-primary/30 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-blue-400/30 dark:hover:bg-gray-900/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-5 w-5 text-bandolf-primary dark:text-blue-300" />
                <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-bandolf-primary dark:group-hover:text-blue-300" />
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{category.title}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
