import ProfileForm from '@/components/dashboard/profile/ProfileForm'
import { prisma } from '@/libs/prisma/client'
import { createServerSupabaseClient } from '@/libs/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/auth/login')
  }

  const userData = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
    select: {
      name: true,
      email: true,
      phone: true,
    },
  })

  if (!userData) {
    return <div>User not found</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account settings and security.</p>
      </div>

      <ProfileForm user={userData} />
    </div>
  )
}
