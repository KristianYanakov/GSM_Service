import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/components/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { site } from '@/lib/site'
import 'leaflet/dist/leaflet.css'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: `${site.name} – Phones, Accessories & Repairs in Sofia`,
    template: `%s | ${site.name}`,
  },
  description:
    'Shop phones and accessories online with Econt delivery and pay on delivery, or visit our Sofia store for fast phone repairs with warranty.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} bg-background`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:shadow-lift"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <Toaster position="bottom-center" mobileOffset={{ bottom: 96 }} />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
