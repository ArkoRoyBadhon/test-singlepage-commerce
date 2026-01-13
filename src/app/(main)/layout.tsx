import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/Header'
import { prisma } from '@/libs/prisma/client'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'দেশি',
  description: 'সততা, যত্ন এবং গ্রাহক সন্তুষ্টিকে সর্বোচ্চ গুরুত্ব দিয়ে আমরা প্রতিদিন কাজ করে যাচ্ছি',
}

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSetting.findFirst()

  return (
    <>
      <Header logo={settings?.logo} siteName={settings?.siteName} />
      <main> {children}</main>
      <Footer logo={settings?.logo} siteName={settings?.siteName} />
    </>
  )
}
