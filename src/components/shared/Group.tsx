import { cn } from '@/utils/cn'

type GroupProps = {
  children: React.ReactNode
  className?: string
}

export const Group = ({ children, className }: GroupProps) => {
  return <div className={cn('flex flex-col gap-2', className)}>{children}</div>
}
