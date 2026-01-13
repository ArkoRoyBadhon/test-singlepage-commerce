'use client'

import { createSystemUser } from '@/actions/auth/adminCreateUser'
import { Button } from '@/components'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function CreateUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const res = await createSystemUser(null, formData)
      if (!res.success) {
        toast.error(res.error || 'Failed to create user')
      } else {
        toast.success(res.message || 'User created successfully')
        onClose()
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create New User</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              required
              name="name"
              type="text"
              className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              required
              name="email"
              type="email"
              className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              required
              name="phone"
              type="text"
              placeholder="017..."
              className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              required
              name="password"
              type="password"
              className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              name="role"
              className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <Button type="submit" loading={loading} className="px-4 py-2">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
