import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { FacebookIcon, InstagramIcon } from '@/components/brand'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

export function ContactBanner({
  title,
  description,
  variant = 'hours',
}: {
  title: string
  description: string
  variant?: 'hours' | 'social'
}) {
  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="flex flex-col gap-8 overflow-hidden rounded-3xl bg-navy p-6 text-navy-foreground md:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-balance md:text-4xl">{title}</h2>
          <p className="text-pretty text-navy-foreground/70">{description}</p>
          {variant === 'hours' ? (
            <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {site.hours.map((h) => (
                <div key={h.label} className="flex gap-2">
                  <dt className="flex items-center gap-1.5 text-navy-foreground/60">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {h.label}
                  </dt>
                  <dd className="font-semibold">{h.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="mt-2 flex gap-2">
              {[
                { href: site.social.facebook, label: 'Facebook', icon: <FacebookIcon className="size-5" /> },
                { href: site.social.instagram, label: 'Instagram', icon: <InstagramIcon className="size-5" /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex size-11 items-center justify-center rounded-xl bg-navy-foreground/10 transition-colors hover:bg-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a href={site.phoneHref} className={cn(buttonVariants({ size: 'xl' }), 'w-full sm:w-auto')}>
            <Phone aria-hidden="true" />
            {site.phone}
          </a>
          {variant === 'hours' ? (
            <Link
              href="/location"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'xl' }),
                'w-full border-navy-foreground/25 bg-transparent text-navy-foreground hover:border-navy-foreground/50 hover:bg-navy-foreground/10 sm:w-auto',
              )}
            >
              <MapPin aria-hidden="true" />
              Visit the Shop
            </Link>
          ) : (
            <a
              href={`mailto:${site.email}`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'xl' }),
                'w-full border-navy-foreground/25 bg-transparent text-navy-foreground hover:border-navy-foreground/50 hover:bg-navy-foreground/10 sm:w-auto',
              )}
            >
              <Mail aria-hidden="true" />
              {site.email}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
