import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { StoreCatalog } from '@/components/store/store-catalog'

export const metadata: Metadata = {
  title: 'Store',
  description: 'Phones, cases, chargers and accessories with Econt delivery and pay on delivery.',
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  return (
    <>
      <PageHeader
        title="Store"
        description="Phones and accessories delivered with Econt. Pay with cash or card when your order arrives."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Store' }]}
      />
      <StoreCatalog key={category ?? 'all'} initialCategory={category} />
    </>
  )
}
