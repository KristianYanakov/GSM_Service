'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Banknote, CheckCircle2, ShieldCheck, ShoppingBag, Truck, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { QuantityStepper } from '@/components/quantity-stepper'
import { StatusChip } from '@/components/status-chip'
import { getMaxAllowedQty, useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/products'
import { formatPrice } from '@/lib/site'

export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const { add, items } = useCart()
  const router = useRouter()

  const inCartQty = items.find((i) => i.product.slug === product.slug)?.qty ?? 0
  const maxAllowed = getMaxAllowedQty(product)
  const remainingCanAdd = Math.max(0, maxAllowed - inCartQty)
  const canPurchase = product.inStock && remainingCanAdd > 0
  const safeQty = Math.min(qty, Math.max(1, remainingCanAdd))

  const addToCart = () => {
    if (!canPurchase) return
    const added = add(product, safeQty)
    if (added) {
      setQty(1)
      toast.success('Added to cart', {
        description: `${safeQty} × ${product.name}`,
        action: { label: 'View cart', onClick: () => router.push('/cart') },
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <StatusChip tone="accent">{product.category}</StatusChip>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-navy md:text-4xl">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-3xl font-extrabold text-navy md:text-4xl">
            {formatPrice(product.price)}
          </p>
          {product.inStock ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-success">
              <CheckCircle2 className="size-4.5" aria-hidden="true" />
              In stock ({product.stockQuantity} available
              {inCartQty > 0 ? `, ${inCartQty} in cart` : ''}) – ships in 1-2 days
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
              <XCircle className="size-4.5" aria-hidden="true" />
              Out of stock
            </p>
          )}
        </div>
        <p className="leading-relaxed text-pretty text-muted-foreground">{product.short}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <QuantityStepper
          value={safeQty}
          onChange={setQty}
          max={Math.max(1, remainingCanAdd)}
          className="self-start"
        />
        {/* Desktop add-to-cart; mobile uses the sticky bar below */}
        <Button
          size="xl"
          className="hidden flex-1 md:inline-flex"
          disabled={!canPurchase}
          onClick={addToCart}
        >
          <ShoppingBag aria-hidden="true" />
          {!product.inStock
            ? 'Out of stock'
            : remainingCanAdd === 0
              ? `All ${maxAllowed} available in cart`
              : 'Add to Cart'}
        </Button>
      </div>

      <ul className="grid grid-cols-3 gap-2 rounded-2xl bg-secondary/60 p-3 text-center sm:gap-3 sm:p-4">
        <InfoItem icon={Truck} label="Delivery with Econt" />
        <InfoItem icon={Banknote} label="Pay on delivery" />
        <InfoItem icon={ShieldCheck} label="24-month warranty" />
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(26_26_46/0.2)] backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <p className="text-xs text-muted-foreground">{safeQty} × item</p>
            <p className="text-lg font-bold text-navy">{formatPrice(product.price * safeQty)}</p>
          </div>
          <Button size="lg" className="flex-1" disabled={!canPurchase} onClick={addToCart}>
            <ShoppingBag aria-hidden="true" />
            {!product.inStock
              ? 'Out of stock'
              : remainingCanAdd === 0
                ? 'Max stock in cart'
                : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <li className="flex flex-col items-center gap-1.5 text-xs font-medium text-navy sm:text-sm">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      {label}
    </li>
  )
}