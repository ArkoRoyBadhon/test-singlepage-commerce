'use client'

import { ContactMessage } from '@/generated/prisma/client'
import { Mail, Phone } from 'lucide-react'

interface ContactMessageDetailsProps {
  message: ContactMessage
}

export default function ContactMessageDetails({ message }: ContactMessageDetailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{message.subject || 'No Subject'}</h1>
          <p className="mt-1 text-sm text-gray-500">{formatDate(message.createdAt)}</p>
        </div>

        {/* Sender Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{message.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <a href={`mailto:${message.email}`} className="mt-1 flex items-center gap-2 text-blue-600 hover:underline">
              <Mail className="h-4 w-4" />
              {message.email}
            </a>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mobile Number</label>
            <a href={`tel:${message.phone}`} className="mt-1 flex items-center gap-2 text-gray-900 hover:underline">
              <Phone className="h-4 w-4" />
              {message.phone}
            </a>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  message.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {message.isRead ? 'Read' : 'Unread'}
              </span>
            </p>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium text-gray-700">Message</label>
          <div className="mt-2 rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-gray-900">{message.message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
