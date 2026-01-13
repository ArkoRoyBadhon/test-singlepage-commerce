export interface TResponse<T> {
  status?: number
  success: boolean
  message: string
  data?: T
  token?: string
  meta?: {
    totalDoc?: number | string
    page?: number | string
    limit?: number | string
    cursorIn?: string
    nextCursor?: string | null
    hasMore?: boolean
  }
}

const sendResponse = <T>(payload: TResponse<T>) => {
  return {
    success: payload.success,
    status: payload.status ?? 200,
    message: payload.message,
    token: payload.token,
    data: payload.data ?? null,
    meta: payload.meta
      ? {
          cursorIn: payload.meta.cursorIn,
          nextCursor: payload.meta.nextCursor ?? null,
          hasMore: payload.meta.hasMore ?? false,
          limit: payload.meta.limit ? Number(payload.meta.limit) : undefined,
          page: payload.meta.page ? Number(payload.meta.page) : undefined,
          totalDoc: payload.meta.totalDoc ? Number(payload.meta.totalDoc) : undefined,
        }
      : undefined,
  }
}

export default sendResponse
