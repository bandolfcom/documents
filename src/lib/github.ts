export const GITHUB_REPO = 'https://github.com/bandolfcom/documents'
export const GITHUB_EDIT_BASE = `${GITHUB_REPO}/edit/main/content`
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues/new`

export function getGitHubEditUrl(file: string): string {
  return `${GITHUB_EDIT_BASE}/${file}`
}
