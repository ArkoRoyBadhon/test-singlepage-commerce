'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface HeaderProps {
  logo?: string | null
  siteName?: string | null
}

const Header = ({ logo, siteName }: HeaderProps) => {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const pathname = usePathname()

  // Check for admin status
  useEffect(() => {
    const checkUser = async () => {
      const { createBrowserSupabaseClient } = await import('@/libs/supabase/client')
      const supabase = createBrowserSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.user_metadata?.role === 'ADMIN') {
        setIsAdmin(true)
      }
    }
    checkUser()
  }, [])

  const navItems = [
    { label: 'হোম', href: '/' },
    { label: 'সব পণ্য', href: '/all-products' },
    { label: 'ব্লগ', href: '/blog' },
    { label: 'যোগাযোগ', href: '/contact' },
    ...(isAdmin ? [{ label: 'ড্যাশবোর্ড', href: '/dashboard' }] : []),
  ]

  return (
    <header className="font-inter relative z-50 w-full border-b border-green-700 text-black lg:z-50">
      <div className="wrapper flex w-full items-center justify-between py-[22px]">
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="flex flex-row items-center justify-center">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image src={logo || '/logo.png'} alt={siteName || 'Antilok'} fill className="object-cover" />
            </div>
            <span className="ml-2 text-[14px] font-bold">{siteName || 'দেশি'}</span>
          </Link>

          <button onClick={() => setOpen(!open)}>{open ? <X size={28} /> : <Menu size={28} />}</button>
        </div>

        <div className="hidden w-full items-center justify-between md:flex">
          <Link
            href="/"
            className="flex flex-row items-center justify-center transition-transform duration-200 hover:scale-[1.05]"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image src={logo || '/logo.png'} alt={siteName || 'Antilok'} fill className="object-cover" />
            </div>
            <span className="font-manrope ml-2 text-[32px] font-bold">{siteName || 'দেশি'}</span>
          </Link>

          <nav className="font-mont flex items-center gap-[36px] text-[16px] font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-secondary-color transition-all duration-400 hover:scale-[1.03] hover:underline ${
                  pathname === item.href ? 'text-secondary-color underline underline-offset-4' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/all-products"
            className="bg-secondary-color font-mont hover:bg-green flex h-[47px] w-[129px] items-center justify-center rounded text-[16px] text-white transition duration-400"
          >
            দাম জানুন
          </Link>
        </div>
      </div>

      <div
        className={`absolute top-full left-0 z-[60] w-full overflow-hidden bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } `}
      >
        <nav className="bg-solid-header-bg flex flex-col gap-6 px-5 py-5 text-center text-[18px] text-black">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`transition-colors duration-200 ${
                pathname === item.href
                  ? 'text-secondary-color font-bold underline underline-offset-4'
                  : 'hover:text-secondary-color text-black'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
