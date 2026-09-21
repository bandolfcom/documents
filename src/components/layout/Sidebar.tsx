import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getNavSections } from '../../lib/markdown'
import type { NavSection } from '../../lib/types'

interface SidebarProps {
  onNavigate?: () => void
}

const GROUP_LABELS: Record<string, string> = {
  start: 'Başlangıç',
  guides: 'Rehberler',
  api: 'API Referansı',
  reference: 'Referans',
}

function groupSections(sections: NavSection[]): Array<{ label?: string; sections: NavSection[] }> {
  const groups: Array<{ label?: string; sections: NavSection[] }> = []
  let currentGroup: string | undefined

  for (const section of sections) {
    const group = section.group ?? 'other'
    if (group !== currentGroup) {
      currentGroup = group
      groups.push({
        label: GROUP_LABELS[group],
        sections: [section],
      })
    } else {
      groups[groups.length - 1].sections.push(section)
    }
  }

  return groups
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname
  const navSections = getNavSections()
  const groupedSections = useMemo(() => groupSections(navSections), [navSections])

  const activeSectionTitle = useMemo(
    () => navSections.find((section) => section.items.some((item) => item.slug === currentPath))?.title,
    [navSections, currentPath],
  )

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navSections.forEach((section) => {
      const isActive = section.items.some((item) => item.slug === currentPath)
      const isGettingStarted = section.group === 'start'
      initial[section.title] = isActive || isGettingStarted
    })
    return initial
  })

  useEffect(() => {
    if (!activeSectionTitle) return
    setOpenSections((prev) => ({ ...prev, [activeSectionTitle]: true }))
  }, [activeSectionTitle])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <aside className="sidebar h-full overflow-y-auto pb-5 pt-4 lg:pt-5">
      <nav aria-label="Dokümantasyon navigasyonu" className="space-y-5">
        {groupedSections.map((group, groupIndex) => (
          <div key={group.label ?? `group-${groupIndex}`}>
            {group.label && group.sections.length > 1 && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.sections.map((section) => {
                const isOpen = openSections[section.title] ?? false

                return (
                  <section key={section.title}>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.title)}
                      className="group flex w-full items-center gap-1 rounded-md px-3 py-1.5 text-left transition-colors hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                      aria-expanded={isOpen}
                    >
                      <ChevronRight
                        className={clsx(
                          'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
                          isOpen && 'rotate-90',
                        )}
                      />
                      <span className="text-[13px] font-semibold leading-snug text-gray-800 dark:text-gray-200">
                        {section.title}
                      </span>
                    </button>

                    <div
                      className={clsx(
                        'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <ul className="mt-0.5 overflow-hidden pl-[30px] pr-2">
                        {section.items.map((item) => {
                          const isActive = currentPath === item.slug

                          return (
                            <li key={item.slug}>
                              <Link
                                to={item.slug}
                                onClick={onNavigate}
                                className={clsx(
                                  'sidebar-link block rounded-md border-l-2 py-1.5 pl-3 pr-2 text-[13px] leading-snug transition-colors',
                                  isActive
                                    ? 'sidebar-link-active border-bandolf-primary bg-bandolf-primary/[0.07] font-medium text-bandolf-primary dark:border-blue-400 dark:bg-blue-400/10 dark:text-blue-300'
                                    : 'border-transparent text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-100',
                                )}
                                aria-current={isActive ? 'page' : undefined}
                              >
                                <span className="block truncate">{item.title}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
