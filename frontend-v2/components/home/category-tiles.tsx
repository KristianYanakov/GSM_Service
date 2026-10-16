'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/page-header'
import { getCategories } from '@/lib/api/catalog'
import { adaptApiCategory, categories as fallbackCategories, type CategoryTile } from '@/lib/products'

export function CategoryTiles() {
  const [tiles, setTiles] = useState<CategoryTile[]>(fallbackCategories)

  useEffect(() => {
    getCategories()
      .then((apiCats) => {
        if (apiCats.length > 0) {
          setTiles(apiCats.map(adaptApiCategory))
        }
      })
      .catch(() => {
        // Keep static fallback tiles
      })
  }, [])

  return (
    <section className="container-page flex flex-col gap-6 py-14 md:gap-8 md:py-20">
      <SectionHeading eyebrow="Shop by category" title="Find what your phone needs" />
      <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {tiles.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/store?category=${c.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-muted shadow-soft outline-none ring-1 ring-border/60 transition-shadow hover:shadow-lift focus-visible:ring-4 focus-visible:ring-ring/40 md:aspect-[3/4]"
            >
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="relative m-2 flex items-center justify-between gap-2 rounded-xl bg-card/95 p-3 backdrop-blur md:m-3 md:p-4">
                <div className="leading-tight">
                  <p className="font-bold text-navy md:text-lg">{c.name}</p>
                  <p className="text-xs text-muted-foreground md:text-sm">{c.blurb}</p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-navy transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="size-4.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}