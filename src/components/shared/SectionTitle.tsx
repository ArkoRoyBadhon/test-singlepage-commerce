import { cn } from '@/utils/cn'

interface SectionTitleProps {
  title: string
  description?: string
  position?: 'center' | 'left'
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

const SectionTitle = ({
  title,
  description,
  position = 'center',
  className,
  titleClassName,
  descriptionClassName,
}: SectionTitleProps) => {
  return (
    <div className={cn('flex flex-col gap-2', position === 'center' && 'items-center text-center', className)}>
      <h2 className={cn('font-heading text-2xl font-bold text-zinc-950 sm:text-3xl', titleClassName)}>{title}</h2>
      {description && (
        <p
          className={cn(
            'text-sm text-zinc-600 sm:text-base',
            position === 'center' && 'max-w-md',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionTitle
