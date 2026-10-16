import { Banknote, Check, CircleCheck, Clock, PackageCheck, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

export const orderSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CircleCheck },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck },
  { key: 'paid', label: 'Paid', icon: Banknote },
] as const

export type OrderStatus = (typeof orderSteps)[number]['key'] | 'cancelled'

export function StatusTimeline({ status }: { status: OrderStatus }) {
  const cancelled = status === 'cancelled'
  const currentIndex = cancelled ? -1 : orderSteps.findIndex((s) => s.key === status)

  return (
    <ol
      aria-label="Order status"
      className={cn(
        'flex flex-col gap-0 md:flex-row md:items-start',
        cancelled && 'opacity-50 grayscale',
      )}
    >
      {orderSteps.map((step, i) => {
        const done = i < currentIndex
        const current = i === currentIndex
        const Icon = done ? Check : step.icon
        const last = i === orderSteps.length - 1
        return (
          <li
            key={step.key}
            aria-current={current ? 'step' : undefined}
            className="relative flex flex-1 gap-4 pb-6 last:pb-0 md:flex-col md:items-center md:gap-3 md:pb-0 md:text-center"
          >
            {!last && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-11 bottom-0 left-[21px] w-0.5 md:top-[21px] md:right-[calc(-50%+22px)] md:bottom-auto md:left-[calc(50%+22px)] md:h-0.5 md:w-auto',
                  done ? 'bg-success' : 'bg-border',
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full ring-4 ring-card transition-colors',
                done && 'bg-success text-navy-foreground',
                current && 'bg-primary text-primary-foreground shadow-[0_0_0_6px_rgb(233_69_96/0.18)]',
                !done && !current && 'bg-secondary text-muted-foreground',
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col pt-2.5 md:pt-0">
              <span
                className={cn(
                  'text-sm font-semibold',
                  current ? 'text-primary' : done ? 'text-navy' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {done ? 'Completed' : current ? 'Current step' : 'Upcoming'}
              </span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
