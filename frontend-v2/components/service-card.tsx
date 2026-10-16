import { BatteryCharging, Clock, Cpu, Droplets, Smartphone, Usb, Wrench } from 'lucide-react'
import { StatusChip } from '@/components/status-chip'
import type { ServiceCategory } from '@/lib/services'
import { formatPrice } from '@/lib/site'
import { cn } from '@/lib/utils'

export const serviceIcons: Record<string, typeof Smartphone> = {
  'Screen Repair': Smartphone,
  Battery: BatteryCharging,
  'Charging Port': Usb,
  'Water Damage': Droplets,
  Software: Cpu,
}

export function resolveServiceIcon(category: string) {
  if (serviceIcons[category]) return serviceIcons[category]
  const lower = category.toLowerCase()
  if (lower.includes('screen') || lower.includes('display') || lower.includes('glass')) return Smartphone
  if (lower.includes('battery') || lower.includes('power')) return BatteryCharging
  if (lower.includes('port') || lower.includes('charg') || lower.includes('usb')) return Usb
  if (lower.includes('water') || lower.includes('liquid')) return Droplets
  if (lower.includes('soft') || lower.includes('data')) return Cpu
  return Wrench
}

export function ServiceCard({
  category,
  name,
  description,
  from,
  turnaround,
  className,
}: {
  category: ServiceCategory
  name: string
  description?: string
  from: number
  turnaround?: string
  className?: string
}) {
  const Icon = resolveServiceIcon(category)
  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift md:p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        {turnaround && (
          <StatusChip tone="neutral">
            <Clock aria-hidden="true" />
            {turnaround}
          </StatusChip>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-navy">{name}</h3>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>
      <p className="mt-auto text-sm text-muted-foreground">
        {from === 0 ? (
          <span className="text-lg font-bold text-success">Free</span>
        ) : (
          <>
            From <span className="text-lg font-bold text-navy">{formatPrice(from)}</span>
          </>
        )}
      </p>
    </article>
  )
}