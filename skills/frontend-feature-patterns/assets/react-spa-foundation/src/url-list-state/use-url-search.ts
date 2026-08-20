import { useCallback } from "react"

import { useSearchParamsUpdater, writeSearchParam } from "@/url-list-state/search-params"

export function useUrlSearch(key = "query") {
  const { searchParams, updateSearchParams } = useSearchParamsUpdater()
  const query = searchParams.get(key) ?? ""

  const setQuery = useCallback(
    (nextQuery: string) => {
      updateSearchParams(
        (params) => {
          writeSearchParam(params, key, nextQuery.trim())
          params.delete("page")
        },
        { replace: false }
      )
    },
    [key, updateSearchParams]
  )

  return { query, setQuery }
}
