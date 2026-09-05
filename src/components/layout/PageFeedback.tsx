import { ExternalLink, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { getGitHubEditUrl, GITHUB_ISSUES } from '../../lib/github'
import { getDocBySlug } from '../../lib/markdown'

interface PageFeedbackProps {
  slug: string
}

export function PageFeedback({ slug }: PageFeedbackProps) {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null)
  const doc = getDocBySlug(slug)
  const editUrl = doc ? getGitHubEditUrl(doc.file) : undefined

  return (
    <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
        <p className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">Bu sayfa yardımcı oldu mu?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setFeedback('yes')}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
              feedback === 'yes'
                ? 'border-bandolf-primary bg-bandolf-secondary/40 text-bandolf-primary dark:border-blue-400 dark:bg-blue-400/10 dark:text-blue-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            Evet
          </button>
          <button
            onClick={() => setFeedback('no')}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
              feedback === 'no'
                ? 'border-bandolf-primary bg-bandolf-secondary/40 text-bandolf-primary dark:border-blue-400 dark:bg-blue-400/10 dark:text-blue-300'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            Hayır
          </button>
        </div>
        {feedback && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Geri bildiriminiz için teşekkürler.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {editUrl && (
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-bandolf-primary hover:underline dark:text-blue-300"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Bu sayfayı düzenle
          </a>
        )}
        <a
          href={GITHUB_ISSUES}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-bandolf-primary hover:underline dark:text-blue-300"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Sorun bildir
        </a>
      </div>
    </div>
  )
}
