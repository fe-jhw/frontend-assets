import { useCallback } from "react"
import { useSearchParams } from "react-router"

type UpdateSearchParamsOptions = {
  replace?: boolean
}

export function useSearchParamsUpdater() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateSearchParams = useCallback(
    (update: (params: URLSearchParams) => void, options: UpdateSearchParamsOptions = {}) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          update(next)
          return next
        },
        { replace: options.replace ?? true }
      )
    },
    [setSearchParams]
  )

  return { searchParams, updateSearchParams }
}

export function readPositiveInteger(value: string | null, fallback: number) {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function writeSearchParam(
  params: URLSearchParams,
  key: string,
  value: string,
  defaultValue = ""
) {
  if (value === defaultValue) {
    params.delete(key)
    return
  }

  params.set(key, value)
}
