'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Clock, Menu, Phone, ShoppingBag } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { Logo } from '@/components/brand'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

const drawerLinks = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Store' },
  { href: '/services', label: 'Services' },
  { href: '/location', label: 'Location' },
]

export function MobileNav({ count }: { count: number }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
        aria-label="Open menu"
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 bg-card p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-sm [&>[data-slot=sheet-close]]:top-3.5 [&>[data-slot=sheet-close]]:right-4 [&>[data-slot=sheet-close]]:size-11"
      >
        <div className="flex h-16 items-center border-b px-4">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo />
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-1">
            {drawerLinks.map((link) => {
              const active =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-14 items-center justify-between rounded-xl px-4 text-lg font-semibold text-navy transition-colors hover:bg-secondary',
                      active && 'bg-accent text-accent-foreground',
                    )}
                  >
                    {link.label}
                    <ChevronRight className="size-5 opacity-50" aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
            <li>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex min-h-14 items-center justify-between rounded-xl px-4 text-lg font-semibold text-navy transition-colors hover:bg-secondary',
                  pathname === '/cart' && 'bg-accent text-accent-foreground',
                )}
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="size-5" aria-hidden="true" />
                  Cart
                </span>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
                  {count}
                  <span className="sr-only"> items</span>
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex flex-col gap-3 border-t bg-background p-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" aria-hidden="true" />
            Mon–Fri {site.hours[0].value} · Sat {site.hours[1].value}
          </p>
          <a href={site.phoneHref} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>
            <Phone aria-hidden="true" />
            Call {site.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
