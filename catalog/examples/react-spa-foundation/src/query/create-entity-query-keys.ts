const rootQueryKey = ["app"] as const

export function createEntityQueryKeys(scope: string) {
  const all = () => [...rootQueryKey, scope] as const

  return {
    all,
    lists: () => [...all(), "list"] as const,
    list: (params: object = {}) => [...all(), "list", params] as const,
    details: () => [...all(), "detail"] as const,
    detail: (id: string) => [...all(), "detail", id] as const
  }
}
