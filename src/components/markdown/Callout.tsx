import clsx from 'clsx'
import { AlertTriangle, Info, Lightbulb, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'

type CalloutType = 'note' | 'tip' | 'warning' | 'danger'

interface CalloutProps {
  type?: CalloutType
  children: ReactNode
}

const calloutConfig: Record<CalloutType, { icon: typeof Info; label: string; className: string }> = {
  note: {
    icon: Info,
    label: 'NOT',
    className: 'border-bandolf-primary/20 bg-bandolf-secondary/30 dark:border-blue-400/20 dark:bg-blue-400/10',
  },
  tip: {
    icon: Lightbulb,
    label: 'İPUCU',
    className: 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
  },
  warning: {
    icon: AlertTriangle,
    label: 'UYARI',
    className: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
  },
  danger: {
    icon: XCircle,
    label: 'TEHLİKE',
    className: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/40',
  },
}

export function Callout({ type = 'note', children }: CalloutProps) {
  const config = calloutConfig[type] ?? calloutConfig.note
  const Icon = config.icon

  return (
    <div
      className={clsx(
        'my-6 rounded-lg border p-4',
        config.className,
      )}
      role="note"
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-bandolf-primary" aria-hidden />
        <span className="text-xs font-semibold tracking-wide text-bandolf-primary">
          {config.label}
        </span>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 [&>p:last-child]:mb-0 [&>p]:mb-2">{children}</div>
    </div>
  )
}
