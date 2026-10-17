'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Banknote, Trash2, Truck } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { QuantityStepper } from '@/components/quantity-stepper'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { SummaryRow } from '@/components/order-lines'
import { StatusChip } from '@/components/status-chip'
import { getMaxAllowedQty, useCart } from '@/components/cart-provider'
import { formatPrice } from '@/lib/site'
import { cn } from '@/lib/utils'

export function CartView() {
  const { items, count, subtotal, setQty, remove } = useCart()
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Cart' }]

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Your cart" crumbs={crumbs} />
        <div className="container-page pb-20">
          <EmptyState
            image="/images/illustration-empty-cart.png"
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Browse phones, cases and chargers — delivery with Econt, pay when it arrives."
          >
            <Link href="/store" className={buttonVariants({ size: 'lg' })}>
              Browse Store
              <ArrowRight aria-hidden="true" />
            </Link>
          </EmptyState>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            Your cart
            <StatusChip tone="neutral" size="md">
              {count} {count === 1 ? 'item' : 'items'}
            </StatusChip>
          </span>
        }
        crumbs={crumbs}
      />
      <div className="container-page grid items-start gap-6 pb-16 md:pb-24 lg:grid-cols-[1fr_380px] lg:gap-8">
        <section aria-label="Cart items" className="flex flex-col gap-4">
          {/* Desktop table header */}
          <div className="hidden grid-cols-[1fr_120px_150px_110px_44px] items-center gap-4 px-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span className="text-right">Subtotal</span>
            <span className="sr-only">Remove</span>
          </div>
          <ul className="flex flex-col gap-3">
            {items.map(({ product, qty, lineTotal }) => {
              const maxQty = getMaxAllowedQty(product)
              return (
                <li
                  key={product.slug}
                  className="grid grid-cols-[80px_1fr] gap-x-4 gap-y-3 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border/60 md:grid-cols-[1fr_120px_150px_110px_44px] md:items-center md:p-5"
                >
                  <div className="row-span-2 flex items-center gap-4 md:row-span-1">
                    <Link
                      href={`/store/${product.slug}`}
                      className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="hidden min-w-0 md:block">
                      <ProductTitle
                        slug={product.slug}
                        name={product.name}
                        category={product.category}
                      />
                    </div>
                  </div>

                  <div className="flex min-w-0 items-start justify-between gap-2 md:hidden">
                    <div className="min-w-0">
                      <ProductTitle
                        slug={product.slug}
                        name={product.name}
                        category={product.category}
                      />
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(product.price)} each
                      </p>
                    </div>
                    <RemoveButton onClick={() => remove(product.slug)} name={product.name} />
                  </div>

                  <p className="hidden font-semibold text-navy md:block">
                    {formatPrice(product.price)}
                  </p>

                  <div className="flex items-center justify-between gap-3 md:contents">
                    <QuantityStepper
                      size="sm"
                      value={qty}
                      max={maxQty}
                      onChange={(v) => setQty(product.slug, v)}
                      label={`Quantity for ${product.name}`}
                    />
                    <p className="text-lg font-bold text-navy md:text-right md:text-base">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>

                  <div className="hidden md:block">
                    <RemoveButton onClick={() => remove(product.slug)} name={product.name} />
                  </div>
                </li>
              )
            })}
          </ul>
          <Link
            href="/store"
            className={cn(
              buttonVariants({ variant: 'link' }),
              'self-start text-navy hover:text-primary',
            )}
          >
            <ArrowLeft aria-hidden="true" />
            Continue shopping
          </Link>
        </section>

        <aside
          aria-label="Order summary"
          className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60 md:p-6 lg:sticky lg:top-24"
        >
          <h2 className="text-xl font-bold text-navy">Order summary</h2>
          <dl className="flex flex-col gap-3">
            <SummaryRow label={`Subtotal (${count} items)`} value={formatPrice(subtotal)} />
            <SummaryRow
              label="Delivery"
              value={<span className="text-muted-foreground">Calculated by Econt</span>}
            />
          </dl>
          <div className="flex gap-3 rounded-xl bg-secondary/70 p-3.5 text-sm">
            <Truck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="leading-relaxed text-navy">
              Delivery is calculated by Econt. You <strong>pay on delivery</strong> with cash or
              card.
            </p>
          </div>
          <div className="border-t pt-4">
            <dl>
              <SummaryRow label="Total" value={formatPrice(subtotal)} strong />
            </dl>
            <p className="mt-1 text-xs text-muted-foreground">VAT included · + Econt delivery fee</p>
          </div>
          <Link href="/checkout" className={cn(buttonVariants({ size: 'xl' }), 'w-full')}>
            Proceed to Checkout
            <ArrowRight aria-hidden="true" />
          </Link>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Banknote className="size-4" aria-hidden="true" />
            No online payment needed
          </p>
        </aside>
      </div>
    </>
  )
}

function ProductTitle({
  slug,
  name,
  category,
}: {
  slug: string
  name: string
  category: string
}) {
  return (
    <>
      <p className="text-xs font-semibold text-primary">{category}</p>
      <Link
        href={`/store/${slug}`}
        className="line-clamp-2 leading-snug font-semibold text-navy hover:text-primary"
      >
        {name}
      </Link>
    </>
  )
}

function RemoveButton({ onClick, name }: { onClick: () => void; name: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label={`Remove ${name}`}
      className="-mt-1 -mr-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive md:m-0"
    >
      <Trash2 aria-hidden="true" />
    </Button>
  )
}