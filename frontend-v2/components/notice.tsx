import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const tones = {
  info: { icon: Info, className: 'border-navy/10 bg-secondary text-navy' },
  success: { icon: CheckCircle2, className: 'border-success/20 bg-success-soft text-success' },
  warning: { icon: AlertTriangle, className: 'border-warning/25 bg-warning-soft text-warning' },
  error: { icon: XCircle, className: 'border-destructive/25 bg-destructive/8 text-destructive' },
}

export function Notice({
  tone = 'info',
  title,
  children,
  className,
  action,
}: {
  tone?: keyof typeof tones
  title: string
  children?: React.ReactNode
  className?: string
  action?: React.ReactNode
}) {
  const { icon: Icon, className: toneClass } = tones[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl border p-4', toneClass, className)}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="font-semibold">{title}</p>
        {children && <div className="text-sm leading-relaxed text-foreground/80">{children}</div>}
      </div>
      {action}
    </div>
  )
}
