import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Wrench } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="container-page pt-6 pb-10 md:pt-12 md:pb-16">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border/60 md:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
        <div className="order-2 flex flex-col gap-6 lg:order-1">
          <p className="flex w-fit items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">
            <Star className="size-4 fill-current" aria-hidden="true" />
            4.9 from 600+ customers in Sofia
          </p>
          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-navy md:text-5xl lg:text-6xl">
            New phones, smart accessories &amp; repairs <span className="text-primary">while you wait</span>
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground">
            Order online with Econt delivery and pay when it arrives, or bring your phone to our
            Sofia shop — most screens and batteries are fixed in under an hour.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/store" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
              Shop Now
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/services"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
            >
              <Wrench aria-hidden="true" />
              Our Repair Services
            </Link>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted lg:aspect-square">
            <Image
              src="/images/hero-phone.png"
              alt="Latest flagship smartphones in deep navy"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-card/95 p-3 pr-5 shadow-lift backdrop-blur md:bottom-6 md:left-6">
            <span className="flex size-10 items-center justify-center rounded-xl bg-success-soft text-success">
              <Wrench className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-navy">Screen repair</p>
              <p className="text-xs text-muted-foreground">from 59.00 € · 45 min</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
