import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/empty-state'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className="container-page py-10 md:py-20">
      <p className="mb-4 text-center text-sm font-semibold tracking-wide text-primary uppercase">
        Error 404
      </p>
      <EmptyState
        headingLevel="h1"
        image="/images/illustration-404.png"
        title="Page not found"
        description="This page seems to have dropped its signal. It may have moved, or the link might be broken."
        className="mx-auto max-w-2xl"
      >
        <Link href="/" className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}>
          <ArrowLeft aria-hidden="true" />
          Back to Home
        </Link>
        <Link
          href="/store"
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
        >
          <ShoppingBag aria-hidden="true" />
          Go to Store
        </Link>
      </EmptyState>
    </div>
  )
}
