import { useCallback, useEffect } from "react"

import { useSearchParamsUpdater, writeSearchParam } from "@/url-list-state/search-params"

type UseUrlFilterOptions<TValue extends string> = {
  allowedValues?: readonly TValue[]
  defaultValue: TValue
  preserveUnknown?: boolean
}

function resolveFilterValue<TValue extends string>(
  rawValue: string | null,
  options: UseUrlFilterOptions<TValue>
): TValue {
  if (!rawValue) {
    return options.defaultValue
  }

  if (options.preserveUnknown || !options.allowedValues) {
    return rawValue as TValue
  }

  return options.allowedValues.includes(rawValue as TValue)
    ? (rawValue as TValue)
    : options.defaultValue
}

export function useUrlFilter<TValue extends string>(
  key: string,
  options: UseUrlFilterOptions<TValue>
) {
  const { searchParams, updateSearchParams } = useSearchParamsUpdater()
  const rawValue = searchParams.get(key)
  const value = resolveFilterValue(rawValue, options)

  useEffect(() => {
    if (!rawValue || options.preserveUnknown || rawValue === value) {
      return
    }

    updateSearchParams((params) => {
      writeSearchParam(params, key, value, options.defaultValue)
      params.delete("page")
    })
  }, [key, options.defaultValue, options.preserveUnknown, rawValue, updateSearchParams, value])

  const setValue = useCallback(
    (nextValue: TValue) => {
      const resolved = resolveFilterValue(nextValue, options)
      updateSearchParams(
        (params) => {
          writeSearchParam(params, key, resolved, options.defaultValue)
          params.delete("page")
        },
        { replace: false }
      )
    },
    [key, options, updateSearchParams]
  )

  return { setValue, value }
}
