'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import { Logo } from '@/components/brand'
import { MobileNav } from '@/components/mobile-nav'
import { useCart } from '@/components/cart-provider'
import { buttonVariants } from '@/components/ui/button'
import { navLinks, site } from '@/lib/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-18">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative rounded-lg px-4 py-2 text-[15px] font-medium text-muted-foreground transition-colors outline-none hover:bg-secondary hover:text-navy focus-visible:ring-4 focus-visible:ring-ring/30',
                      active && 'text-navy after:absolute after:inset-x-4 after:-bottom-[15px] after:h-0.5 after:rounded-full after:bg-primary md:after:-bottom-[19px]',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <a
            href={site.phoneHref}
            className="hidden text-sm font-semibold text-navy hover:text-primary lg:block"
          >
            {site.phone}
          </a>
          <CartButton count={count} />
          <MobileNav count={count} />
        </div>
      </div>
    </header>
  )
}

function CartButton({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative')}
    >
      <ShoppingBag className="size-5.5" aria-hidden="true" />
      {count > 0 && (
        <span className="absolute top-1 right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-primary-foreground ring-2 ring-card">
          {count}
        </span>
      )}
    </Link>
  )
}
