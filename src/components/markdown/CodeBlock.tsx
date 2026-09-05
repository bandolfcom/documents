import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const bundledLangs = [
  'javascript', 'typescript', 'php', 'python', 'java', 'csharp', 'go', 'json', 'bash', 'html', 'shell',
] as const

let highlighterPromise: Promise<HighlighterCore> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import('shiki/themes/github-dark.mjs')],
      langs: [
        import('shiki/langs/javascript.mjs'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/langs/php.mjs'),
        import('shiki/langs/python.mjs'),
        import('shiki/langs/java.mjs'),
        import('shiki/langs/csharp.mjs'),
        import('shiki/langs/go.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/bash.mjs'),
        import('shiki/langs/html.mjs'),
        import('shiki/langs/shell.mjs'),
      ],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    })
  }
  return highlighterPromise
}

interface CodeBlockProps {
  code: string
  language?: string
}

const langLabels: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  php: 'PHP',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  csharp: 'C#',
  cs: 'C#',
  go: 'Go',
  json: 'JSON',
  bash: 'Bash',
  shell: 'Bash',
  sh: 'Bash',
  curl: 'Bash',
  html: 'HTML',
}

function normalizeLang(lang?: string): string {
  if (!lang) return 'text'
  const normalized = lang.toLowerCase()
  if (normalized === 'curl') return 'bash'
  return normalized
}

function CopyButtonInline({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
      aria-label={copied ? 'Kopyalandı' : 'Kodu kopyala'}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Kopyalandı
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Kopyala
        </>
      )}
    </button>
  )
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('')
  const lang = normalizeLang(language)
  const displayLang = langLabels[lang] ?? lang

  useEffect(() => {
    let cancelled = false

    getHighlighter().then((highlighter) => {
      if (cancelled) return
      const effectiveLang = bundledLangs.includes(lang as (typeof bundledLangs)[number]) ? lang : 'text'
      try {
        const highlighted = highlighter.codeToHtml(code, {
          lang: effectiveLang,
          theme: 'github-dark',
        })
        setHtml(highlighted)
      } catch {
        setHtml('')
      }
    })

    return () => {
      cancelled = true
    }
  }, [code, lang])

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-gray-800 bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <span className="font-mono text-xs text-gray-400">{displayLang}</span>
        <CopyButtonInline text={code} />
      </div>
      {html ? (
        <div
          className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!m-0 [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-sm text-gray-300">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
