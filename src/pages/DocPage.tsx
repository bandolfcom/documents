import { Navigate, useLocation } from 'react-router-dom'
import { ApiDocLayout } from '../components/api/ApiDocLayout'
import { PageFeedback } from '../components/layout/PageFeedback'
import { Breadcrumb } from '../components/navigation/Breadcrumb'
import { MarkdownContent } from '../components/markdown/MarkdownContent'
import { PrevNextNav } from '../components/navigation/PrevNextNav'
import { TableOfContents } from '../components/navigation/TableOfContents'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  extractToc,
  getAdjacentPages,
  getBreadcrumbs,
  getDocBySlug,
} from '../lib/markdown'

export function DocPage() {
  const location = useLocation()
  const slug = location.pathname.replace(/\/$/, '')
  const doc = getDocBySlug(slug)

  if (!doc) {
    return <Navigate to="/404" replace />
  }

  const { frontmatter, content } = doc
  const breadcrumbs = getBreadcrumbs(slug)
  const { prev, next } = getAdjacentPages(slug)
  const isApiDoc = frontmatter.type === 'api'

  usePageMeta(
    `BANDOLF Dokümantasyon — ${frontmatter.title}`,
    frontmatter.description,
  )

  return (
    <article>
      <Breadcrumb items={breadcrumbs} />

      {isApiDoc && frontmatter.method && frontmatter.endpoint ? (
        <ApiDocLayout
          method={frontmatter.method}
          endpoint={frontmatter.endpoint}
          description={frontmatter.description}
        >
          <div className="prose-docs">
            <MarkdownContent content={content} />
          </div>
        </ApiDocLayout>
      ) : (
        <div className="prose-docs">
          <MarkdownContent content={content} />
        </div>
      )}

      <PrevNextNav prev={prev} next={next} />
      <PageFeedback slug={slug} />
    </article>
  )
}

export function DocPageToc() {
  const location = useLocation()
  const slug = location.pathname.replace(/\/$/, '')
  const doc = getDocBySlug(slug)

  if (!doc) return null
  const toc = extractToc(doc.content)
  return <TableOfContents items={toc} />
}
