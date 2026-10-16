'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { StatusChip } from '@/components/status-chip'
import { useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/products'
import { formatPrice } from '@/lib/site'
import { cn } from '@/lib/utils'

export function ProductCard({
  product,
  showStock = true,
  className,
}: {
  product: Product
  showStock?: boolean
  className?: string
}) {
  const { add } = useCart()
  const router = useRouter()
  const href = `/store/${product.slug}`

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={cn(
            'object-cover transition-transform duration-300 group-hover:scale-105',
            !product.inStock && 'opacity-60 grayscale-[40%]',
          )}
        />
        {showStock && (
          <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3">
            {product.inStock ? (
              <StatusChip tone="success" dot className="bg-card/95">
                In stock
              </StatusChip>
            ) : (
              <StatusChip tone="danger" dot className="bg-card/95">
                Out of stock
              </StatusChip>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:gap-3 md:p-4">
        <StatusChip tone="accent">{product.category}</StatusChip>
        <h3 className="line-clamp-2 min-h-[2.75em] text-sm leading-snug font-semibold text-navy md:text-base">
          <Link href={href} className="outline-none after:absolute after:inset-0 focus-visible:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto text-lg font-bold text-navy md:text-xl">{formatPrice(product.price)}</p>
        <Button
          className="relative z-10 w-full"
          variant={product.inStock ? 'default' : 'secondary'}
          disabled={!product.inStock}
          onClick={() => {
            add(product)
            toast.success('Added to cart', {
              description: product.name,
              action: { label: 'View cart', onClick: () => router.push('/cart') },
            })
          }}
        >
          <ShoppingBag aria-hidden="true" />
          {product.inStock ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </div>
    </article>
  )
}