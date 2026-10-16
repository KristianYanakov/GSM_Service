import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const chipVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full font-semibold whitespace-nowrap [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        neutral: 'bg-secondary text-navy',
        accent: 'bg-accent text-accent-foreground',
        success: 'bg-success-soft text-success',
        warning: 'bg-warning-soft text-warning',
        danger: 'bg-destructive/10 text-destructive',
        navy: 'bg-navy text-navy-foreground',
      },
      size: {
        sm: 'h-6 px-2.5 text-xs',
        md: 'h-8 px-3 text-sm',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
)

export function StatusChip({
  className,
  tone,
  size,
  dot,
  children,
}: VariantProps<typeof chipVariants> & {
  className?: string
  dot?: boolean
  children: React.ReactNode
}) {
  return (
    <span className={cn(chipVariants({ tone, size }), className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}
