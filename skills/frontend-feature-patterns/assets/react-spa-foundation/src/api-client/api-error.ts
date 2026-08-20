export const INVALID_API_RESPONSE_MESSAGE = "The server returned an invalid response."

export class ApiError extends Error {
  readonly code?: string
  readonly status?: number

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }
}

export function userFacingErrorMessage(error: unknown, fallback = "The request failed.") {
  return error instanceof Error && error.message ? error.message : fallback
}
