export interface IQueryMutationErrorResponse {
  data: {
    message: string
    errorMessages: { path: string; message: string }[]
    status: number
    success: boolean
  }
  status?: number
}

export interface IErrorResponse {
  error: IQueryMutationErrorResponse
}

export interface ISuccessResponse {
  success: boolean
  status: number
  message: string
  data?: unknown
  token?: string
  meta?: unknown
}

export type TServerActionResponse = IErrorResponse | ISuccessResponse

export const isErrorResponse = (res: TServerActionResponse): res is IErrorResponse => {
  return res !== null && typeof res === 'object' && 'error' in res
}

export const isSuccessResponse = (res: TServerActionResponse): res is ISuccessResponse => {
  return res !== null && typeof res === 'object' && 'success' in res && res.success === true
}

export type TSearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}
