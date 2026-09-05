export interface DocFrontmatter {
  title: string
  description?: string
  category?: string
  order?: number
  slug?: string
  sidebar?: boolean
  featured?: boolean
  type?: 'doc' | 'api'
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  endpoint?: string
}

export interface DocPage {
  slug: string
  file: string
  frontmatter: DocFrontmatter
  content: string
  raw: string
}

export interface NavItem {
  title: string
  slug: string
  file: string
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export interface TocItem {
  id: string
  text: string
  level: 1 | 2 | 3
}

export interface SearchResult {
  id: string
  title: string
  slug: string
  anchor?: string
  description?: string
  category?: string
  excerpt?: string
  resultType: 'page' | 'heading'
  pageTitle?: string
}

export interface ApiParameter {
  name: string
  type: string
  required?: boolean
  description?: string
}

export interface ApiError {
  code: string
  description: string
}
