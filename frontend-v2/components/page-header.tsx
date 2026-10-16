import { Fragment } from 'react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, i) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  render={<Link href={item.href} />}
                  className="font-medium hover:text-primary"
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="line-clamp-1 font-medium text-navy">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {i < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function PageHeader({
  title,
  description,
  crumbs,
  children,
  className,
}: {
  title: React.ReactNode
  description?: string
  crumbs?: Crumb[]
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('container-page flex flex-col gap-3 pt-6 pb-6 md:pt-10 md:pb-8', className)}>
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance text-navy md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-2xl text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-balance text-navy md:text-3xl">
          {title}
        </h2>
        {description && <p className="max-w-xl text-pretty text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
