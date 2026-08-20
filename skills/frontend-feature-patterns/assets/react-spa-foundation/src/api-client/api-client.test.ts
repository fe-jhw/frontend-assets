import { describe, expect, it, vi } from "vitest"

import { createApiClient } from "@/api-client/api-client"
import type { AuthTokens } from "@/auth/auth-tokens"
import { createMemoryTokenStore } from "@/auth/token-store"

const oldTokens: AuthTokens = {
  accessToken: "old-access",
  expiresAt: "2099-01-01T00:00:00.000Z",
  refreshToken: "old-refresh",
  tokenType: "Bearer"
}

const newTokens: AuthTokens = {
  accessToken: "new-access",
  expiresAt: "2099-01-01T00:00:00.000Z",
  refreshToken: "new-refresh",
  tokenType: "Bearer"
}

function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
    status
  })
}

describe("createApiClient", () => {
  it("shares one refresh request across concurrent 401 responses", async () => {
    const tokenStore = createMemoryTokenStore(oldTokens)
    let releaseRefresh: () => void = () => undefined
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = () => resolve()
    })
    let refreshCalls = 0

    const fetcher = vi.fn<typeof fetch>(async (input, init) => {
      const url = String(input)
      if (url.endsWith("/auth/refresh")) {
        refreshCalls += 1
        await refreshGate
        return jsonResponse(newTokens)
      }

      const accessToken = new Headers(init?.headers).get("Authorization")
      return accessToken === "Bearer new-access"
        ? jsonResponse({ ok: true })
        : jsonResponse({ message: "Unauthorized" }, 401)
    })
    const client = createApiClient({ baseUrl: "/api", fetcher, tokenStore })

    const requests = [
      client.request<{ ok: true }>("/items"),
      client.request<{ ok: true }>("/items")
    ]
    await vi.waitFor(() => expect(refreshCalls).toBe(1))
    releaseRefresh()

    await expect(Promise.all(requests)).resolves.toEqual([{ ok: true }, { ok: true }])
    expect(refreshCalls).toBe(1)
  })

  it("retries a late 401 with the token from a newer session", async () => {
    const tokenStore = createMemoryTokenStore(oldTokens)
    let releaseFirstRequest: () => void = () => undefined
    const firstRequestGate = new Promise<void>((resolve) => {
      releaseFirstRequest = () => resolve()
    })
    let resourceCalls = 0
    let refreshCalls = 0

    const fetcher = vi.fn<typeof fetch>(async (input, init) => {
      if (String(input).endsWith("/auth/refresh")) {
        refreshCalls += 1
        return jsonResponse(newTokens)
      }

      resourceCalls += 1
      if (resourceCalls === 1) {
        await firstRequestGate
        return jsonResponse({ message: "Unauthorized" }, 401)
      }

      expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer new-access")
      return jsonResponse({ ok: true })
    })
    const client = createApiClient({ baseUrl: "/api", fetcher, tokenStore })
    const request = client.request<{ ok: true }>("/items")

    expect(tokenStore.write(newTokens)).toBe(true)
    releaseFirstRequest()

    await expect(request).resolves.toEqual({ ok: true })
    expect(refreshCalls).toBe(0)
  })

  it("retries only once and expires the current session after another 401", async () => {
    const tokenStore = createMemoryTokenStore(oldTokens)
    const onSessionExpired = vi.fn()
    let refreshCalls = 0

    const fetcher = vi.fn<typeof fetch>(async (input) => {
      if (String(input).endsWith("/auth/refresh")) {
        refreshCalls += 1
        return jsonResponse(newTokens)
      }

      return jsonResponse({ message: "Unauthorized" }, 401)
    })
    const client = createApiClient({
      baseUrl: "/api",
      fetcher,
      onSessionExpired,
      tokenStore
    })

    await expect(client.request("/items")).rejects.toMatchObject({ status: 401 })
    expect(refreshCalls).toBe(1)
    expect(onSessionExpired).toHaveBeenCalledOnce()
    expect(tokenStore.read({ allowExpired: true })).toBeNull()
  })

  it("rejects absolute URLs at the internal API boundary", async () => {
    const fetcher = vi.fn<typeof fetch>()
    const client = createApiClient({
      baseUrl: "/api",
      fetcher,
      tokenStore: createMemoryTokenStore()
    })

    await expect(client.request("https://files.example.com/report")).rejects.toThrow(
      "API client paths must be relative."
    )
    expect(fetcher).not.toHaveBeenCalled()
  })
})
