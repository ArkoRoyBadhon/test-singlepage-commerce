import { AuthContainer, Button, Link, SectionTitle } from '@/components'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-zinc-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <AuthContainer className="w-full max-w-md rounded-xl border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-red-50 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          <SectionTitle
            title="Authentication Error"
            description="There was a problem confirming your email. The link may have expired or is invalid."
            position="center"
            titleClassName="text-2xl font-bold tracking-tight text-zinc-900"
            descriptionClassName="text-zinc-500"
          />

          <div className="mt-4 flex w-full flex-col gap-3">
            <Link href="/register" className="w-full">
              <Button className="w-full">Try Registering Again</Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200">Go to Login</Button>
            </Link>
          </div>
        </div>
      </AuthContainer>
    </div>
  )
}
