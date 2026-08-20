import { useCallback, useState } from "react"

import { DEFAULT_PAGE_SIZES, normalizePage, resolvePageSize } from "@/pagination/pagination-values"

type UseLocalPaginationOptions = {
  defaultSize?: number
  initialPage?: number
  pageSizes?: readonly number[]
}

export function useLocalPagination({
  defaultSize = 20,
  initialPage = 1,
  pageSizes = DEFAULT_PAGE_SIZES
}: UseLocalPaginationOptions = {}) {
  const [page, setPageState] = useState(() => normalizePage(initialPage))
  const [size, setSizeState] = useState(() => resolvePageSize(defaultSize, pageSizes, defaultSize))

  const setPage = useCallback((nextPage: number) => {
    setPageState(normalizePage(nextPage))
  }, [])

  const setSize = useCallback(
    (nextSize: number) => {
      setSizeState(resolvePageSize(nextSize, pageSizes, defaultSize))
      setPageState(1)
    },
    [defaultSize, pageSizes]
  )

  const resetPage = useCallback(() => {
    setPageState(1)
  }, [])

  return { page, resetPage, setPage, setSize, size }
}
