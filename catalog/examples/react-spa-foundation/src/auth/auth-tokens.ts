import { z } from "zod"

import { ApiError, INVALID_API_RESPONSE_MESSAGE } from "@/api-client/api-error"

const nonEmptyString = z.string().trim().min(1)

export const authTokensSchema = z.object({
  accessToken: nonEmptyString,
  expiresAt: z
    .string()
    .refine((value) => Number.isFinite(Date.parse(value)), "expiresAt must be a valid date"),
  refreshToken: nonEmptyString,
  tokenType: z.literal("Bearer")
})

export type AuthTokens = z.infer<typeof authTokensSchema>

export function parseAuthTokens(value: unknown, status?: number): AuthTokens {
  const result = authTokensSchema.safeParse(value)
  if (!result.success) {
    throw new ApiError(INVALID_API_RESPONSE_MESSAGE, status)
  }

  return result.data
}
