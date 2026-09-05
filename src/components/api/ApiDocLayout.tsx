import clsx from 'clsx'
import { useState } from 'react'
import { CopyButton } from '../ui/CopyButton'
import { MethodBadge } from './MethodBadge'

interface ApiDocLayoutProps {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  endpoint: string
  description?: string
  children: React.ReactNode
}

export function ApiDocLayout({ method, endpoint, description, children }: ApiDocLayoutProps) {
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox')

  const baseUrl =
    environment === 'sandbox'
      ? 'https://sandbox-api.bandolf.com'
      : 'https://api.bandolf.com'

  const fullUrl = `${baseUrl}${endpoint}`

  return (
    <div>
      <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <MethodBadge method={method} />
          <code className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">{endpoint}</code>
          <CopyButton text={fullUrl} label="URL Kopyala" />
        </div>
        {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}

        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Ortam:</span>
          <div className="inline-flex rounded-md border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-900">
            {(['sandbox', 'production'] as const).map((env) => (
              <button
                key={env}
                onClick={() => setEnvironment(env)}
                className={clsx(
                  'rounded px-3 py-1 text-sm font-medium capitalize transition-colors',
                  environment === env
                    ? 'bg-bandolf-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
                )}
              >
                {env === 'sandbox' ? 'Sandbox' : 'Canlı'}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 font-mono text-sm text-gray-500 dark:text-gray-400">
          Temel URL: <span className="text-bandolf-primary">{baseUrl}</span>
        </p>
      </div>
      {children}
    </div>
  )
}
