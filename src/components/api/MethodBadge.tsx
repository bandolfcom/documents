import clsx from 'clsx'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  POST: 'bg-blue-50 text-blue-700 border-blue-200',
  PUT: 'bg-amber-50 text-amber-700 border-amber-200',
  PATCH: 'bg-orange-50 text-orange-700 border-orange-200',
  DELETE: 'bg-red-50 text-red-700 border-red-200',
}

interface MethodBadgeProps {
  method: HttpMethod
  className?: string
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wide border',
        methodColors[method],
        className,
      )}
    >
      {method}
    </span>
  )
}
