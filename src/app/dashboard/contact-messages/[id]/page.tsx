import ContactMessageDetails from '@/components/dashboard/ContactMessages/ContactMessageDetails'
import { prisma } from '@/libs/prisma/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface ContactMessagePageProps {
  params: Promise<{ id: string }>
}

export default async function ContactMessagePage({ params }: ContactMessagePageProps) {
  const { id } = await params

  const message = await prisma.contactMessage.findUnique({
    where: { id: Number(id) },
  })

  if (!message) {
    notFound()
  }

  // Mark as read if not already
  if (!message.isRead) {
    await prisma.contactMessage.update({
      where: { id: Number(id) },
      data: { isRead: true },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-messages" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </Link>
      </div>

      <ContactMessageDetails message={message} />
    </div>
  )
}
