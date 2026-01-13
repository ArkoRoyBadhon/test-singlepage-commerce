import { ClientProviders } from '@/providers'
import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const mont = Montserrat({
  variable: '--font-mont',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'দেশি',
  description: 'সততা, যত্ন এবং গ্রাহক সন্তুষ্টিকে সর্বোচ্চ গুরুত্ব দিয়ে আমরা প্রতিদিন কাজ করে যাচ্ছি',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body className={`$ ${mont.variable} ${inter.variable} antialiased`}>
        <ClientProviders>
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  )
}
