import type { Metadata } from 'next'
import { OrderView } from '@/components/order/order-view'
import { orderSteps, type OrderStatus } from '@/components/order/status-timeline'

export const metadata: Metadata = { title: 'Order confirmation', robots: { index: false } }

const validStatuses: string[] = [...orderSteps.map((s) => s.key), 'cancelled']

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ status?: string }>
}) {
  const { id } = await params
  const { status } = await searchParams
  const statusOverride = validStatuses.includes(status ?? '')
    ? (status as OrderStatus)
    : undefined

  return <OrderView id={id.replace(/[^\w-]/g, '')} statusOverride={statusOverride} />
}