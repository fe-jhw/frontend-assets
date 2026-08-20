import { useCallback, useEffect } from "react"

import { useSearchParamsUpdater, writeSearchParam } from "@/url-list-state/search-params"
import {
  DEFAULT_PAGE_SIZES,
  normalizePage,
  parseCanonicalPositiveInteger,
  resolvePageSize
} from "@/pagination/pagination-values"

type SetPageOptions = {
  replace?: boolean
}

type UseUrlPaginationOptions = {
  defaultSize?: number
  pageSizes?: readonly number[]
}

export function useUrlPagination({
  defaultSize = 20,
  pageSizes = DEFAULT_PAGE_SIZES
}: UseUrlPaginationOptions = {}) {
  const { searchParams, updateSearchParams } = useSearchParamsUpdater()
  const rawPage = searchParams.get("page")
  const rawSize = searchParams.get("size")
  const parsedPage = parseCanonicalPositiveInteger(rawPage)
  const parsedSize = rawSize === null ? defaultSize : parseCanonicalPositiveInteger(rawSize)
  const hasSupportedSize = parsedSize !== null && pageSizes.includes(parsedSize)
  const size = hasSupportedSize ? parsedSize : defaultSize
  const page = hasSupportedSize && parsedPage !== null ? parsedPage : 1
  const shouldNormalizeSize = rawSize !== null && (!hasSupportedSize || parsedSize === defaultSize)
  const shouldNormalizePage =
    rawPage !== null && (!hasSupportedSize || parsedPage === null || parsedPage === 1)

  useEffect(() => {
    if (!shouldNormalizePage && !shouldNormalizeSize) {
      return
    }

    updateSearchParams((params) => {
      if (shouldNormalizeSize) {
        params.delete("size")
      }
      if (shouldNormalizePage || !hasSupportedSize) {
        params.delete("page")
      }
    })
  }, [hasSupportedSize, shouldNormalizePage, shouldNormalizeSize, updateSearchParams])

  const setPage = useCallback(
    (nextPage: number, options?: SetPageOptions) => {
      updateSearchParams(
        (params) => {
          writeSearchParam(params, "page", String(normalizePage(nextPage)), "1")
        },
        { replace: options?.replace ?? false }
      )
    },
    [updateSearchParams]
  )

  const setSize = useCallback(
    (nextSize: number) => {
      const resolved = resolvePageSize(nextSize, pageSizes, defaultSize)
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
