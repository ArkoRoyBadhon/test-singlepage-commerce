import CreateUserButton from '@/components/dashboard/users/CreateUserButton'
import UserTable from '@/components/dashboard/users/UserTable'
import { prisma } from '@/libs/prisma/client'
import { createServerSupabaseClient } from '@/libs/supabase/server'

export default async function UsersPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let currentUserId: number | undefined

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { id: true },
    })
    currentUserId = dbUser?.id
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // TODO: Get current logged in user ID to prevent self-deletion
  // For now passing generic check, or we can fetch it via supabase server client
  // const supabase = createServerSupabaseClient() ...

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage system users and administrators.</p>
        </div>
        <CreateUserButton />
      </div>

      <UserTable users={users} currentUserId={currentUserId} />
    </div>
  )
}
