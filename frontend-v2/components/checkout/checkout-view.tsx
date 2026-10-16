'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Banknote, CreditCard, Loader2, Lock, ShoppingBag, Truck } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CheckoutSteps } from '@/components/checkout-steps'
import { FormField, fieldInputClass } from '@/components/form-field'
import { Notice } from '@/components/notice'
import { OrderLines, SummaryRow } from '@/components/order-lines'
import { EmptyState } from '@/components/empty-state'
import { useCart } from '@/components/cart-provider'
import { createOrder } from '@/lib/api/orders'
import { formatPrice } from '@/lib/site'
import { cn } from '@/lib/utils'

type FieldName = 'name' | 'phone' | 'email' | 'econtOffice' | 'address' | 'notes'
type Errors = Partial<Record<FieldName, string>>

const PHONE_RE = /^(\+359|0)[\s-]?\d{2,3}([\s-]?\d{2,4}){2,3}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(v: Record<FieldName, string>): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 3) e.name = 'Please enter your first and last name.'
  if (!v.phone.trim()) e.phone = 'Phone number is required so the courier can reach you.'
  else if (!PHONE_RE.test(v.phone.trim()))
    e.phone = 'Enter a valid phone number, e.g. 088 123 4567.'
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim()))
    e.email = 'This email address looks incomplete.'
  if (!v.econtOffice.trim() && !v.address.trim())
    e.econtOffice = 'Choose an Econt office or enter a delivery address below.'
  return e
}

export function CheckoutView() {
  const { items, subtotal, count, clear, setLastOrder } = useCart()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: '',
    phone: '',
    email: '',
    econtOffice: '',
    address: '',
    notes: '',
  })
  const [website, setWebsite] = useState('') // Honeypot field — stays empty for real users
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (items.length === 0 && !submitting && !orderPlaced) {
    return (
      <div className="container-page flex flex-col gap-6 pt-6 pb-20 md:pt-10">
        <CheckoutSteps current={1} />
        <EmptyState
          image="/images/illustration-empty-cart.png"
          title="Nothing to check out yet"
          description="Your cart is empty. Add a product to place a guest order — no account needed."
        >
          <Link href="/store" className={buttonVariants({ size: 'lg' })}>
            Browse Store
          </Link>
        </EmptyState>
      </div>
    )
  }

  const set = (name: FieldName, value: string) => {
    const next = { ...values, [name]: value }
    setValues(next)
    if (touched[name] || errors[name]) {
      const all = validate(next)
      setErrors((prev) => ({
        ...prev,
        [name]: all[name],
        ...(name === 'address' ? { econtOffice: all.econtOffice } : {}),
      }))
    }
  }
  const blur = (name: FieldName) => {
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, phone: true, email: true, econtOffice: true })
    if (Object.keys(found).length > 0) {
      setSubmitError(
        `Please fix the ${Object.values(found).filter(Boolean).length} highlighted ${
          Object.values(found).filter(Boolean).length === 1 ? 'field' : 'fields'
        } below and try again.`
      )
      requestAnimationFrame(() => {
        alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const first = Object.keys(found)[0]
        formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus({ preventScroll: true })
      })
      return
    }

    setSubmitError(null)
    setSubmitting(true)

    const payload = {
      full_name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      econt_office: values.econtOffice.trim(),
      shipping_address: values.address.trim(),
      notes: values.notes.trim(),
      website, // Honeypot field
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.qty,
      })),
    }

    try {
      const res = await createOrder(payload)
      setOrderPlaced(true)
      setLastOrder({
        id: res.order_number,
        items,
        total: parseFloat(res.total_price) || subtotal,
        customer: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email.trim() || undefined,
          econtOffice: values.econtOffice.trim() || undefined,
          address: values.address.trim() || undefined,
          notes: values.notes.trim() || undefined,
        },
        placedAt: res.created_at || new Date().toISOString(),
      })
      clear()
      router.push(`/order/${res.order_number}`)
    } catch (err: any) {
      setSubmitError(err?.message || 'Something went wrong submitting your order. Please try again.')
      requestAnimationFrame(() => {
        alertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    } finally {
      setSubmitting(false)
    }
  }

  const inputProps = (name: FieldName, extra?: { optional?: boolean }) => ({
    id: name,
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(name, e.target.value),
    onBlur: () => blur(name),
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : `${name}-helper`,
    'aria-required': extra?.optional ? undefined : true,
    disabled: submitting,
  })

  const summary = (
    <>
      <OrderLines items={items} />
      <dl className="flex flex-col gap-3 border-t pt-4">
        <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
        <SummaryRow label="Delivery" value="Paid to Econt on delivery" />
        <div className="border-t pt-3">
          <SummaryRow label="Total" value={formatPrice(subtotal)} strong />
        </div>
      </dl>
    </>
  )

  return (
    <div className="container-page flex flex-col gap-6 pt-6 pb-16 md:gap-8 md:pt-10 md:pb-24">
      <div className="flex flex-col gap-4">
        <CheckoutSteps current={1} />
        <h1 className="text-3xl font-bold tracking-tight text-navy md:text-4xl">Checkout</h1>
        <p className="-mt-2 text-muted-foreground">
          Guest checkout — no account needed. We&apos;ll call to confirm your order.
        </p>
      </div>

      <Accordion className="rounded-2xl bg-card shadow-soft ring-1 ring-border/60 lg:hidden">
        <AccordionItem value="summary" className="border-none">
          <AccordionTrigger className="items-center px-4 py-4 text-base hover:no-underline">
            <span className="flex flex-1 items-center gap-2 font-semibold text-navy">
              <ShoppingBag className="size-5 text-primary" aria-hidden="true" />
              Order summary · {count} items
            </span>
            <span className="mr-2 font-bold text-navy">{formatPrice(subtotal)}</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 px-4 pb-4">{summary}</AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px] lg:gap-8">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-6 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/60 md:p-8"
          aria-busy={submitting}
        >
          {submitError && (
            <div ref={alertRef}>
              <Notice tone="error" title="We couldn't place your order yet">
                {submitError}
              </Notice>
            </div>
          )}

          {/* Honeypot field — invisible to real users */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-5 text-lg font-bold text-navy">Contact details</legend>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField id="name" label="Full Name" required error={errors.name}>
                <Input
                  {...inputProps('name')}
                  autoComplete="name"
                  placeholder="Ivan Petrov"
                  className={fieldInputClass}
                />
              </FormField>
              <FormField
                id="phone"
                label="Phone"
                required
                error={errors.phone}
                helper="The courier will call this number."
              >
                <Input
                  {...inputProps('phone')}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="088 123 4567"
                  className={fieldInputClass}
                />
              </FormField>
            </div>
            <FormField
              id="email"
              label="Email"
              optional
              error={errors.email}
              helper="For your order confirmation and tracking link."
            >
              <Input
                {...inputProps('email', { optional: true })}
                type="email"
                autoComplete="email"
                placeholder="ivan@example.com"
                className={fieldInputClass}
              />
            </FormField>
          </fieldset>

          <div className="h-px bg-border" aria-hidden="true" />
          <fieldset className="flex flex-col gap-5">
            <legend className="mb-5 text-lg font-bold text-navy">Delivery</legend>
            <FormField
              id="econtOffice"
              label="Econt Office"
              required
              error={errors.econtOffice}
              helper={
                <>
                  Type the city and office name, e.g. &quot;Sofia – Mladost 4&quot;. Find yours at{' '}
                  <a
                    href="https://www.econt.com/en/find-office"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    econt.com
                  </a>
                  .
                </>
              }
            >
              <Input
                {...inputProps('econtOffice')}
                placeholder="Sofia – Mladost 4"
                className={fieldInputClass}
              />
            </FormField>
            <FormField
              id="address"
              label="Or deliver to an address"
              optional
              helper="Leave empty if you pick up from an Econt office."
            >
              <Input
                {...inputProps('address', { optional: true })}
                autoComplete="street-address"
                placeholder="Street, number, city, postcode"
                className={fieldInputClass}
              />
            </FormField>
            <FormField
              id="notes"
              label="Notes"
              optional
              helper="Delivery instructions or questions for us."
            >
              <Textarea
                {...inputProps('notes', { optional: true })}
                rows={4}
                placeholder="e.g. Please call before delivery"
                className={cn(fieldInputClass, 'h-auto min-h-28 py-3')}
              />
            </FormField>
          </fieldset>

          <div className="flex gap-4 rounded-2xl border-2 border-dashed border-success/30 bg-success-soft p-4 md:p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-success">
              <Banknote className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-bold text-navy">Cash/Card on delivery via Econt</p>
              <p className="text-sm leading-relaxed text-foreground/75">
                No online payment. Pay the courier or at the Econt office when you collect your
                parcel. The Econt delivery fee is added at that time.
              </p>
              <div className="mt-1 flex gap-4 text-xs font-semibold text-success">
                <span className="flex items-center gap-1">
                  <Banknote className="size-3.5" aria-hidden="true" /> Cash
                </span>
                <span className="flex items-center gap-1">
                  <CreditCard className="size-3.5" aria-hidden="true" /> Card
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="size-3.5" aria-hidden="true" /> Econt
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" size="xl" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Placing order…
              </>
            ) : (
              <>Place Order · {formatPrice(subtotal)}</>
            )}
          </Button>
          <p className="-mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Lock className="size-3.5" aria-hidden="true" />
            Your details are only used to deliver this order.
          </p>
        </form>

        <aside
          aria-label="Order summary"
          className="sticky top-24 hidden flex-col gap-5 rounded-2xl bg-card p-6 shadow-soft ring-1 ring-border/60 lg:flex"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">Order summary</h2>
            <Link href="/cart" className="text-sm font-semibold text-primary hover:underline">
              Edit cart
            </Link>
          </div>
          {summary}
        </aside>
      </div>
    </div>
  )
}