'use client'

import { deleteUser } from '@/actions/auth/adminDeleteUser'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { User } from '@/generated/prisma/client'

export default function UserTable({ users, currentUserId }: { users: User[]; currentUserId?: number }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null)

  const router = useRouter()

  const initiateDelete = (id: number) => {
    setUserIdToDelete(id)
    setConfirmModalOpen(true)
  }

  const handleDelete = async () => {
    if (!userIdToDelete) return

    setDeletingId(userIdToDelete)
    try {
      const res = await deleteUser(userIdToDelete)
      if (res.success) {
        toast.success('User deleted successfully')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to delete')
      }
    } catch {
      toast.error('Error deleting user')
    } finally {
      setDeletingId(null)
      setConfirmModalOpen(false)
      setUserIdToDelete(null)
    }
  }

  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name || 'N/A'}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}
                  >
                    {user.role || 'USER'}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => initiateDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="flex items-center gap-1 font-medium text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will remove the user from both the database and authentication system."
        confirmText="Delete User"
        isLoading={deletingId !== null}
        variant="danger"
      />
    </>
  )
}
