import { describe, expect, it } from "vitest"

import type { AuthTokens } from "@/auth/auth-tokens"
import { createMemoryTokenStore } from "@/auth/token-store"

const tokens: AuthTokens = {
  accessToken: "access",
  expiresAt: "2099-01-01T00:00:00.000Z",
  refreshToken: "refresh",
  tokenType: "Bearer"
}

describe("token store generation", () => {
  it("rejects a late refresh write after logout", () => {
    const store = createMemoryTokenStore(tokens)
    const refreshGeneration = store.getGeneration()

    expect(store.clear()).toBe(true)
    expect(store.write(tokens, refreshGeneration)).toBe(false)
    expect(store.read({ allowExpired: true })).toBeNull()
  })

  it("allows a refresh write within the same session generation", () => {
    const store = createMemoryTokenStore(tokens)
    const refreshGeneration = store.getGeneration()
    const refreshed = { ...tokens, accessToken: "refreshed" }

    expect(store.write(refreshed, refreshGeneration)).toBe(true)
    expect(store.getGeneration()).toBe(refreshGeneration)
    expect(store.read()?.accessToken).toBe("refreshed")
  })
})
