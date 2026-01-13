import { getOrders } from '@/actions/order/manage-order.action'
import OrderFilters from '@/components/dashboard/orders/OrderFilters'
import OrderTable from '@/components/dashboard/orders/OrderTable'
import { OrderStatus } from '@/generated/prisma/client'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : undefined
  const status =
    typeof params.status === 'string' && Object.values(OrderStatus).includes(params.status as OrderStatus)
      ? (params.status as OrderStatus)
      : undefined

  const { data: orders, success, error } = await getOrders({ search, status })

  if (!success) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-2 text-gray-500">{error || 'Failed to load orders.'}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">View and process customer orders here.</p>
        </div>
      </div>

      <OrderFilters />

      <OrderTable orders={orders || []} />
    </div>
  )
}
