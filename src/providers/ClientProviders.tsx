'use client'

import { Toaster } from 'sonner'

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="top-center" richColors />
      {children}
    </>
  )
}

export default ClientProviders
