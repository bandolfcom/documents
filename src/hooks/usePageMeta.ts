import { useEffect } from 'react'

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    if (description) {
      metaDescription.setAttribute('content', description)
    }

    return () => {
      document.title = 'BANDOLF Dokümantasyon'
    }
  }, [title, description])
}
