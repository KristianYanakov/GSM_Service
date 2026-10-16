'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ServiceCard, resolveServiceIcon } from '@/components/service-card'
import { Notice } from '@/components/notice'
import { getServiceCategories, getServices } from '@/lib/api/services'
import {
  adaptApiService,
  serviceCategories as fallbackCategories,
  services as fallbackServices,
  type Service,
} from '@/lib/services'

export function ServicesCatalog() {
  const [items, setItems] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getServices(), getServiceCategories().catch(() => [])])
      .then(([srvRes, catRes]) => {
        if (!active) return
        const adapted = srvRes.map((s, idx) => adaptApiService(s, idx))
        setItems(adapted)

        const derivedCats = Array.from(new Set(adapted.map((s) => s.category)))
        const apiCatNames = catRes.map((c) => c.name)
        const combined = Array.from(new Set([...apiCatNames, ...derivedCats])).filter(Boolean)
        setCategories(combined.length > 0 ? combined : fallbackCategories)
      })
      .catch(() => {
        if (!active) return
        setError('Could not load live services from server. Showing standard price list.')
        setItems(fallbackServices)
        setCategories(fallbackCategories)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const tabs = useMemo(() => ['All', ...categories], [categories])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Notice tone="warning" title="Service Catalog Notice">
          {error}
        </Notice>
      )}
      <Tabs defaultValue="All" className="gap-6">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <TabsList className="h-auto gap-2 rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-auto">
            {tabs.map((t) => {
              const Icon = t === 'All' ? null : resolveServiceIcon(t)
              return (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="h-11 flex-none gap-2 rounded-full border-border bg-card px-4 text-sm font-semibold text-navy ring-1 ring-border hover:bg-secondary data-active:bg-navy data-active:text-navy-foreground data-active:ring-navy"
                >
                  {Icon && <Icon className="size-4" aria-hidden="true" />}
                  {t}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
        {tabs.map((t) => (
          <TabsContent key={t} value={t}>
            <ul className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {items
                .filter((s) => t === 'All' || s.category === t)
                .map((s) => (
                  <li key={s.id ?? s.name} className="flex">
                    <ServiceCard {...s} className="w-full" />
                  </li>
                ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}