import Link from 'next/link'
import { Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2.5 rounded-lg font-bold tracking-tight outline-none focus-visible:ring-4 focus-visible:ring-ring/30',
        inverted ? 'text-navy-foreground' : 'text-navy',
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Smartphone className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xl">{site.name}</span>
    </Link>
  )
}

type IconProps = { className?: string }

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
