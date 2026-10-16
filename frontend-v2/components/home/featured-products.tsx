'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { SectionHeading } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { getProducts } from '@/lib/api/catalog'
import { adaptApiProduct, products as fallbackProducts, type Product } from '@/lib/products'

export function FeaturedProducts() {
  const [items, setItems] = useState<Product[]>(fallbackProducts.slice(0, 4))

  useEffect(() => {
    getProducts({ featured: true })
      .then((res) => {
        if (res.results.length > 0) {
          const adapted = res.results.map((p, idx) => adaptApiProduct(p, idx))
          const featuredList = adapted.filter((p) => p.featured)
          setItems((featuredList.length > 0 ? featuredList : adapted).slice(0, 4))
        }
      })
      .catch(() => {
        // Keep fallback featured products
      })
  }, [])

  return (
    <section className="bg-card py-14 md:py-20">
      <div className="container-page flex flex-col gap-6 md:gap-8">
        <SectionHeading
          eyebrow="Featured"
          title="Popular this week"
          action={
            <Link href="/store" className={buttonVariants({ variant: 'link' })}>
              View all products
              <ArrowRight aria-hidden="true" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} showStock={false} />
          ))}
        </div>
      </div>
    </section>
  )
}