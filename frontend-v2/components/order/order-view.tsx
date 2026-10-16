'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Ban,
  Check,
  CheckCircle2,
  Copy,
  Link2,
  Loader2,
  Phone,
  Truck,
  User,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { CheckoutSteps } from '@/components/checkout-steps'
import { Notice } from '@/components/notice'
import { OrderLines, SummaryRow } from '@/components/order-lines'
import { StatusChip } from '@/components/status-chip'
import { useCart, type PlacedOrder } from '@/components/cart-provider'
import { StatusTimeline, type OrderStatus } from '@/components/order/status-timeline'
import { getOrderByNumber } from '@/lib/api/orders'
import { formatPrice, site } from '@/lib/site'
import { cn } from '@/lib/utils'

const statusMeta: Record<
  OrderStatus,
  { label: string; tone: 'warning' | 'accent' | 'navy' | 'success' | 'danger' }
> = {
  pending: { label: 'Pending', tone: 'warning' },
  confirmed: { label: 'Confirmed', tone: 'accent' },
  shipped: { label: 'Shipped', tone: 'navy' },
  delivered: { label: 'Delivered', tone: 'success' },
  paid: { label: 'Paid', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
}

export function OrderView({
  id,
  statusOverride,
}: {
  id: string
  statusOverride?: OrderStatus
}) {
  const { lastOrder } = useCart()
  const [order, setOrder] = useState<PlacedOrder | null>(
    lastOrder?.id === id ? lastOrder : null
  )
  const [backendStatus, setBackendStatus] = useState<OrderStatus>('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getOrderByNumber(id)
      .then((data) => {
        if (!active) return
        setBackendStatus(data.status || 'pending')
        setOrder((prev) => ({
          id: data.order_number || id,
          total: parseFloat(data.total_price) || prev?.total || 0,
          placedAt: data.created_at || prev?.placedAt || new Date().toISOString(),
          customer: {
            name: data.full_name,
            phone: data.phone,
            email: data.email || prev?.customer.email,
            econtOffice: data.econt_office || prev?.customer.econtOffice,
            address: data.shipping_address || prev?.customer.address,
            notes: data.notes || prev?.customer.notes,
          },
          items: data.items.map((item, idx) => {
            const matchedPrev = prev?.items.find((p) => p.product.name === item.product_name)
            const unitPrice = parseFloat(item.price_at_purchase) || 0
            return {
              qty: item.quantity,
              lineTotal: unitPrice * item.quantity,
              product: matchedPrev?.product || {
                id: item.id || idx,
                slug: `item-${item.id || idx}`,
                name: item.product_name,
                category: 'Phones',
                categorySlug: 'phones',
                type: 'phone',
                price: unitPrice,
                inStock: true,
                stockQuantity: 1,
                featured: false,
                image: '/images/p-phone-1.png',
                gallery: ['/images/p-phone-1.png'],
                short: '',
                description: '',
                details: [],
                addedAt: '',
              },
            }
          }),
        }))
        setError(null)
      })
      .catch(() => {
        if (!active) return
        if (!lastOrder || lastOrder.id !== id) {
          setError('Order not found. Please check your order link.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, lastOrder])

  if (loading && !order) {
    return (
      <div className="container-page flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container-page flex flex-col items-center gap-6 py-20 text-center">
        <Notice tone="error" title="Order not found" className="max-w-md text-left">
          {error || 'We could not find an order with this number.'}
        </Notice>
        <Link href="/store" className={buttonVariants({ size: 'lg' })}>
          Back to Store
        </Link>
      </div>
    )
  }

  const status = statusOverride || backendStatus
  const meta = statusMeta[status] || statusMeta.pending
  const fresh = status === 'pending'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/order/${order.id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const delivery = order.customer.econtOffice
    ? `Econt office · ${order.customer.econtOffice}`
    : order.customer.address
      ? `Econt to address · ${order.customer.address}`
      : 'Econt delivery'

  return (
    <div className="container-page flex flex-col gap-8 pt-6 pb-16 md:pt-10 md:pb-24">
      <CheckoutSteps current={2} />

      <header className="flex flex-col items-center gap-4 text-center">
        <span
          className={cn(
            'flex size-20 items-center justify-center rounded-full md:size-24',
            status === 'cancelled'
              ? 'bg-destructive/10 text-destructive'
              : 'bg-success-soft text-success shadow-[0_0_0_10px_var(--success-soft)]',
          )}
        >
          {status === 'cancelled' ? (
            <Ban className="size-10 md:size-12" aria-hidden="true" />
          ) : status === 'shipped' ? (
            <Truck className="size-10 md:size-12" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="size-10 md:size-12" aria-hidden="true" />
          )}
        </span>
        <h1 className="pt-2 text-3xl font-extrabold tracking-tight text-balance text-navy md:text-5xl">
          {status === 'cancelled'
            ? 'Order cancelled'
            : status === 'shipped'
              ? 'Your order is on its way!'
              : fresh
                ? 'Order Placed!'
                : `Order ${meta.label.toLowerCase()}`}
        </h1>
        <p className="max-w-lg text-pretty text-muted-foreground">
          {status === 'cancelled'
            ? `This order was cancelled and nothing will be shipped. If this is a mistake, call us at ${site.phone}.`
            : status === 'shipped'
              ? 'Your parcel has been handed to Econt. Have cash or card ready when you collect it.'
              : `Thank you, ${order.customer.name.split(' ')[0]}! We'll call you shortly to confirm, then ship with Econt.`}
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <section
          aria-labelledby="status-heading"
          className="flex flex-col gap-6 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60 md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Order number</p>
              <h2 id="status-heading" className="text-xl font-bold break-all text-navy">
                #{order.id}
              </h2>
            </div>
            <StatusChip tone={meta.tone} size="md" dot>
              {meta.label}
            </StatusChip>
          </div>
          <StatusTimeline status={status} />
          {status === 'cancelled' && (
            <Notice tone="error" title="Cancelled on request">
              No payment was taken. You can place a new order any time.
            </Notice>
          )}
          {status === 'shipped' && (
            <Notice tone="info" title="Econt shipment created">
              Expected delivery in 1-2 working days. Econt will send you an SMS when it arrives.
            </Notice>
          )}
        </section>

        <section
          aria-labelledby="details-heading"
          className="grid gap-6 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60 md:grid-cols-2 md:gap-10 md:p-8"
        >
          <div className="flex flex-col gap-5">
            <h2 id="details-heading" className="text-lg font-bold text-navy">
              Order details
            </h2>
            <ul className="flex flex-col gap-4 text-sm">
              <DetailRow icon={User} label="Customer" value={order.customer.name} />
              <DetailRow icon={Phone} label="Phone" value={order.customer.phone} />
              <DetailRow icon={Truck} label="Delivery method" value={delivery} />
            </ul>
            <p className="rounded-xl bg-secondary/70 p-3.5 text-sm text-navy">
              <strong>Payment:</strong> Cash/Card on delivery via Econt
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-navy">Items</h3>
            <OrderLines items={order.items} />
            <dl className="flex flex-col gap-3 border-t pt-4">
              <SummaryRow label="Delivery" value="Paid to Econt" />
              <SummaryRow label="Total" value={formatPrice(order.total)} strong />
            </dl>
          </div>
        </section>

        <div className="flex flex-col items-start gap-4 rounded-2xl border-2 border-dashed border-navy/15 p-5 sm:flex-row sm:items-center md:p-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Link2 className="size-5" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-navy">Save this link to check your order status later</p>
            <p className="text-sm break-all text-muted-foreground">/order/{order.id}</p>
          </div>
          <Button variant="outline" onClick={copyLink} className="w-full sm:w-auto" aria-live="polite">
            {copied ? <Check className="text-success" aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? 'Copied!' : 'Copy link'}
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/store" className={cn(buttonVariants({ size: 'xl' }), 'w-full sm:w-auto')}>
            Continue Shopping
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="text-muted-foreground">{label}</p>
        <p className="font-semibold text-navy">{value}</p>
      </div>
    </li>
  )
}