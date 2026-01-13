'use client'

import { Button } from '@/components/ui/Button' // Adjust path if needed
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment } from 'react'

import { Order, OrderItem, Product } from '@/generated/prisma/client'

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product | null
  })[]
}

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderWithItems | null
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!order) return null

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-opacity-75 fixed inset-0 bg-black/50 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="mb-2 text-xl leading-6 font-semibold text-gray-900">
                        Order #{order.id} Details
                      </DialogTitle>

                      <div className="mb-6 grid grid-cols-1 gap-4 border-b pb-4 text-sm text-gray-500 sm:grid-cols-2">
                        <div>
                          <span className="block font-semibold text-gray-900">Customer:</span>
                          {order.name} <br />
                          {order.phone}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">Address:</span>
                          {order.address}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">Date:</span>
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                        <div>
                          <span className="block font-semibold text-gray-900">Status:</span>
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              order.status === 'DELIVERED'
                                ? 'bg-green-50 text-green-700 ring-green-600/20'
                                : order.status === 'CANCELLED'
                                  ? 'bg-red-50 text-red-700 ring-red-600/20'
                                  : order.status === 'PENDING'
                                    ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                    : 'bg-[#15803d]/10 text-[#15803d] ring-[#15803d]/20'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <h4 className="mb-3 font-medium text-gray-900">Items</h4>
                      <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between gap-x-6 px-4 py-5">
                            <div className="flex min-w-0 gap-x-4">
                              {item.product?.image && (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.title}
                                  width={48}
                                  height={48}
                                  className="h-12 w-12 flex-none rounded-md bg-gray-50 object-cover"
                                />
                              )}
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm leading-6 font-semibold text-gray-900">
                                  {item.product?.title || 'Product Deleted'}
                                </p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                              <p className="text-sm leading-6 font-medium text-gray-900">৳ {item.price.toString()}</p>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex justify-end border-t pt-4">
                        <p className="text-lg font-bold text-gray-900">Total: ৳ {order.totalAmount.toString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button type="button" onClick={onClose} className="w-full sm:w-auto">
                    Close
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
