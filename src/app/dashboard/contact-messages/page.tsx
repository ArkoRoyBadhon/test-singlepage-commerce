import ContactMessagesTable from '@/components/dashboard/ContactMessages/ContactMessagesTable'
import { prisma } from '@/libs/prisma/client'

export const dynamic = 'force-dynamic'

interface SearchParams {
  page?: string
  search?: string
  status?: string
}

interface ContactMessagesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ContactMessagesPage({ searchParams }: ContactMessagesPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const search = params.search || ''
  const status = params.status || 'all'
  const pageSize = 10

  // Build where clause
  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { phone: { contains: search, mode: 'insensitive' as const } },
              { subject: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {},
      status === 'read' ? { isRead: true } : status === 'unread' ? { isRead: false } : {},
    ],
  }

  // Fetch messages with pagination
  const [messages, totalCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-sm text-gray-600">View and manage messages from customers</p>
      </div>

      <ContactMessagesTable messages={messages} currentPage={page} totalPages={totalPages} totalCount={totalCount} />
    </div>
  )
}
