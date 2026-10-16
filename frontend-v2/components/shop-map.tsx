'use client'

import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const ShopMapInner = dynamic(() => import('@/components/shop-map-inner'), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-muted" />,
})

export function ShopMap({
  className,
  interactive = true,
}: {
  className?: string
  interactive?: boolean
}) {
  return (
    <div
      className={cn('relative isolate overflow-hidden rounded-2xl bg-muted ring-1 ring-border/60', className)}
      role="region"
      aria-label="Map showing the shop location"
    >
      <ShopMapInner interactive={interactive} />
    </div>
  )
}
