import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = ['Cart', 'Checkout', 'Confirmation']

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={step} className="flex items-center gap-2 sm:gap-3">
              <span
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 text-sm font-semibold',
                  active ? 'text-navy' : done ? 'text-success' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-xs font-bold',
                    active && 'bg-primary text-primary-foreground',
                    done && 'bg-success-soft text-success',
                    !active && !done && 'bg-secondary text-muted-foreground',
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden="true" /> : i + 1}
                </span>
                <span className={cn(!active && 'hidden sm:inline')}>{step}</span>
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn('h-px w-6 sm:w-12', done ? 'bg-success' : 'bg-border')}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
