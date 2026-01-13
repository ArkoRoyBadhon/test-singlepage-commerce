'use client'

import { Button, Group, Input, Label } from '@/components'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Faq } from '@/generated/prisma/client'

const FaqSettings = () => {
  const [faqs, setFaqs] = useState<Faq[]>([])
  // ... (lines 11-62 skipped for brevity in replacement, but wait, replace_file_content needs contiguous block or multi_replace. usage here is disparate)
  // I will use multi_replace for FaqSettings as edits are far apart.

  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  })
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faqs')
      if (res.ok) {
        const data = await res.json()
        setFaqs(data)
      }
    } catch {
      toast.error('Failed to load FAQs')
    }
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/faqs/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('FAQ deleted')
        fetchFaqs()
        setIsDeleteModalOpen(false)
        setDeleteId(null)
      } else {
        toast.error('Failed to delete FAQ')
      }
    } catch {
      toast.error('Error deleting FAQ')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleEdit = (faq: Faq) => {
    setEditingId(faq.id)
    setFormData({ question: faq.question, answer: faq.answer })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ question: '', answer: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingId ? `/api/faqs/${editingId}` : '/api/faqs'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(`FAQ ${editingId ? 'updated' : 'added'} successfully`)
        setFormData({ question: '', answer: '' })
        setEditingId(null)
        fetchFaqs()
      } else {
        toast.error(`Failed to ${editingId ? 'update' : 'add'} FAQ`)
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="max-w-6xl rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
          {editingId ? 'Edit FAQ' : 'Add New FAQ'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Group>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter question"
              required
            />
          </Group>

          <Group>
            <Label htmlFor="answer">Answer</Label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Enter answer"
              required
              className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/10 dark:border-gray-600 dark:text-white"
            />
          </Group>

          <div className="flex gap-3">
            <Button type="submit" loading={loading} loadingText={editingId ? 'Updating...' : 'Adding...'}>
              {editingId ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingId ? 'Update FAQ' : 'Add FAQ'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="grid gap-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="relative rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleEdit(faq)}
                className="rounded-full bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="rounded-full bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
            <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
        variant="danger"
      />
    </div>
  )
}

export default FaqSettings
