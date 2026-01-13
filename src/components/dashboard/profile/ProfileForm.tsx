'use client'

import { changePassword } from '@/actions/auth/changePassword'
import { updateProfile } from '@/actions/auth/updateProfile'
import { Button } from '@/components'
import { Lock, Save, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProfileFormProps {
  user: {
    name: string | null
    email: string | null
    phone: string | null
  }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await updateProfile(null, formData)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await changePassword(null, formData)
      if (res.success) {
        toast.success(res.message || 'Password changed successfully')
        e.currentTarget.reset()
      } else {
        toast.error(res.message || 'Failed to change password')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setPasswordLoading(false)
    }
  }

  // Format phone for display (remove +88 for better UX if present)
  const displayPhone = user.phone?.startsWith('+88') ? user.phone.slice(3) : user.phone

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Profile Information */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
          <div className="rounded-full bg-blue-50 p-2 dark:bg-blue-900/20">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your account details</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name || ''}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2.5 text-sm text-gray-500 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <input
              type="text"
              name="phone"
              defaultValue={displayPhone || ''}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="017..."
            />
          </div>

          <div className="mt-2 flex justify-end">
            <Button type="submit" loading={profileLoading} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
          <div className="rounded-full bg-purple-50 p-2 dark:bg-purple-900/20">
            <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Confirm new password"
            />
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              loading={passwordLoading}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
