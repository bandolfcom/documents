import type { DocFrontmatter } from './types'

interface ParsedFrontmatter {
  data: DocFrontmatter
  content: string
}

function parseValue(raw: string): string | number | boolean {
  const trimmed = raw.trim()
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (/^\d+$/.test(trimmed)) return Number(trimmed)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function parseFrontmatter(raw: string): ParsedFrontmatter {
  if (!raw.startsWith('---')) {
    return { data: {} as DocFrontmatter, content: raw }
  }

  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {} as DocFrontmatter, content: raw }
  }

  const frontmatterBlock = raw.slice(3, end).trim()
  const content = raw.slice(end + 4).replace(/^\n/, '')
  const data: Record<string, string | number | boolean> = {}

  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1)
    data[key] = parseValue(value)
  }

  return {
    data: data as unknown as DocFrontmatter,
    content,
  }
}
