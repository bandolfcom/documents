import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/brand/Logo'
import { Button } from '../components/ui/Button'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFound() {
  usePageMeta('404 — Sayfa Bulunamadı')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-[#0b0f17]">
      <Logo className="mb-8 dark:hidden" />
      <Logo variant="white" className="mb-8 hidden dark:block" />
      <h1 className="text-6xl font-bold text-bandolf-primary">404</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Bu sayfa mevcut değil.</p>
      <Link to="/docs" className="mt-8">
        <Button>
          <ArrowLeft className="h-4 w-4" />
          Dokümantasyona dön
        </Button>
      </Link>
    </div>
  )
}
