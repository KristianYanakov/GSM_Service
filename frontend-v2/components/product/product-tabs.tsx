'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Product } from '@/lib/products'

export function ProductTabs({ product }: { product: Product }) {
  return (
    <Tabs defaultValue="description" className="gap-0">
      <TabsList
        variant="line"
        className="w-full justify-start gap-6 rounded-none border-b bg-transparent p-0 group-data-horizontal/tabs:h-auto"
      >
        {['description', 'details'].map((v) => (
          <TabsTrigger
            key={v}
            value={v}
            className="h-12 flex-none rounded-none px-1 text-base font-semibold capitalize text-muted-foreground after:bg-primary group-data-horizontal/tabs:after:-bottom-px data-active:text-navy"
          >
            {v}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="description" className="pt-6">
        <p className="max-w-3xl leading-relaxed text-pretty text-foreground/80">
          {product.description}
        </p>
      </TabsContent>
      <TabsContent value="details" className="pt-6">
        <dl className="grid max-w-3xl overflow-hidden rounded-2xl ring-1 ring-border sm:grid-cols-2">
          {product.details.map((d) => (
            <div
              key={d.label}
              className="flex justify-between gap-4 border-b bg-card px-4 py-3.5 text-sm odd:bg-background/60 sm:odd:border-r"
            >
              <dt className="text-muted-foreground">{d.label}</dt>
              <dd className="text-right font-semibold text-navy">{d.value}</dd>
            </div>
          ))}
        </dl>
      </TabsContent>
    </Tabs>
  )
}
