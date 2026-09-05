import { Check, Copy } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '../ui/Button'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
}

export function CopyButton({ text, label = 'Kopyala', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={className}
      aria-label={copied ? 'Kopyalandı' : `${label}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Kopyalandı
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </Button>
  )
}
