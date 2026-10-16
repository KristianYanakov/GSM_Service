'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ProductCard } from '@/components/product-card'
import { EmptyState } from '@/components/empty-state'
import { Notice } from '@/components/notice'
import {
  CategorySelect,
  FilterField,
  SortSelect,
  TypeToggle,
  categoryOptions,
  type Filters,
} from '@/components/store/filter-controls'
import { getCategories, getProducts } from '@/lib/api/catalog'
import { adaptApiProduct, products as fallbackProducts, type Product } from '@/lib/products'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 8
const defaults: Filters = { category: 'all', type: 'all', sort: 'newest' }

export function StoreCatalog({ initialCategory }: { initialCategory?: string }) {
  const [filters, setFilters] = useState<Filters>({
    ...defaults,
    category: initialCategory || 'all',
  })
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [catOptions, setCatOptions] = useState(categoryOptions)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    getCategories()
      .then((cats) => {
        if (cats.length > 0) {
          setCatOptions([
            { value: 'all', label: 'All categories' },
            ...cats.map((c) => ({ value: c.slug, label: c.name })),
          ])
        }
      })
      .catch(() => {
        // Keep static fallback category options
      })
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    const apiParams: Record<string, string | undefined> = {}
    if (filters.category !== 'all') apiParams.category = filters.category
    if (filters.type === 'phones') apiParams.type = 'phone'
    if (filters.type === 'accessories') apiParams.type = 'accessory'

    getProducts(apiParams)
      .then((res) => {
        if (!active) return
        setAllProducts(res.results.map((p, idx) => adaptApiProduct(p, idx)))
      })
      .catch(() => {
        if (!active) return
        setError('Failed to load products from server. Showing catalog preview.')
        setAllProducts(fallbackProducts)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [filters.category, filters.type])

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(1)
  }
  const clear = () => {
    setFilters(defaults)
    setPage(1)
  }

  const results = useMemo(() => {
    const list = allProducts.filter((p) => {
      if (filters.category !== 'all' && p.categorySlug !== filters.category && p.category.toLowerCase() !== filters.category) {
        return false
      }
      if (filters.type === 'phones' && p.type !== 'phone') return false
      if (filters.type === 'accessories' && p.type !== 'accessory') return false
      return true
    })
    return [...list].sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price
      if (filters.sort === 'price-desc') return b.price - a.price
      return b.addedAt.localeCompare(a.addedAt) || b.id - a.id
    })
  }, [allProducts, filters])

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeCount = Number(filters.category !== 'all') + Number(filters.type !== 'all')

  return (
    <div className="container-page flex flex-col gap-6 pb-16 md:pb-24">
      <div className="hidden flex-wrap items-end justify-between gap-4 rounded-2xl bg-card p-4 shadow-soft ring-1 ring-border/60 md:flex">
        <div className="flex flex-wrap items-end gap-4">
          <FilterField label="Category" htmlFor="category-desktop">
            <CategorySelect
              id="category-desktop"
              options={catOptions}
              value={filters.category}
              onChange={(category) => update({ category })}
            />
          </FilterField>
          <FilterField label="Product type">
            <TypeToggle value={filters.type} onChange={(type) => update({ type })} />
          </FilterField>
        </div>
        <FilterField label="Sort by" htmlFor="sort-desktop">
          <SortSelect id="sort-desktop" value={filters.sort} onChange={(sort) => update({ sort })} />
        </FilterField>
      </div>

      <div className="flex items-center gap-3 md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<Button variant="outline" className="flex-1" />}>
            <SlidersHorizontal aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] gap-0 rounded-t-3xl bg-card p-0">
            <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border" aria-hidden="true" />
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <SheetTitle className="text-xl font-bold text-navy">Filters</SheetTitle>
            </div>
            <div className="flex flex-col gap-5 overflow-y-auto px-5 py-4">
              <FilterField label="Product type">
                <TypeToggle
                  className="w-full"
                  value={filters.type}
                  onChange={(type) => update({ type })}
                />
              </FilterField>
              <FilterField label="Category" htmlFor="category-mobile">
                <CategorySelect
                  id="category-mobile"
                  options={catOptions}
                  value={filters.category}
                  onChange={(category) => update({ category })}
                />
              </FilterField>
              <FilterField label="Sort by" htmlFor="sort-mobile">
                <SortSelect
                  id="sort-mobile"
                  value={filters.sort}
                  onChange={(sort) => update({ sort })}
                />
              </FilterField>
            </div>
            <div className="flex gap-3 border-t p-4">
              <Button variant="outline" size="lg" className="flex-1" onClick={clear}>
                Clear all
              </Button>
              <Button size="lg" className="flex-[2]" onClick={() => setSheetOpen(false)}>
                Show {results.length} {results.length === 1 ? 'result' : 'results'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {error && (
        <Notice tone="warning" title="Connection Notice">
          {error}
        </Notice>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold text-navy">{results.length}</span>{' '}
          {results.length === 1 ? 'product' : 'products'}
        </p>
        {activeCount > 0 && (
          <Button variant="link" size="sm" onClick={clear}>
            <X aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          image="/images/illustration-no-results.png"
          title="No products found"
          description="We couldn't find anything matching these filters. Try another category or clear the filters to see everything."
        >
          <Button size="lg" onClick={clear}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {visible.map((p) => (
              <li key={p.slug} className="flex">
                <ProductCard product={p} className="w-full" />
              </li>
            ))}
          </ul>
          {pageCount > 1 && <Pager page={page} pageCount={pageCount} onChange={setPage} />}
        </>
      )}
    </div>
  )
}

function Pager({
  page,
  pageCount,
  onChange,
}: {
  page: number
  pageCount: number
  onChange: (p: number) => void
}) {
  const go = (p: number) => {
    onChange(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          variant={n === page ? 'navy' : 'ghost'}
          size="icon"
          aria-current={n === page ? 'page' : undefined}
          aria-label={`Page ${n}`}
          onClick={() => go(n)}
          className={cn(n !== page && 'text-muted-foreground')}
        >
          {n}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => go(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </nav>
  )
}