import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { Callout } from './Callout'
import { CodeBlock } from './CodeBlock'

interface MarkdownRendererProps {
  content: string
}

function extractLanguage(className?: string): string | undefined {
  if (!className) return undefined
  const match = /language-(\w+)/.exec(className)
  return match?.[1]
}

type CalloutType = 'note' | 'tip' | 'warning' | 'danger'

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeRaw]}
      components={{
        div: ({ ...props }) => {
          const calloutType = (props as Record<string, unknown>)['data-callout'] as CalloutType | undefined
          if (calloutType) {
            return (
              <Callout type={calloutType}>
                {props.children as ReactNode}
              </Callout>
            )
          }
          return <div {...props}>{props.children as ReactNode}</div>
        },
        code: ({ className, children, ...props }) => {
          const code = String(children).replace(/\n$/, '')
          const isBlock = className?.includes('language-') || code.includes('\n')

          if (isBlock) {
            return <CodeBlock code={code} language={extractLanguage(className)} />
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
