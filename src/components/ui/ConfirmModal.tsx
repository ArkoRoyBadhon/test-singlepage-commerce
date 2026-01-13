'use client'

import { Button } from '@/components/ui/Button'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { AlertTriangle } from 'lucide-react'
import { Fragment } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'danger',
}: ConfirmModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <div className="flex items-center gap-4">
                  {variant === 'danger' && (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-900/20">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                  )}
                  <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {title}
                  </DialogTitle>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : confirmText}
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
