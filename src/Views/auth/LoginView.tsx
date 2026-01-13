import { AuthContainer, LoginForm, SectionTitle } from '@/components'

const LoginView = () => {
  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-zinc-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <AuthContainer className="w-full max-w-md rounded-xl border border-zinc-100 bg-white p-8 shadow-sm">
        <SectionTitle
          title="Welcome back"
          description="Enter your details to access your account"
          position="center"
          titleClassName="text-2xl font-bold tracking-tight text-zinc-900"
          descriptionClassName="text-zinc-500"
        />
        <div className="mt-8">
          <LoginForm />
        </div>
      </AuthContainer>
    </div>
  )
}

export default LoginView
