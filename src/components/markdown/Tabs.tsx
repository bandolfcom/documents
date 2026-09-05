import clsx from 'clsx'
import { useState } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'

interface Tab {
  label: string
  content: string
}

interface TabsProps {
  tabs: Tab[]
}

export function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (tabs.length === 0) return null

  return (
    <div className="my-6">
      <div className="flex gap-0 overflow-x-auto border-b border-gray-200 dark:border-gray-700" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
              activeIndex === index
                ? 'border-bandolf-primary text-bandolf-primary dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4" role="tabpanel">
        <MarkdownRenderer content={tabs[activeIndex].content} />
      </div>
    </div>
  )
}
