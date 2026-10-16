'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ServiceCard } from '@/components/service-card'
import { SectionHeading } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import { getServices } from '@/lib/api/services'
import { adaptApiService, services as fallbackServices, type Service } from '@/lib/services'

export function ServicesHighlight() {
  const [items, setItems] = useState<Service[]>(fallbackServices.filter((s) => s.featured).slice(0, 3))

  useEffect(() => {
    getServices()
      .then((apiServices) => {
        if (apiServices.length > 0) {
          const adapted = apiServices.map((s, idx) => adaptApiService(s, idx))
          const featured = adapted.filter((s) => s.featured)
          setItems((featured.length > 0 ? featured : adapted).slice(0, 3))
        }
      })
      .catch(() => {
        // Keep static highlights if API is unreachable
      })
  }, [])

  return (
    <section className="container-page flex flex-col gap-6 py-14 md:gap-8 md:py-20">
      <SectionHeading
        eyebrow="Repairs"
        title="Broken phone? Fixed today."
        description="Free diagnosis, upfront prices and a 6-month warranty on every repair."
        action={
          <Link href="/services" className={buttonVariants({ variant: 'link' })}>
            See all services
            <ArrowRight aria-hidden="true" />
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {items.map((s) => (
          <ServiceCard key={s.id ?? s.name} {...s} />
        ))}
      </div>
    </section>
  )
}