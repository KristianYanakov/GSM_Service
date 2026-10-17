'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProduct, type Product } from '@/lib/products'

type CartLine = { product: Product; qty: number }
export type CartItem = { product: Product; qty: number; lineTotal: number }

export type Customer = {
  name: string
  phone: string
  email?: string
  econtOffice?: string
  address?: string
  notes?: string
}

export type PlacedOrder = {
  id: string
  items: CartItem[]
  total: number
  customer: Customer
  placedAt: string
}

type CartContextValue = {
  lastOrder: PlacedOrder | null
  setLastOrder: (order: PlacedOrder | null) => void
  items: CartItem[]
  count: number
  subtotal: number
  add: (productOrSlug: Product | string, qty?: number) => boolean
  setQty: (slug: string, qty: number) => void
  remove: (slug: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const MAX_QTY = 10
const STORAGE_KEY = 'gsm_shop_cart_v2'

export function getMaxAllowedQty(product: Product): number {
  if (typeof product.stockQuantity === 'number' && product.stockQuantity > 0) {
    return Math.min(MAX_QTY, product.stockQuantity)
  }
  return MAX_QTY
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setLines(parsed)
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Ignore storage errors
    }
  }, [lines, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const items: CartItem[] = lines.map((line) => ({
      product: line.product,
      qty: line.qty,
      lineTotal: line.product.price * line.qty,
    }))
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)

    return {
      lastOrder,
      setLastOrder,
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      subtotal,
      add: (productOrSlug, qty = 1) => {
        const product =
          typeof productOrSlug === 'string' ? getProduct(productOrSlug) : productOrSlug
        if (!product || !product.inStock || product.stockQuantity <= 0) return false

        const maxAllowed = getMaxAllowedQty(product)
        const existing = lines.find((l) => l.product.slug === product.slug)

        if (existing && existing.qty >= maxAllowed) {
          return false
        }

        setLines((prev) => {
          const curr = prev.find((l) => l.product.slug === product.slug)
          if (curr) {
            return prev.map((l) =>
              l.product.slug === product.slug
                ? { ...l, product, qty: Math.min(maxAllowed, l.qty + qty) }
                : l,
            )
          }
          return [...prev, { product, qty: Math.min(maxAllowed, qty) }]
        })
        return true
      },
      setQty: (slug, qty) =>
        setLines((prev) =>
          prev.map((l) => {
            if (l.product.slug !== slug) return l
            const maxAllowed = getMaxAllowedQty(l.product)
            return { ...l, qty: Math.max(1, Math.min(maxAllowed, qty)) }
          }),
        ),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.product.slug !== slug)),
      clear: () => setLines([]),
    }
  }, [lines, lastOrder])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export { MAX_QTY }