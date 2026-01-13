import { Button, Group, Input, Label } from '@/components'
import { UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const GeneralSettings = () => {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    siteName: '',
    phone: '',
    email: '',
    address: '',
    facebookUrl: '',
    logo: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (res.ok) {
        setFormData({
          siteName: data.siteName || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          facebookUrl: data.facebookUrl || '',
          logo: data.logo || '',
        })
      }
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    const objectUrl = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, logo: objectUrl }))
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let logoUrl = formData.logo

      if (selectedFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        const { uploadFile } = await import('@/actions/upload/upload.action')
        const uploadRes = await uploadFile(uploadFormData)

        if (!uploadRes.success || !uploadRes.url) {
          throw new Error(uploadRes.error || 'Logo upload failed')
        }
        logoUrl = uploadRes.url
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, logo: logoUrl }),
      })

      if (res.ok) {
        toast.success('Settings updated successfully')
        setSelectedFile(null)
      } else {
        toast.error('Failed to update settings')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  if (fetching) return <div>Loading...</div>

  return (
    <div className="max-w-6xl rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">General Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Group>
          <Label>Site Logo</Label>
          <div className="flex items-center gap-4">
            <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              {formData.logo ? (
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  <Image src={formData.logo} alt="Logo" fill className="object-contain p-2" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upload Logo</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
            {formData.logo && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, logo: '' }))
                  setSelectedFile(null)
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </Group>

        <Group>
          <Label htmlFor="siteName">Site Name</Label>
          <Input id="siteName" name="siteName" value={formData.siteName} onChange={handleChange} />
        </Group>

        <Group>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </Group>

        <Group>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </Group>

        <Group>
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleChange} />
        </Group>

        <Group>
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input id="facebookUrl" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} />
        </Group>

        <div className="pt-4">
          <Button type="submit" loading={loading} loadingText={uploading ? 'Uploading...' : 'Saving...'}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default GeneralSettings
