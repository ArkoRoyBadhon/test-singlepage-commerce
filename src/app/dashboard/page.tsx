import { prisma } from '@/libs/prisma/client'
import { cn } from '@/utils/cn'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // 1. Fetch Summary Stats (Parallelized)
  const [orderStats, productCount, customerCount, recentOrdersData] = await Promise.all([
    // Order Stats: Total revenue (non-cancelled) and Total count
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: {
          not: 'CANCELLED',
        },
      },
    }),
    // Product Count
    prisma.product.count(),
    // Customer Count (Role = USER)
    prisma.user.count({
      where: { role: 'USER' },
    }),
    // Recent Orders
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ])

  const totalRevenue = orderStats._sum.totalAmount ? Number(orderStats._sum.totalAmount) : 0
  const totalOrders = orderStats._count.id

  const stats = [
    {
      name: 'Total Revenue',
      value: `৳ ${totalRevenue.toLocaleString()}`,
      // change: '+12.5%', // TODO: Calculate actual change if needed
      icon: DollarSign,
      color: 'green',
    },
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      // change: '+5.2%',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      name: 'Total Products',
      value: productCount.toString(),
      // change: '0%',
      icon: Package,
      color: 'purple',
    },
    {
      name: 'Total Customers',
      value: customerCount.toString(),
      // change: '+8.1%',
      icon: Users,
      color: 'orange',
    },
  ]

  const getIconColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'blue':
        return 'text-[#15803d] bg-[#15803d]/10 dark:bg-[#15803d]/30 dark:text-[#4ade80]'
      case 'purple':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400'
      case 'orange':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div
                  className={cn('flex h-12 w-12 items-center justify-center rounded-lg', getIconColorClass(stat.color))}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              {/* <div className="mt-4 flex items-center text-sm">
                                <span className="flex items-center font-medium text-green-600 dark:text-green-400">
                                    <ArrowUpRight className="mr-1 h-4 w-4" />
                                    {stat.change}
                                </span>
                                <span className="ml-2 text-gray-500 dark:text-gray-400">from last month</span>
                            </div> */}
            </div>
          )
        })}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-secondary-color text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrdersData.map((order) => (
                <tr
                  key={order.id}
                  className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">#{order.id}</td>
                  <td className="px-6 py-4">{order.user?.name || order.name || 'Guest'}</td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">৳ {Number(order.totalAmount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        order.status === 'DELIVERED' &&
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                        (order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'SHIPPED') &&
                          'bg-[#15803d]/10 text-[#15803d] dark:bg-[#15803d]/30 dark:text-[#4ade80]',
                        order.status === 'RETURNED' &&
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                        order.status === 'CANCELLED' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrdersData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
