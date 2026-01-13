'use client'

import DashboardHeader from '@/components/dashboard/DashboardHeader'
import Sidebar from '@/components/dashboard/Sidebar'
import React, { useState } from 'react'

interface DashboardLayoutContentProps {
  user?: {
    name: string | null
    email: string | null
    role: string
  }
  children: React.ReactNode
}

export default function DashboardLayoutContent({ user, children }: DashboardLayoutContentProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="sm:ml-64">
        <DashboardHeader user={user} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="mt-4 p-4">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
