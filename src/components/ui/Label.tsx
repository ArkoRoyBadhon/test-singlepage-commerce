import clsx from 'clsx'
import React, { forwardRef } from 'react'

export const Label = forwardRef(function Label(
  {
    className,
    required,
    children,
    ...props
  }: {
    className?: string
    required?: boolean
    children?: React.ReactNode
  } & React.ComponentPropsWithoutRef<'label'>,
  ref: React.ForwardedRef<HTMLLabelElement>
) {
  return (
    <label ref={ref} {...props} className={clsx(className, 'block text-sm/6 font-semibold text-zinc-900')}>
      {children}
      {required && (
        <span className="ml-0.5 text-red-600" aria-label="required">
          *
        </span>
      )}
    </label>
  )
})
