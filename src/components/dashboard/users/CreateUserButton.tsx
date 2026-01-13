'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import CreateUserModal from './CreateUserModal'

export default function CreateUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        <Plus className="h-4 w-4" />
        Add User
      </button>
      <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
