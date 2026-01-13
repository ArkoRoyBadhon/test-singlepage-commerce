import configs from '@/configs'
import type { IQueryMutationErrorResponse } from '@/interfaces'

const AppError = (
  message: string,
  status: number = configs.INTERNAL_SERVER_ERROR
): { error: IQueryMutationErrorResponse } => {
  return {
    error: {
      data: {
        message,
        errorMessages: [],
        status,
        success: false,
      },
      status,
    },
  }
}

export default AppError
