'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

interface OtpVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  phone: string
  onVerify: (otp: string) => Promise<void>
  isVerifying: boolean
  devOtp?: string | null // For development display
}

export default function OtpVerificationModal({
  isOpen,
  onClose,
  phone,
  onVerify,
  isVerifying,
  devOtp,
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onVerify(otp)
  }

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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
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
                        Verify Phone Number
                      </DialogTitle>

                      <div className="mb-4 rounded-md bg-[#15803d]/10 p-3 text-sm text-[#15803d]">
                        OTP sent to <strong>{phone}</strong>
                        {devOtp && (
                          <div className="mt-1 font-mono text-lg font-bold text-[#15803d]">Code: {devOtp}</div>
                        )}
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
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
                              className="text-center text-lg tracking-widest"
                              autoFocus
                            />
                          </div>
                        </div>

                        <div className="mt-5 sm:flex sm:flex-row-reverse">
                          <Button
                            type="submit"
                            loading={isVerifying}
                            loadingText="Verifying..."
                            className="w-full sm:ml-3 sm:w-auto"
                          >
                            Verify & Order
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
