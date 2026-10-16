import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export const fieldInputClass =
  'h-12 rounded-xl border-input bg-card px-4 text-base text-navy shadow-none transition-colors placeholder:text-muted-foreground/70 hover:border-navy/30 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 aria-invalid:border-destructive aria-invalid:bg-destructive/[0.03] aria-invalid:ring-destructive/15 md:text-base'

export function FormField({
  id,
  label,
  required,
  optional,
  helper,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  optional?: boolean
  helper?: React.ReactNode
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className="text-sm font-semibold text-navy">
        {label}
        {required && (
          <span className="text-primary" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helper}
        </p>
      ) : null}
    </div>
  )
}
