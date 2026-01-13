'use client'

import { Button } from '@/components'

interface RegistrationSuccessMessageProps {
  onDismiss?: () => void
}

const RegistrationSuccessMessage = ({ onDismiss }: RegistrationSuccessMessageProps) => {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center">
        <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-center text-2xl font-semibold text-green-700">Thank you for signing up!</h3>

      {/* Description */}
      <p className="mb-6 text-center text-sm text-green-700">Please check your email to confirm your account.</p>

      {/* Button */}
      {onDismiss && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onDismiss}>
            Got it
          </Button>
        </div>
      )}
    </div>
  )
}

export default RegistrationSuccessMessage
