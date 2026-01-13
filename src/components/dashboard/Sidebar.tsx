'use client'

import { logOut } from '@/actions/auth/auth.action'
import { FileText, LayoutDashboard, LogOut, Mail, Package, Settings, ShoppingBag, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Blogs', href: '/dashboard/blogs', icon: FileText },
    { name: 'Messages', href: '/dashboard/contact-messages', icon: Mail },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      const res = await logOut()
      if ('success' in res && res.success) {
        toast.success(res.message || 'Logged out successfully')
        router.push('/')
      } else {
        toast.error('Logout failed')
      }
    } catch {
      toast.error('An error occurred during logout')
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-900 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0`}
    >
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        <div className="mb-6 flex items-center justify-between pt-2 pl-2.5">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <span className="self-center text-xl font-bold whitespace-nowrap text-gray-800 dark:text-white">
              Desi Admin
            </span>
          </Link>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900 sm:hidden dark:hover:text-white">
            <LogOut className="h-5 w-5 rotate-180" />
          </button>
        </div>

        <ul className="space-y-2 font-medium">
          {links.map((link) => {
            const Icon = link.icon
            // Check if current path matches or starts with the link href (for nested routes)
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`group flex items-center rounded-lg p-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary-color text-white shadow-md'
                      : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition duration-75 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                    }`}
                  />
                  <span className="ml-3 font-semibold">{link.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="mt-auto border-t border-gray-200 pt-4 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-lg p-3 text-gray-900 transition duration-75 hover:bg-red-50 hover:text-red-600 dark:text-white dark:hover:bg-gray-800 dark:hover:text-red-400"
          >
            <LogOut className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-red-600 dark:text-gray-400 dark:group-hover:text-red-400" />
            <span className="ml-3 font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
