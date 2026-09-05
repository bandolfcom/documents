import { parseFrontmatter } from './frontmatter'
import type { DocPage, NavItem, NavSection, TocItem } from './types'

const modules = import.meta.glob('../../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function filePathFromKey(key: string): string {
  return key.replace('../../content/', '')
}

function parseDoc(file: string, raw: string): DocPage {
  const { data: frontmatter, content } = parseFrontmatter(raw)

  return {
    slug: frontmatter.slug ?? '',
    file,
    frontmatter,
    content: content.trim(),
    raw,
  }
}

const docsByFile = new Map<string, DocPage>()
const docsBySlug = new Map<string, DocPage>()

for (const [key, raw] of Object.entries(modules)) {
  const file = filePathFromKey(key)
  const doc = parseDoc(file, raw)
  docsByFile.set(file, doc)
  if (doc.frontmatter.slug) {
    docsBySlug.set(doc.frontmatter.slug, doc)
  }
}

function getSortOrder(doc: DocPage, fallback: number): number {
  return doc.frontmatter.order ?? fallback
}

function toNavItem(doc: DocPage): NavItem {
  return {
    title: doc.frontmatter.title,
    slug: doc.frontmatter.slug!,
    file: doc.file,
  }
}

function getSortedDocs(): DocPage[] {
  return getAllDocs()
    .filter((doc) => doc.frontmatter.slug && doc.frontmatter.title)
    .sort((a, b) => {
      const orderDiff = getSortOrder(a, 0) - getSortOrder(b, 0)
      if (orderDiff !== 0) return orderDiff
      return a.file.localeCompare(b.file)
    })
}

let cachedNavSections: NavSection[] | null = null
let cachedFlatNav: NavItem[] | null = null

export function getNavSections(): NavSection[] {
  if (cachedNavSections) return cachedNavSections

  const sortedDocs = getSortedDocs().filter((doc) => doc.frontmatter.sidebar !== false)
  const sectionsMap = new Map<string, { items: NavItem[]; sectionOrder: number }>()

  sortedDocs.forEach((doc, index) => {
    const category = doc.frontmatter.category ?? 'Diğer'
    const section = sectionsMap.get(category) ?? { items: [], sectionOrder: index }

    section.items.push(toNavItem(doc))
    section.sectionOrder = Math.min(section.sectionOrder, getSortOrder(doc, index))
    sectionsMap.set(category, section)
  })

  cachedNavSections = [...sectionsMap.entries()]
    .sort((a, b) => a[1].sectionOrder - b[1].sectionOrder)
    .map(([title, { items }]) => ({ title, items }))

  return cachedNavSections
}

export function getAllNavItems(): NavItem[] {
  if (cachedFlatNav) return cachedFlatNav

  cachedFlatNav = getSortedDocs().map(toNavItem)
  return cachedFlatNav
}

export function getNavItemBySlug(slug: string): NavItem | undefined {
  const doc = getDocBySlug(slug)
  return doc ? toNavItem(doc) : undefined
}

export function getSectionForSlug(slug: string): NavSection | undefined {
  return getNavSections().find((section) => section.items.some((item) => item.slug === slug))
}

export function getAdjacentPages(slug: string): { prev?: NavItem; next?: NavItem } {
  const items = getAllNavItems()
  const index = items.findIndex((item) => item.slug === slug)
  if (index === -1) return {}
  return {
    prev: index > 0 ? items[index - 1] : undefined,
    next: index < items.length - 1 ? items[index + 1] : undefined,
  }
}

export function getBreadcrumbs(slug: string): { label: string; href?: string }[] {
  const item = getNavItemBySlug(slug)
  const section = getSectionForSlug(slug)
  const crumbs: { label: string; href?: string }[] = [{ label: 'Dokümantasyon', href: '/docs' }]

  if (section) {
    const firstInSection = section.items[0]
    if (firstInSection && firstInSection.slug !== slug) {
      crumbs.push({ label: section.title, href: firstInSection.slug })
    }
  }

  if (item) {
    crumbs.push({ label: item.title })
  } else {
    const doc = getDocBySlug(slug)
    if (doc) crumbs.push({ label: doc.frontmatter.title })
  }

  return crumbs
}

export function getDocsCategories() {
  const featured = getSortedDocs().filter((doc) => doc.frontmatter.featured)
  const source = featured.length > 0
    ? featured
    : getNavSections().slice(0, 5).flatMap((section) => {
        const doc = getDocBySlug(section.items[0]?.slug ?? '')
        return doc ? [doc] : []
      })

  return source.map((doc) => ({
    title: doc.frontmatter.category ?? doc.frontmatter.title,
    description: doc.frontmatter.description ?? '',
    slug: doc.frontmatter.slug!,
  }))
}

export function getCommandPaletteActions(): Array<
  { label: string; action: 'search' } | { label: string; slug: string }
> {
  const featured = getSortedDocs().filter((doc) => doc.frontmatter.featured)
  const links = featured.length > 0
    ? featured.map(toNavItem)
    : getAllNavItems().slice(0, 5)

  return [
    { label: 'Dokümantasyonda ara', action: 'search' as const },
    ...links.map((item) => ({
      label: `${item.title} sayfasına git`,
      slug: item.slug,
    })),
  ]
}

export function getDocByFile(file: string): DocPage | undefined {
  return docsByFile.get(file)
}

export function getDocBySlug(slug: string): DocPage | undefined {
  return docsBySlug.get(slug)
}

export function getAllDocs(): DocPage[] {
  return Array.from(docsByFile.values())
}

export function preprocessCallouts(content: string): string {
  return content.replace(
    /^>\s*\[!(\w+)\]\s*\n((?:>\s*.+\n?)*)/gm,
    (_match, type: string, body: string) => {
      const lines = body
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join('\n')
        .trim()
      return `<div data-callout="${type.toLowerCase()}">\n\n${lines}\n\n</div>\n\n`
    },
  )
}

export interface TabBlock {
  label: string
  content: string
}

export interface ContentSegment {
  type: 'markdown' | 'tabs'
  content?: string
  tabs?: TabBlock[]
}

export function parseContentSegments(content: string): ContentSegment[] {
  const segments: ContentSegment[] = []
  const tabPattern = /:::tabs\n([\s\S]*?):::/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tabPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'markdown',
        content: content.slice(lastIndex, match.index).trim(),
      })
    }

    const tabContent = match[1]
    const tabBlocks: TabBlock[] = []
    const individualTabPattern = /:::tab\s+(.+)\n([\s\S]*?)(?=:::tab|:::$)/g
    let tabMatch: RegExpExecArray | null

    while ((tabMatch = individualTabPattern.exec(tabContent)) !== null) {
      tabBlocks.push({
        label: tabMatch[1].trim(),
        content: tabMatch[2].trim(),
      })
    }

    if (tabBlocks.length > 0) {
      segments.push({ type: 'tabs', tabs: tabBlocks })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    segments.push({
      type: 'markdown',
      content: content.slice(lastIndex).trim(),
    })
  }

  if (segments.length === 0) {
    segments.push({ type: 'markdown', content })
  }

  return segments
}

export function extractHeadings(content: string): TocItem[] {
  const items: TocItem[] = []
  const headingPattern = /^(#{1,3})\s+(.+)$/gm
  let match: RegExpExecArray | null

  while ((match = headingPattern.exec(content)) !== null) {
    const level = Math.min(match[1].length, 3) as 1 | 2 | 3
    const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    items.push({ id, text, level })
  }

  return items
}

export function extractToc(content: string): TocItem[] {
  return extractHeadings(content).filter((item) => item.level >= 2)
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
