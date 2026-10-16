import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Search, Smartphone, Wrench, PackageCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Breadcrumbs, SectionHeading } from '@/components/page-header'
import { ServicesCatalog } from '@/components/services/services-catalog'
import { Faq } from '@/components/services/faq'
import { ContactBanner } from '@/components/contact-banner'
import { TrustBar } from '@/components/trust-bar'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Phone Repair Services',
  description:
    'Fast, reliable phone repairs in Sofia: screens, batteries, charging ports, water damage and software. Free diagnosis and 6-month warranty.',
}

const steps = [
  { icon: Smartphone, title: 'Bring your phone', text: 'Walk in — no appointment needed.' },
  { icon: Search, title: 'Diagnosis', text: 'Free check and a fixed price before we start.' },
  { icon: Wrench, title: 'Repair', text: 'Quality parts fitted by certified technicians.' },
  { icon: PackageCheck, title: 'Pick up', text: 'Tested, cleaned and covered by 6-month warranty.' },
]

export default function ServicesPage() {
  return (
    <>
      <section className="container-page pt-6 pb-10 md:pt-10 md:pb-14">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Services' }]} className="mb-5" />
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border/60 md:p-10 lg:grid-cols-[1.1fr_1fr] lg:p-12">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">Repair services</p>
            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-balance text-navy md:text-5xl">
              Fast, reliable phone repairs
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground">
              Cracked screen, tired battery or a port that won&apos;t charge? Most repairs are done
              the same day in our Sofia workshop, with a free diagnosis and upfront prices.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={site.phoneHref} className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
                <Phone aria-hidden="true" />
                Call Us
              </a>
              <Link
                href="/location"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
              >
                <MapPin aria-hidden="true" />
                Visit the Shop
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/images/shop-2.png"
              alt="Technician repairing an opened smartphone on a workbench"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="container-page flex flex-col gap-6 py-14 md:gap-8 md:py-20">
        <SectionHeading
          eyebrow="Price list"
          title="What we repair"
          description="All prices include parts and labor. Final price confirmed after free diagnosis."
        />
        <ServicesCatalog />
      </section>

      <section className="bg-card py-14 md:py-20">
        <div className="container-page flex flex-col gap-8 md:gap-10">
          <SectionHeading eyebrow="How it works" title="From broken to fixed in four steps" />
          <ol className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="relative flex flex-col gap-4 rounded-2xl bg-background p-5 ring-1 ring-border/60 md:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-navy text-navy-foreground">
                    <s.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="text-4xl font-extrabold text-navy/10" aria-hidden="true">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions before you visit"
          description="Can't find your answer? Give us a call — we're happy to help."
        />
        <Faq />
      </section>

      <ContactBanner
        title="Need a repair today?"
        description={`Call ${site.phone} to check part availability, or just walk in during opening hours.`}
      />
    </>
  )
}
