'use client'

import { ContactMessage } from '@/generated/prisma/client'
import { Eye, Mail, Phone, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../../ui/Button'
import ConfirmModal from '../../ui/ConfirmModal'
import Pagination from '../../ui/pagination'

interface ContactMessagesTableProps {
  messages: ContactMessage[]
  currentPage: number
  totalPages: number
  totalCount: number
}

export default function ContactMessagesTable({
  messages,
  currentPage,
  totalPages,
  totalCount,
}: ContactMessagesTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/dashboard/contact-messages?${params.toString()}`)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    const params = new URLSearchParams(searchParams.toString())
    if (status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    params.set('page', '1')
    router.push(`/dashboard/contact-messages?${params.toString()}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/contact-messages/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Message deleted successfully')
        router.refresh()
      } else {
        toast.error('Failed to delete message')
      }
    } catch (error) {
      toast.error('Failed to delete message')
      console.error('Error deleting message:', error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

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
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 pr-4 pl-10 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => handleStatusFilter('all')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => handleStatusFilter('unread')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'unread' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => handleStatusFilter('read')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === 'read' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className={`hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{message.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm">
                      <a
                        href={`mailto:${message.email}`}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Mail className="h-3 w-3" />
                        {message.email}
                      </a>
                      <a
                        href={`tel:${message.phone}`}
                        className="flex items-center gap-1 text-gray-600 hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        {message.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-sm text-gray-900">{message.subject || 'No subject'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{formatDate(message.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        message.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/contact-messages/${message.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(message.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('page', page.toString())
            router.push(`/dashboard/contact-messages?${params.toString()}`)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        isLoading={isDeleting}
      />
    </div>
  )
}
