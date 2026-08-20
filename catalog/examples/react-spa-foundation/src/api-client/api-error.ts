export const INVALID_API_RESPONSE_MESSAGE = "The server returned an invalid response."
export const REQUEST_FAILED_MESSAGE = "The request failed."

export class ApiError extends Error {
  readonly code?: string
  readonly detail?: string
  readonly status?: number

  constructor(message: string, status?: number, code?: string, detail?: string) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.detail = detail
    this.status = status
  }
}

export function userFacingErrorMessage(error: unknown, fallback = REQUEST_FAILED_MESSAGE) {
  return error instanceof Error && error.message ? error.message : fallback
}
