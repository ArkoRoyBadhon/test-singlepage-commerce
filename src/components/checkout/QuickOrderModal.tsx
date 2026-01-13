'use client'

import { sendOtp } from '@/actions/auth/otp.action'
import { placeGuestOrder } from '@/actions/order/place-order.action'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import React, { Fragment, useEffect, useState } from 'react'

interface ProductData {
  id: number
  title: string
  price: string | number
  image: string
}

interface QuickOrderModalProps {
  isOpen: boolean
  onClose: () => void
  product: ProductData | null
}

export default function QuickOrderModal({ isOpen, onClose, product }: QuickOrderModalProps) {
  const [step, setStep] = useState<'DETAILS' | 'OTP' | 'SUCCESS'>('DETAILS')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // For development only: show OTP in UI
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)

  // Reset state when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setStep('DETAILS')
      setOtp('')
      setError(null)
      setLoading(false)
      setDevOtp(null)
      setOrderId(null)
      // retain formData for convenience? No, maybe clear it?
      // User might want to re-order, but usually we clear.
    }
  }, [isOpen, product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.phone || !formData.address) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    try {
      const res = await sendOtp(formData.phone)
      if (res.success && res.otp) {
        setDevOtp(res.otp) // Show OTP for dev purpose as requested
        setStep('OTP')
        // alert(`OTP Sent: ${res.otp}`) // Fallback if no toast
      } else {
        setError(res.error || 'Failed to send OTP')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!product) return

    setLoading(true)
    try {
      const res = await placeGuestOrder({
        productId: product.id,
        quantity: 1, // Default to 1 for now
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        otp: otp,
      })

      if (res.success) {
        setOrderId(res.orderId || 0)
        setStep('SUCCESS')
      } else {
        setError(res.error || 'Failed to verify OTP and place order')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!product) return null

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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                {/* Close Button */}
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
                      <DialogTitle as="h3" className="mb-4 text-xl leading-6 font-semibold text-gray-900">
                        {step === 'SUCCESS' ? 'Order Successful!' : 'Quick Order'}
                      </DialogTitle>

                      {step !== 'SUCCESS' && (
                        <div className="mb-6 flex items-center gap-4 rounded-lg bg-gray-50 p-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover object-center"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-500">{product.price}</p>
                          </div>
                        </div>
                      )}

                      {/* ERROR MESSAGE */}
                      {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                      {/* STEP 1: DETAILS */}
                      {step === 'DETAILS' && (
                        <form onSubmit={handleDetailSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm leading-6 font-medium text-gray-900">
                              Name
                            </label>
                            <div className="mt-1">
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm leading-6 font-medium text-gray-900">
                              Phone Number
                            </label>
                            <div className="mt-1">
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="017xxxxxxxx"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="address" className="block text-sm leading-6 font-medium text-gray-900">
                              Address
                            </label>
                            <div className="mt-1">
                              <Input
                                id="address"
                                name="address"
                                type="text"
                                required
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Full Address"
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="city" className="block text-sm leading-6 font-medium text-gray-900">
                              City (Optional)
                            </label>
                            <div className="mt-1">
                              <Input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                              />
                            </div>
                          </div>

                          <div className="mt-5 sm:flex sm:flex-row-reverse">
                            <Button
                              type="submit"
                              loading={loading}
                              loadingText="Sending OTP..."
                              className="w-full sm:ml-3 sm:w-auto"
                            >
                              Confirm Order
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-3 w-full sm:mt-0 sm:w-auto"
                              onClick={onClose}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}

                      {/* STEP 2: OTP */}
                      {step === 'OTP' && (
                        <form onSubmit={handleOtpVerify} className="space-y-4">
                          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                            OTP sent to <strong>{formData.phone}</strong>
                            {devOtp && (
                              <div className="mt-1 font-mono text-lg font-bold text-blue-900">Code: {devOtp}</div>
                            )}
                          </div>

                          <div>
                            <label htmlFor="otp" className="block text-sm leading-6 font-medium text-gray-900">
                              Enter OTP
                            </label>
                            <div className="mt-1">
                              <Input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                              />
                            </div>
                          </div>

                          <div className="mt-5 sm:flex sm:flex-row-reverse">
                            <Button
                              type="submit"
                              loading={loading}
                              loadingText="Verifying..."
                              className="w-full sm:ml-3 sm:w-auto"
                            >
                              Verify & Order
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-3 w-full sm:mt-0 sm:w-auto"
                              onClick={() => setStep('DETAILS')}
                            >
                              Back
                            </Button>
                          </div>
                        </form>
                      )}

                      {/* STEP 3: SUCCESS */}
                      {step === 'SUCCESS' && (
                        <div className="py-6 text-center">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <svg
                              className="h-6 w-6 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                          <h3 className="text-base leading-6 font-semibold text-gray-900">
                            Order Placed Successfully!
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            Your order #{orderId} has been confirmed. We will contact you shortly.
                          </p>
                          <div className="mt-6">
                            <Button type="button" className="w-full" onClick={onClose}>
                              Continue Shopping
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
