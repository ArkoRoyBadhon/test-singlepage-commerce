import { cn } from '@/utils/cn'

const AuthContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('flex w-full flex-col gap-3', className)}>{children}</div>
}

export default AuthContainer
