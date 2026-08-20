import {
  ApiError,
  INVALID_API_RESPONSE_MESSAGE,
  REQUEST_FAILED_MESSAGE
} from "@/api-client/api-error"
import { parseAuthTokens } from "@/auth/auth-tokens"
import type { TokenStore } from "@/auth/token-store"

type Parser<T> = (value: unknown) => T

type ApiRequestOptions<T> = {
  auth?: boolean
  body?: unknown
  headers?: HeadersInit
  method?: "DELETE" | "GET" | "PATCH" | "POST" | "PUT"
  parse?: Parser<T>
  signal?: AbortSignal
}

type CreateApiClientOptions = {
  baseUrl: string
  fetcher?: typeof fetch
  onSessionExpired?: () => void
  refreshPath?: string
  tokenStore: TokenStore
}

export type ApiClient = {
  request: <T>(path: string, options?: ApiRequestOptions<T>) => Promise<T>
}

function resolveInternalUrl(baseUrl: string, requestPath: string) {
  if (!requestPath || requestPath.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(requestPath)) {
    throw new Error("API client paths must be relative.")
  }

  const origin = globalThis.location?.origin ?? "http://localhost"
  const base = new URL(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`, origin)
  return new URL(requestPath.replace(/^\//, ""), base).toString()
}

function createHeaders(options: ApiRequestOptions<unknown>, accessToken?: string) {
  const headers = new Headers(options.headers)
  headers.set("Accept", "application/json")

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  return headers
}

async function readJson(response: Response) {
  const text = await response.text()
  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ApiError(INVALID_API_RESPONSE_MESSAGE, response.status)
  }
}

async function toApiError(response: Response) {
  let code: string | undefined
  let detail: string | undefined

  try {
    const value = await readJson(response)
    if (value && typeof value === "object") {
      if ("message" in value && typeof value.message === "string") {
        detail = value.message
      }
      if ("code" in value && typeof value.code === "string") {
        code = value.code
      }
    }
  } catch {
    // Preserve the HTTP status error when the error body itself is invalid.
  }

  return new ApiError(REQUEST_FAILED_MESSAGE, response.status, code, detail)
}

export function createApiClient({
  baseUrl,
  fetcher = fetch,
  onSessionExpired,
  refreshPath = "/auth/refresh",
  tokenStore
}: CreateApiClientOptions): ApiClient {
  const refreshByGeneration = new Map<number, Promise<boolean>>()

  const expireSession = (generation: number) => {
    const hadTokens = tokenStore.read({ allowExpired: true }) != null
    if (hadTokens && tokenStore.clear(generation)) {
      onSessionExpired?.()
    }
  }

  const refreshTokens = (generation: number, refreshToken: string) => {
    const existing = refreshByGeneration.get(generation)
    if (existing) {
      return existing
    }

    const refreshPromise = (async () => {
      const response = await fetcher(resolveInternalUrl(baseUrl, refreshPath), {
        body: JSON.stringify({ refreshToken }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST"
      })

      if (!response.ok) {
        return false
      }

      try {
        const tokens = parseAuthTokens(await readJson(response), response.status)
        return tokenStore.write(tokens, generation)
      } catch {
        return false
      }
    })()

    refreshByGeneration.set(generation, refreshPromise)
    void refreshPromise.finally(() => {
      if (refreshByGeneration.get(generation) === refreshPromise) {
        refreshByGeneration.delete(generation)
      }
    })
    return refreshPromise
  }

  async function send<T>(
    path: string,
    options: ApiRequestOptions<T>,
    canRetry: boolean
  ): Promise<Response> {
    const auth = options.auth ?? true
    const generation = tokenStore.getGeneration()
    const tokens = auth ? tokenStore.read({ allowExpired: true }) : null
    const response = await fetcher(resolveInternalUrl(baseUrl, path), {
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      headers: createHeaders(options, tokens?.accessToken),
      method: options.method ?? "GET",
      signal: options.signal
    })

    if (!auth || response.status !== 401) {
      return response
    }

    if (!canRetry) {
      expireSession(generation)
      return response
    }

    const latestTokens = tokenStore.read({ allowExpired: true })
    if (latestTokens && latestTokens.accessToken !== tokens?.accessToken) {
      return send(path, options, false)
    }

    if (!latestTokens) {
      return response
    }

    const refreshed = await refreshTokens(generation, latestTokens.refreshToken)
    if (!refreshed) {
      expireSession(generation)
      return response
    }

    return send(path, options, false)
  }

  return {
    async request<T>(path: string, options: ApiRequestOptions<T> = {}) {
      const response = await send(path, options, true)
      if (!response.ok) {
        throw await toApiError(response)
      }

      const value = await readJson(response)
      return options.parse ? options.parse(value) : (value as T)
    }
  }
}

export async function fetchExternal(
  absoluteUrl: string,
  options: RequestInit = {},
  fetcher: typeof fetch = fetch
) {
  const url = new URL(absoluteUrl)
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("External URLs must use HTTP or HTTPS.")
  }

  return fetcher(url, options)
}
