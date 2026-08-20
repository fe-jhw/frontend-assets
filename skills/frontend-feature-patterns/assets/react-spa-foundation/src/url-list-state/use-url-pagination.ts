import { useCallback, useEffect } from "react"

import {
  readPositiveInteger,
  useSearchParamsUpdater,
  writeSearchParam
} from "@/url-list-state/search-params"

type SetPageOptions = {
  replace?: boolean
}

type UseUrlPaginationOptions = {
  defaultSize?: number
  pageSizes?: readonly number[]
}

export function useUrlPagination({
  defaultSize = 20,
  pageSizes = [10, 20, 50]
}: UseUrlPaginationOptions = {}) {
  const { searchParams, updateSearchParams } = useSearchParamsUpdater()
  const requestedSize = readPositiveInteger(searchParams.get("size"), defaultSize)
  const hasSupportedSize = pageSizes.includes(requestedSize)
  const page = hasSupportedSize ? readPositiveInteger(searchParams.get("page"), 1) : 1
  const size = hasSupportedSize ? requestedSize : defaultSize

  useEffect(() => {
    if (!searchParams.has("size") || hasSupportedSize) {
      return
    }

    updateSearchParams((params) => {
      params.delete("size")
      params.delete("page")
    })
  }, [hasSupportedSize, searchParams, updateSearchParams])

  const setPage = useCallback(
    (nextPage: number, options?: SetPageOptions) => {
      updateSearchParams(
        (params) => {
          writeSearchParam(params, "page", String(Math.max(1, nextPage)), "1")
        },
        { replace: options?.replace ?? false }
      )
    },
    [updateSearchParams]
  )

  const setSize = useCallback(
    (nextSize: number) => {
      const resolved = pageSizes.includes(nextSize) ? nextSize : defaultSize
      updateSearchParams(
        (params) => {
          writeSearchParam(params, "size", String(resolved), String(defaultSize))
          params.delete("page")
        },
        { replace: false }
      )
    },
    [defaultSize, pageSizes, updateSearchParams]
  )

  return { page, setPage, setSize, size }
}
