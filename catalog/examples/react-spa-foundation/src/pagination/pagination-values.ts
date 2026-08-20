export const DEFAULT_PAGE_SIZES = [10, 20, 50] as const

export function parseCanonicalPositiveInteger(value: string | null) {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return null
  }

  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : null
}

export function normalizePage(value: number, fallback = 1) {
  return Number.isSafeInteger(value) && value > 0 ? value : fallback
}

export function resolvePageSize(value: number, pageSizes: readonly number[], defaultSize: number) {
  return pageSizes.includes(value) ? value : defaultSize
}
