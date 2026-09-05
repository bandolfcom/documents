import Fuse from 'fuse.js'
import { extractHeadings, getAllDocs, stripMarkdown } from './markdown'
import type { SearchResult } from './types'

interface SearchIndexEntry extends SearchResult {
  headings: string
  content: string
}

let fuseInstance: Fuse<SearchIndexEntry> | null = null

function getExcerpt(content: string, query: string, maxLength = 140): string {
  if (!query.trim()) return content.slice(0, maxLength)

  const lowerContent = content.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()
  const index = lowerContent.indexOf(lowerQuery)

  if (index === -1) return content.slice(0, maxLength)

  const start = Math.max(0, index - 50)
  const end = Math.min(content.length, index + lowerQuery.length + 80)
  let excerpt = content.slice(start, end).trim()

  if (start > 0) excerpt = `…${excerpt}`
  if (end < content.length) excerpt = `${excerpt}…`

  return excerpt
}

function buildSearchIndex(): SearchIndexEntry[] {
  const docs = getAllDocs().filter((doc) => doc.frontmatter.slug && doc.frontmatter.title)
  const entries: SearchIndexEntry[] = []

  for (const doc of docs) {
    const slug = doc.frontmatter.slug!
    const pageTitle = doc.frontmatter.title
    const plainContent = stripMarkdown(doc.content)
    const headings = extractHeadings(doc.content)
    const headingTexts = headings.map((h) => h.text).join(' ')

    entries.push({
      id: slug,
      title: pageTitle,
      slug,
      description: doc.frontmatter.description,
      category: doc.frontmatter.category,
      headings: headingTexts,
      content: plainContent,
      excerpt: doc.frontmatter.description ?? plainContent.slice(0, 160),
      resultType: 'page',
      pageTitle,
    })

    for (const heading of headings) {
      entries.push({
        id: `${slug}#${heading.id}`,
        title: heading.text,
        slug,
        anchor: heading.id,
        description: pageTitle,
        category: doc.frontmatter.category,
        headings: heading.text,
        content: plainContent,
        excerpt: `${pageTitle} › ${heading.text}`,
        resultType: 'heading',
        pageTitle,
      })
    }
  }

  return entries
}

export function getSearchIndex(): Fuse<SearchIndexEntry> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(buildSearchIndex(), {
      keys: [
        { name: 'title', weight: 0.35 },
        { name: 'pageTitle', weight: 0.1 },
        { name: 'description', weight: 0.15 },
        { name: 'category', weight: 0.05 },
        { name: 'headings', weight: 0.2 },
        { name: 'content', weight: 0.3 },
      ],
      threshold: 0.38,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
      useExtendedSearch: false,
    })
  }
  return fuseInstance
}

function toSearchResult(entry: SearchIndexEntry, query: string): SearchResult {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    anchor: entry.anchor,
    description: entry.description,
    category: entry.category,
    excerpt: getExcerpt(entry.content, query) || entry.excerpt,
    resultType: entry.resultType,
    pageTitle: entry.pageTitle,
  }
}

export function searchDocs(query: string, limit = 15): SearchResult[] {
  const trimmed = query.trim()

  if (!trimmed) {
    return buildSearchIndex()
      .filter((entry) => entry.resultType === 'page')
      .slice(0, limit)
      .map((entry) => toSearchResult(entry, ''))
  }

  const seen = new Set<string>()
  const results: SearchResult[] = []

  for (const { item } of getSearchIndex().search(trimmed)) {
    const key = item.anchor ? `${item.slug}#${item.anchor}` : item.slug
    if (seen.has(key)) continue
    seen.add(key)

    results.push(toSearchResult(item, trimmed))
    if (results.length >= limit) break
  }

  return results
}
