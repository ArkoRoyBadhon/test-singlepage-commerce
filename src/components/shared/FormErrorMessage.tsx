import { Info } from 'lucide-react'

type FormErrorMessageProps = {
  message: string
  icon?: React.ReactNode
}

const FormErrorMessage = ({
  message,
  icon = <Info className="inline-block h-4 w-full max-w-4 text-red-500" />,
}: FormErrorMessageProps) => {
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 sm:text-sm">
      {icon}
      {message}
    </p>
  )
}

export default FormErrorMessage
