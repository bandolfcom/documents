import clsx from 'clsx'

interface LogoProps {
  variant?: 'default' | 'white' | 'icon'
  withIcon?: boolean
  className?: string
  alt?: string
}

const logoSources = {
  default: '/bandolf/bandolf-blue-text.png',
  white: '/bandolf/bandolf-white-text.png',
  icon: '/bandolf/logo-blue-square.png',
} as const

export function Logo({ variant = 'default', withIcon = false, className, alt = 'BANDOLF' }: LogoProps) {
  if (withIcon && variant === 'default') {
    return (
      <span className={clsx('flex items-center gap-2.5', className)}>
        <img
          src={logoSources.icon}
          alt=""
          className="h-8 w-8 shrink-0"
          draggable={false}
          aria-hidden
        />
        <img
          src={logoSources.default}
          alt={alt}
          className="h-7 w-auto dark:hidden"
          draggable={false}
        />
        <img
          src={logoSources.white}
          alt={alt}
          className="hidden h-7 w-auto dark:block"
          draggable={false}
        />
      </span>
    )
  }

  const src = logoSources[variant]
  const isIcon = variant === 'icon'

  return (
    <img
      src={src}
      alt={alt}
      className={clsx(isIcon ? 'h-8 w-8' : 'h-8 w-auto', className)}
      draggable={false}
    />
  )
}
