'use client'

import { deleteOrder, updateOrderStatus } from '@/actions/order/manage-order.action'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { toast } from 'sonner' // Or standard alert/toast
import OrderDetailsModal from './OrderDetailsModal'

import { Order, OrderItem, OrderStatus, Product } from '@/generated/prisma/client'

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product | null
  })[]
}

interface OrderTableProps {
  orders: OrderWithItems[]
}

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']

export default function OrderTable({ orders: initialOrders }: OrderTableProps) {
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    // Optimistic update
    const previousOrders = [...orders]
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o)))

    try {
      const res = await updateOrderStatus(orderId, newStatus as OrderStatus)
      if (!res.success) {
        throw new Error(res.error)
      }
      toast.success('Order status updated')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update status')
      setOrders(previousOrders) // Revert
    }
  }

  const handleDeleteClick = (orderId: number) => {
    setOrderToDelete(orderId)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteOrder(orderToDelete)
      if (res.success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderToDelete))
        toast.success('Order deleted successfully')
        setIsDeleteOpen(false)
      } else {
        toast.error('Failed to delete order')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleViewOrder = (order: OrderWithItems) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-100"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 dark:text-white">
                      #{order.id}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                      <div className="font-medium text-gray-900 dark:text-white">{order.name}</div>
                      <div className="text-xs text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                      ৳ {order.totalAmount.toString()}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`block w-full rounded-md border-0 py-1.5 pr-8 pl-3 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-[#15803d] sm:text-xs sm:leading-6 ${
                          order.status === 'DELIVERED'
                            ? 'bg-green-50 text-green-700 ring-green-600/20'
                            : order.status === 'CANCELLED'
                              ? 'bg-red-50 text-red-700 ring-red-600/20'
                              : 'bg-white'
                        }`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-[#15803d] hover:text-[#116630] dark:text-[#4ade80] dark:hover:text-[#22c55e]"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(order.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Order"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="p-10 text-center text-gray-500">No orders found.</div>}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
        isLoading={isDeleting}
      />

      <OrderDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} order={selectedOrder} />
    </div>
  )
}
