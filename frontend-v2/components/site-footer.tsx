import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, Logo } from '@/components/brand'
import { site } from '@/lib/site'

const shopLinks = [
  { href: '/store', label: 'All products' },
  { href: '/store?category=phones', label: 'Phones' },
  { href: '/store?category=cases', label: 'Cases' },
  { href: '/store?category=chargers', label: 'Chargers' },
]

const infoLinks = [
  { href: '/services', label: 'Repair services' },
  { href: '/location', label: 'Visit the shop' },
  { href: '/cart', label: 'Your cart' },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-navy text-navy-foreground">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:py-16 lg:grid-cols-12">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-4">
          <Logo inverted />
          <p className="max-w-xs text-sm leading-relaxed text-navy-foreground/70">
            Phones and accessories delivered with Econt across Bulgaria, plus same-day repairs in
            our Sofia shop.
          </p>
          <div className="flex gap-2">
            <SocialLink href={site.social.facebook} label="Facebook">
              <FacebookIcon className="size-5" />
            </SocialLink>
            <SocialLink href={site.social.instagram} label="Instagram">
              <InstagramIcon className="size-5" />
            </SocialLink>
            <SocialLink href={`mailto:${site.email}`} label="Email">
              <Mail className="size-5" aria-hidden="true" />
            </SocialLink>
          </div>
        </div>

        <FooterLinks title="Shop" links={shopLinks} className="lg:col-span-2" />
        <FooterLinks title="Info" links={infoLinks} className="lg:col-span-2" />

        <div className="col-span-2 flex flex-col gap-4 lg:col-span-4">
          <h2 className="text-sm font-semibold tracking-wide text-navy-foreground/60 uppercase">
            Contact
          </h2>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {site.address.street}, {site.address.city}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={site.phoneHref} className="hover:underline">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="hover:underline">
                {site.email}
              </a>
            </li>
          </ul>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm text-navy-foreground/70">
            {site.hours.map((h) => (
              <div key={h.label} className="contents">
                <dt>{h.label}</dt>
                <dd className="text-navy-foreground">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Delivery with Econt · Cash or card on delivery</p>
        </div>
      </div>
    </footer>
  )
}

function FooterLinks({
  title,
  links,
  className,
}: {
  title: string
  links: { href: string; label: string }[]
  className?: string
}) {
  return (
    <div className={className}>
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-navy-foreground/60 uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex min-h-9 items-center text-sm text-navy-foreground/90 hover:text-primary"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="flex size-11 items-center justify-center rounded-xl bg-navy-foreground/10 transition-colors hover:bg-primary"
    >
      {children}
    </a>
  )
}
