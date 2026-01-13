'use client'

import { Bell, Search, User } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  user?: {
    name: string | null
    email: string | null
    role: string
  }
  toggleSidebar: () => void
}

const DashboardHeader = ({ user, toggleSidebar }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 sm:hidden dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <svg
            className="h-6 w-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5A.75.75 0 012.75 14h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
            ></path>
          </svg>
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-gray-300 bg-gray-50 pl-9 text-sm outline-none focus:border-[#15803d] focus:ring-1 focus:ring-[#15803d] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/profile" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'admin@example.com'}</p>
            </div>

            <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
              <User className="h-full w-full p-1 text-gray-500" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
