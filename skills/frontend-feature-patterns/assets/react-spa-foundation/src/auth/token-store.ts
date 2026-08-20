import { parseAuthTokens, type AuthTokens } from "@/auth/auth-tokens"

export type TokenStore = {
  clear: (expectedGeneration?: number) => boolean
  getGeneration: () => number
  read: (options?: { allowExpired?: boolean }) => AuthTokens | null
  write: (tokens: AuthTokens, expectedGeneration?: number) => boolean
}

type StorageAdapter = Pick<Storage, "getItem" | "removeItem" | "setItem">

type CreateStorageTokenStoreOptions = {
  key: string
  now?: () => number
  onChange?: () => void
  storage: StorageAdapter
}

function isExpired(tokens: AuthTokens, now: () => number) {
  return Date.parse(tokens.expiresAt) <= now()
}

export function createStorageTokenStore({
  key,
  now = Date.now,
  onChange,
  storage
}: CreateStorageTokenStoreOptions): TokenStore {
  let generation = 0

  const clear: TokenStore["clear"] = (expectedGeneration) => {
    if (expectedGeneration != null && expectedGeneration !== generation) {
      return false
    }

    try {
      storage.removeItem(key)
    } catch {
      return false
    }

    generation += 1
    onChange?.()
    return true
  }

  const read: TokenStore["read"] = ({ allowExpired = false } = {}) => {
    let rawTokens: string | null
    try {
      rawTokens = storage.getItem(key)
    } catch {
      return null
    }

    if (!rawTokens) {
      return null
    }

    try {
      const tokens = parseAuthTokens(JSON.parse(rawTokens))
      if (!allowExpired && isExpired(tokens, now)) {
        clear()
        return null
      }

      return tokens
    } catch {
      clear()
      return null
    }
  }

  const write: TokenStore["write"] = (tokens, expectedGeneration) => {
    if (expectedGeneration != null && expectedGeneration !== generation) {
      return false
    }

    const parsedTokens = parseAuthTokens(tokens)
    if (isExpired(parsedTokens, now)) {
      return false
    }

    try {
      storage.setItem(key, JSON.stringify(parsedTokens))
    } catch {
      return false
    }

    if (expectedGeneration == null) {
      generation += 1
    }
    onChange?.()
    return true
  }

  return {
    clear,
    getGeneration: () => generation,
    read,
    write
  }
}

export function createMemoryTokenStore(
  initialTokens: AuthTokens | null = null,
  now: () => number = Date.now
): TokenStore {
  let generation = 0
  let tokens = initialTokens

  return {
    clear(expectedGeneration) {
      if (expectedGeneration != null && expectedGeneration !== generation) {
        return false
      }

      tokens = null
      generation += 1
      return true
    },
    getGeneration: () => generation,
    read({ allowExpired = false } = {}) {
      if (!tokens) {
        return null
      }

      if (!allowExpired && isExpired(tokens, now)) {
        tokens = null
        generation += 1
        return null
      }

      return tokens
    },
    write(nextTokens, expectedGeneration) {
      if (expectedGeneration != null && expectedGeneration !== generation) {
        return false
      }

      const parsedTokens = parseAuthTokens(nextTokens)
      if (isExpired(parsedTokens, now)) {
        return false
      }

      tokens = parsedTokens
      if (expectedGeneration == null) {
        generation += 1
      }
      return true
    }
  }
}
