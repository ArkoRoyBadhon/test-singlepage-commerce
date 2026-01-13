'use client'

import { Button } from '@/components'

interface EmailConfirmationMessageProps {
  email: string
  onBack: () => void
}

const EmailConfirmationMessage = ({ email, onBack }: EmailConfirmationMessageProps) => {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center">
        <svg className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-center text-2xl font-semibold text-blue-700">Check your email</h3>

      {/* Description */}
      <p className="mb-4 text-center text-sm text-blue-700">
        We&apos;ve sent a verification link to <strong className="font-semibold">{email}</strong>
      </p>

      <p className="mb-6 text-center text-xs text-blue-600">
        Please verify your email to continue. Didn&apos;t receive the email? Check your spam folder or try resending.
      </p>

      {/* Buttons */}
      <div>
        <Button variant="outline" onClick={onBack} className="w-full">
          Back to Login
        </Button>
      </div>
    </div>
  )
}

export default EmailConfirmationMessage
