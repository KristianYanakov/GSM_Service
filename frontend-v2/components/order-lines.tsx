import Image from 'next/image'
import type { CartItem } from '@/components/cart-provider'
import { formatPrice } from '@/lib/site'

export function OrderLines({ items }: { items: CartItem[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map(({ product, qty, lineTotal }) => (
        <li key={product.slug} className="flex items-center gap-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
            <span className="absolute -top-0 -right-0 flex size-5 items-center justify-center rounded-bl-lg bg-navy text-[11px] font-bold text-navy-foreground">
              {qty}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-navy">
              {product.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {qty} × {formatPrice(product.price)}
            </p>
          </div>
          <p className="text-sm font-bold text-navy">{formatPrice(lineTotal)}</p>
        </li>
      ))}
    </ul>
  )
}

export function SummaryRow({
  label,
  value,
  strong,
}: {
  label: React.ReactNode
  value: React.ReactNode
  strong?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className={strong ? 'text-lg font-bold text-navy' : 'text-sm text-muted-foreground'}>
        {label}
      </dt>
      <dd
        className={
          strong ? 'text-2xl font-extrabold text-navy' : 'text-right text-sm font-semibold text-navy'
        }
      >
        {value}
      </dd>
    </div>
  )
}
