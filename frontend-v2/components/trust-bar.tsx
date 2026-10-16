import { Banknote, ShieldCheck, Timer, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { icon: Timer, title: 'Fast repairs', text: 'Most fixes in under 1 hour' },
  { icon: Truck, title: 'Delivery with Econt', text: 'To any office in Bulgaria' },
  { icon: Banknote, title: 'Pay on delivery', text: 'Cash or card on arrival' },
  { icon: ShieldCheck, title: 'Warranty on repairs', text: '6 months parts & labor' },
]

export function TrustBar({ className }: { className?: string }) {
  return (
    <section aria-label="Why shop with us" className={cn('container-page', className)}>
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border/60 sm:flex-row sm:items-center md:p-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-navy-foreground">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-snug">
              <p className="text-sm font-semibold text-navy md:text-base">{title}</p>
              <p className="text-xs text-muted-foreground md:text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
