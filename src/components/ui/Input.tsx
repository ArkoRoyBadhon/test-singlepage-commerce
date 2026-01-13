'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef, useState } from 'react'

export function InputGroup({ children }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="control"
      className={clsx(
        'relative isolate block',
        'has-[[data-slot=icon]:first-child]:[&_input]:pl-10 has-[[data-slot=icon]:last-child]:[&_input]:pr-10 sm:has-[[data-slot=icon]:first-child]:[&_input]:pl-8 sm:has-[[data-slot=icon]:last-child]:[&_input]:pr-8',
        '*:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:absolute *:data-[slot=icon]:top-3 *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:top-2.5 sm:*:data-[slot=icon]:size-4',
        '[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5',
        '*:data-[slot=icon]:text-zinc-500'
      )}
    >
      {children}
    </span>
  )
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week']
type DateType = (typeof dateTypes)[number]

export const Input = forwardRef(function Input(
  {
    className,
    type,
    ...props
  }: {
    className?: string
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType
  } & Omit<Headless.InputProps, 'as' | 'className' | 'type'>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        'relative block w-full',
        // Background color + shadow applied to inset pseudo element
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
        // Focus ring - Zinc for neutral premium feel, red for invalid state
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:transition-all after:duration-200 after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-zinc-950/20',
        'has-data-invalid:sm:focus-within:after:ring-red-500/20',
        // Disabled state
        'has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none',
      ])}
    >
      <Headless.Input
        ref={ref}
        {...props}
        type={inputType}
        className={clsx([
          // Date classes
          type &&
            dateTypes.includes(type) && [
              '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
              '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
              '[&::-webkit-datetime-edit]:inline-flex',
              '[&::-webkit-datetime-edit]:p-0',
              '[&::-webkit-datetime-edit-year-field]:p-0',
              '[&::-webkit-datetime-edit-month-field]:p-0',
              '[&::-webkit-datetime-edit-day-field]:p-0',
              '[&::-webkit-datetime-edit-hour-field]:p-0',
              '[&::-webkit-datetime-edit-minute-field]:p-0',
              '[&::-webkit-datetime-edit-second-field]:p-0',
              '[&::-webkit-datetime-edit-millisecond-field]:p-0',
              '[&::-webkit-datetime-edit-meridiem-field]:p-0',
            ],
          // Basic layout - Reduced height on mobile
          'relative block w-full appearance-none rounded-lg py-2 sm:py-[calc(--spacing(2.5)-1px)]',
          isPassword
            ? 'px-3 pr-10 sm:px-[calc(--spacing(3)-1px)] sm:pr-[calc(--spacing(8)-1px)]'
            : 'px-3 sm:px-[calc(--spacing(3)-1px)]',
          // Typography
          'text-sm/6 text-zinc-950 placeholder:text-zinc-400',
          // Border - Lighter default, brand hover/focus integration
          'border border-zinc-200 transition-colors duration-200 data-hover:border-zinc-300',
          // Background color
          'bg-transparent',
          // Hide default focus styles
          'focus:outline-hidden',
          // Invalid state
          'data-invalid:border-red-500 data-invalid:data-hover:border-red-500',
          // Disabled state
          'data-disabled:border-zinc-950/20',
          isPassword && 'pr-4',
        ])}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={clsx(
            'absolute top-1/2 right-3 z-10 -translate-y-1/2 text-zinc-400 transition-colors duration-200 hover:text-zinc-900'
          )}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
        </button>
      )}
    </span>
  )
})
