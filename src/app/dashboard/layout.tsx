import DashboardLayoutContent from '@/components/dashboard/DashboardLayoutContent'
import { prisma } from '@/libs/prisma/client'
import { createServerSupabaseClient } from '@/libs/supabase/server'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dashboard | Desi',
  description: 'Desi Admin Dashboard',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  let user = undefined
  if (authUser) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authUser.id },
      select: { name: true, email: true, role: true },
    })
    if (dbUser) user = { name: dbUser.name, email: dbUser.email, role: dbUser.role }
  }

  return <DashboardLayoutContent user={user}>{children}</DashboardLayoutContent>
}
